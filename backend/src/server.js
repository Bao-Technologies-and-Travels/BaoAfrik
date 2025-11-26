const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection based on the environment
const getDatabaseConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
    
  if (isProduction) {
    // Production - Use DATABASE_URL from environment variables
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL is required in production environment');
      process.exit(1);
    }
    
    const maskedUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@');
    
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    };
  } else {
    // Development - Use local PostgreSQL
    const localConfig = {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'baoafrik_dev',
      password: process.env.DB_PASSWORD || 'password',
      port: process.env.DB_PORT || 5432,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    };
    
    return localConfig;
  }
};

const poolConfig = getDatabaseConfig();
const pool = new Pool(poolConfig);

// Create table if not exists
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS waitlist_submissions (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      user_type VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      submission_date DATE GENERATED ALWAYS AS (created_at::DATE) STORED,
      submission_time TIME GENERATED ALWAYS AS (created_at::TIME(0)) STORED
    );
    
    CREATE INDEX IF NOT EXISTS idx_email ON waitlist_submissions(email);
    CREATE INDEX IF NOT EXISTS idx_created_at ON waitlist_submissions(created_at);
    CREATE INDEX IF NOT EXISTS idx_submission_date ON waitlist_submissions(submission_date);
  `;
  await pool.query(query);
};

createTable();

// Submit to waitlist
app.post("/api/waitlist", async (req, res) => {
  const { fullName, email, userType } = req.body;

  try {
    // Check if email already exists
    const existing = await pool.query(
      "SELECT id FROM waitlist_submissions WHERE email = $1",
      [email.toLowerCase()]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Insert new submission
    const result = await pool.query(
      `INSERT INTO waitlist_submissions 
       (full_name, email, user_type) 
       VALUES ($1, $2, $3) 
       RETURNING id, created_at`,
      [fullName, email.toLowerCase(), userType]
    );

    res.json({
      success: true,
      message: "Successfully added to waitlist",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get all submissions (for admin)
app.get("/api/admin/submissions", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM waitlist_submissions ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Export data to CSV and email
const exportAndEmailData = async () => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        full_name,
        email,
        user_type,
        submission_date,
        TO_CHAR(submission_time, 'HH24:MI:SS') as submission_time,
        created_at
      FROM waitlist_submissions
      ORDER BY created_at DESC
    `);

    if (result.rows.length === 0) {
      console.log("No data to export");
      return;
    }

    // Create CSV
    const headers = [
      "ID",
      "Full Name",
      "Email",
      "User Type",
      "Submission Date",
      "Submission Time",
    ];
    const csvRows = result.rows.map((row) =>
      [
        row.id,
        `"${row.full_name.replace(/"/g, '""')}"`,
        row.email,
        row.user_type,
        row.submission_date,
        row.submission_time
      ].join(",")
    );

    const csvContent = [headers.join(","), ...csvRows].join("\n");

    // Send email with attachment
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const weekEnding = new Date().toISOString().split("T")[0];
    const exportEmails = process.env.EXPORT_EMAIL.split(",").map((email) =>
      email.trim()
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: exportEmails,
      subject: `BAO Afrik Weekly Waitlist Export - Week Ending ${weekEnding}`,
      text: `Attached is the weekly waitlist export with ${result.rows.length} leads.\n\nNew leads this week: ${result.rows.length}`,
      attachments: [
        {
          filename: `bao'afrik-weekly-leads-${weekEnding}.csv`,
          content: csvContent,
          contentType: "text/csv",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Weekly export sent: ${result.rows.length} leads`);
  } catch (error) {
    console.error("Export/email error:", error);
  }
};

// Schedule weekly export on Monday at 8 AM
cron.schedule("0 8 * * 1", exportAndEmailData, {
  timezone: "Africa/Lagos",
});

// Manual trigger endpoint
app.post("/api/admin/export-now", async (req, res) => {
  try {
    await exportAndEmailData();
    res.json({
      success: true,
      message: "Weekly export completed and email sent to marketing team",
    });
  } catch (error) {
    console.error("Manual export error:", error);
    res.status(500).json({ success: false, message: "Export failed" });
  }
});

// Get weekly stats
app.get("/api/admin/weekly-stats", async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyResult = await pool.query(
      "SELECT COUNT(*) as weekly_count FROM waitlist_submissions WHERE created_at >= $1",
      [oneWeekAgo]
    );

    const totalResult = await pool.query(
      "SELECT COUNT(*) as total_count FROM waitlist_submissions"
    );

    const dailyStats = await pool.query(
      `SELECT 
        TO_CHAR(created_at, 'YYYY-MM-DD') as date,
        COUNT(*) as count
       FROM waitlist_submissions 
       WHERE created_at >= $1
       GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
       ORDER BY date DESC`,
      [oneWeekAgo]
    );

    res.json({
      weeklyCount: parseInt(weeklyResult.rows[0].weekly_count),
      totalCount: parseInt(totalResult.rows[0].total_count),
      weekStart: oneWeekAgo.toISOString().split("T")[0],
      dailyStats: dailyStats.rows,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
