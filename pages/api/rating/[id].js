import { dbConnect } from "../../../dbConnect";
import Rating from "../../../models/Rating";

export default async function handler(req, res) {
  await dbConnect();
  console.log(req.query);
  return res
    .status(200)
    .json("await Rating.find({ product_id: req.query.id })");
}
