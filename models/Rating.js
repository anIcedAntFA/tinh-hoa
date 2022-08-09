const { Schema, models, model } = require("mongoose");

const RatingSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    product_id: { type: Schema.Types.ObjectId, required: true },
    count: { type: Number, required: true, default: 5 },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
// _id > unique: true
// khi feedback => create rating

// khi query => find Rating.find({product_id: id from details}) => get All

// => group mongodb => phan loai duoc comment( 1 sao: bao nhieu luot danh gia, ...)

// => $sum => tinh ra duoc tong so danh gia  => tra ve client (tong so danh gia va so luong cua moi loai)

module.exports = models.Rating || model("Rating", RatingSchema);
