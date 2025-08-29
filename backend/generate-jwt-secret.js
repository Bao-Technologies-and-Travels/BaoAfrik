const crypto = require('crypto');

// Generate a strong 64-byte random string
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('Generated JWT Secret:');
console.log(jwtSecret);
console.log('\nCopy this to your .env file:');
console.log(`JWT_SECRET=${jwtSecret}`);
