import { dbConnect } from "../../dbConnect";
import Rating from "../../models/Rating";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect();
  console.log(req.query);
  const product_id = mongoose.Types.ObjectId(req.query.product_id);
  return res.status(200).json(
    await Rating.aggregate([
      {
        $group: {
          _id: "$count",
          count: {
            $sum: 1,
          },
        },
      },
      { $sort: { _id: 1 } },
    ])
  );
}
