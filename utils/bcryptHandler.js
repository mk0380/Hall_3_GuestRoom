const {
  bcrypt_password_salt_rounds,
} = require("@/important_data/important_data");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = parseInt(bcrypt_password_salt_rounds, 10) || 10;

const hashPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    console.error(`Error hashing password: ${error.message}`);
    throw new Error("Password hashing failed");
  }
};

const passwordMatch = async (password, userPassword) => {
  try {
    const match = await bcrypt.compare(password, userPassword);
    return match;
  } catch (error) {
    console.error(`Error comparing passwords: ${error.message}`);
    throw new Error("Password comparison failed");
  }
};

module.exports = { hashPassword, passwordMatch };
