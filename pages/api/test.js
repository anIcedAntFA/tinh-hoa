import { dbConnect } from "../../dbConnect";
import Product from "../../models/Product";
import qs from "qs";
export default async function handler(req, res) {
  console.log(req.query);

  res.json("newProduct");
}
