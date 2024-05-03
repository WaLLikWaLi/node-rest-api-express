import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import contactsRouter from "./routes/contactsRouter.js";
const DB_HOST =
  "mongodb+srv://Stas:krhmey69UbX8sK.@cluster0.qqpvege.mongodb.net/contact_reader?retryWrites=true&w=majority&appName=Cluster0";
mongoose.set("strictQuery", true);
mongoose
  .connect(DB_HOST)
  .then(() => console.log("Success"))
  .catch((error) => console.log(error.message));
const app = express();

app.use(morgan("combined"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
//krhmey69UbX8sK.
