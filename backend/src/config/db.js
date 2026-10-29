const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/legal_research_db';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to local MongoDB (${error.message}).`);
    console.log(`[Database] Enabling built-in In-Memory / Local Storage Fallback for zero-friction operation.`);
    isConnected = false;
  }
};

const getDBStatus = () => ({
  connected: isConnected,
  mode: isConnected ? 'MongoDB Live' : 'High-Performance Local Store (Fallback)'
});

module.exports = { connectDB, getDBStatus };

