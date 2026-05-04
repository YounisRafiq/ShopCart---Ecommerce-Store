import mongoose from "mongoose";
import { db_Name } from "../../constants.js";

const connetToMongoDb = async () => {
  try {
    const Instance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${db_Name}`,
    );
    console.log(
      `MongoDb Connected SuccessFully || Db Host ${Instance.connection.host}`,
    );
  } catch (error) {
    console.log("Error Happen While Connecting the DataBase", error);
    process.exit(1);
  }
};

export default connetToMongoDb;
