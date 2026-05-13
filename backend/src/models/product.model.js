import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    user : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User"
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      required: true,
      default: 1,
    },

    category: {
      type: String,
      required: true,
    },

    isFeatured : {
      type : Boolean,
    },

    soldCount : {
      type : Number,
      default : 0
    },

    images: [
      {
        url: String,
        public_id: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
