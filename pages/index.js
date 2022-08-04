import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { createProduct } from "../fetching/product";

export default function Home() {
  const [picture, setPicture] = useState({});
  const [primaryPicture, setPrimaryPicture] = useState(0);
  const handleUpload1 = (event, index) => {
    setPicture((prev) => ({ ...prev, [index]: event.target.files[0] }));
  };

  const handleUpload = async () => {
    const upload = await Promise.all(
      Object.entries(picture).map(([_, picture]) => {
        const formData = new FormData();
        formData.append("picture", picture);
        return axios({
          method: "POST",
          url: "http://localhost:3000/api/upload",
          data: formData,
        });
      })
    );
    const product = await createProduct({
      name: "Khoi",
      price: 1,
      images: upload
        .map((item) => item.data)
        .map((item, index) => ({
          ...item,
          type: index === primaryPicture ? "primary" : "secondary",
        })),
    });
    console.log(product);
  };

  const handleCheckPrimaryPicture = (event) => {
    setPrimaryPicture(+event.target.value);
  };
  return (
    <div>
      {[...Array(4)].map((_, index) => (
        <Fragment key={index}>
          <input
            type="checkbox"
            name="primary"
            value={index}
            checked={primaryPicture === index}
            onChange={handleCheckPrimaryPicture}
          />
          <input
            type="file"
            onChange={(event) => {
              handleUpload1(event, index);
            }}
          />
        </Fragment>
      ))}
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
