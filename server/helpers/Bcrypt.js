import bcrypt from 'bcrypt';

// Function to hash a password
export const hashPassword = async (password) => {
  try {
    const saltRounds = 10; // Number of salt rounds for hashing
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

export const comparePasswords = async (providedPassword, storedHashedPassword) => {
  try {
    const passwordMatch = await bcrypt.compare(providedPassword, storedHashedPassword);
    return passwordMatch;
  } catch (error) {
    throw error;
  }
};
