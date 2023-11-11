import mongoose from 'mongoose';

let connectDB  = async (MONGODB_URL) => {

  try {
    const DB_OPTIONS = {
      dbName: "realtimechat"
    }
      await mongoose.connect(MONGODB_URL, DB_OPTIONS);

      console.log(`DataBase connected successfully...........`)
  }catch(error) {
    console.log(error)
  }
}
export default connectDB;