import mongoose from "mongoose";

const DB_HOST = process.env.DB_HOST;

mongoose.set("strictQuery", true);

mongoose  
  .connect(DB_HOST)
  .then(() => {
    console.log("Success");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
