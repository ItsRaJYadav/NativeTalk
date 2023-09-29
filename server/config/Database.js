import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Connected To MongoDB Database ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error in MongoDB: ${error}`);
  }
};

export default connectDB;
