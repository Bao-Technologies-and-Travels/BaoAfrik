// Simple test to verify Node.js can run files
console.log('Node.js is working!');
console.log('Current directory:', process.cwd());

// Try to list files in current directory
const fs = require('fs');
try {
  console.log('\nFiles in current directory:');
  fs.readdirSync('.').forEach(file => {
    console.log('-', file);
  });
} catch (err) {
  console.error('Error reading directory:', err);
}
