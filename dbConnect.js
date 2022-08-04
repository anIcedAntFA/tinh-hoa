import { connect } from "mongoose";

export const dbConnect = async () => {
  await connect("mongodb://localhost:27017/miki_shop");
  console.log("Connected to DB");
};
