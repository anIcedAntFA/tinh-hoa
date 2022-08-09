const { Schema, models, model } = require("mongoose");

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        type: {
          type: String,
          enum: ["primary", "secondary"],
          default: "secondary",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = models.Product || model("Product", ProductSchema);
