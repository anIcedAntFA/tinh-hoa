import { dbConnect } from "../../dbConnect";
import Rating from "../../models/Rating";

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "POST") {
    const newRating = await Rating.create(req.body);
    res.json(newRating);
  }
}
