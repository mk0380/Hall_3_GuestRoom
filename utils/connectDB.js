const {
  db_connection_error,
  db_connection_failed,
  db_url_not_defined_error,
} = require("@/important_data/important_data");
const mongoose = require("mongoose");

const connectDB = async (res) => {
  if (!process.env.MONGODB_URL) {
    console.error("MongoDB URL is not defined in environment variables.");
    // return responseHandler(res, false, 503, db_url_not_defined_error);
    return {
      success: false,
      message: db_url_not_defined_error
    }
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL);

    if ((connection?.connection?.readyState ?? 0) !== 1) {
      console.error("Database connection failed: Not ready.");
      // return responseHandler(res, false, 503, db_connection_failed);
      return {
        success: false,
        message: db_connection_failed
      }
    }

    return {
      success: true,
      message: ""
    }
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    // return responseHandler(res, false, 503, db_connection_error);
    return {
      success: false,
      message: db_connection_error
    }
  }
};

module.exports = connectDB;
