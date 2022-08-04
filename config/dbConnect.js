import mongoose from "mongoose";

export default async function dbConnect() {
  return mongoose
    .connect("mongodb://localhost:27017/miki_shop")
    .then((res) => console.log("db connected"));
}
