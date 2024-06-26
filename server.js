import mongoose from "mongoose";
import app from "./app";

const { DB_HOST } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000);
    console.log("Success");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });