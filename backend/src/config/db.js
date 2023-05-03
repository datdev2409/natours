const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function connect() {
  const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD } = process.env;
  const DB = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;
	console.log(DB)
  await mongoose.connect(DB);
  console.log('Database connected!!');
}

module.exports = { connect: connect };
