import multer from "multer";

import { v2 as cloudinary } from "cloudinary";
import { unlink } from "fs";
cloudinary.config({
  cloud_name: "",
  api_key: "",
  api_secret: "",
});
// disable next.js' default body parser
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  await new Promise((resolve) => {
    // you may use any other multer function
    const mw = multer({ storage: multer.diskStorage({}) }).any();

    //use resolve() instead of next()
    mw(req, res, resolve);
  });
  const res1 = await cloudinary.uploader.upload(req.files[0].path);
  unlink(req.files[0].path, (err) => {
    if (err) {
      console.log("failed to deleted file");
    }
  });
  // example response
  res.status(200).json({ url: res1.secure_url, public_id: res1.public_id });
}
