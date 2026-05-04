import dotenv from "dotenv"
dotenv.config();
import app from "./app.js";
import connetToMongoDb from "./src/db/db.js";
connetToMongoDb();
try {
  const PORT = process.env.PORT;

  app.listen(PORT, function () {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
    console.log(`Server is Not Running!!!` , error)
};

