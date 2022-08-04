import { dbConnect } from "../../dbConnect";
import Product from "../../models/Product";

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "POST") {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  }
}
