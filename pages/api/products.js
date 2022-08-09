import { dbConnect } from "../../dbConnect";
import Product from "../../models/Product";

export default async function handler(req, res) {
  await dbConnect();
  return res.status(200).json(await Product.find({}));
}
