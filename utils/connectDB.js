const {
  db_connection_error,
  db_connection_failed,
  db_url_not_defined_error,
} = require("@/important_data/important_data");
const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGODB_URL) {
    console.error("MongoDB URL is not defined in environment variables.");
    return {
      success_db: false,
      message_db: db_url_not_defined_error,
    };
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL);

    if ((connection?.connection?.readyState ?? 0) !== 1) {
      console.error("Database connection failed: Not ready.");
      return {
        success_db: false,
        message_db: db_connection_failed,
      };
    }

    return {
      success_db: true,
      message_db: null,
    };
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    return {
      success_db: false,
      message_db: db_connection_error,
    };
  }
};

module.exports = connectDB;
