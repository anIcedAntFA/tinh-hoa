import axios from "axios";
import qs from "qs";
import { Fragment, useEffect, useState } from "react";
import { createProduct } from "../fetching/product";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  // stock: yup
  //   .array()
  //   .min(1, "Size is required")
  //   .test("check", "Size is wrong", (v) => {
  //     return ["S", "M", "L", "XL"].includes(...v.map((stock) => stock.size));
  //   }),
});

export default function Home() {
  const [picture, setPicture] = useState({});
  const [primaryPicture, setPrimaryPicture] = useState(0);
  const handleUpload1 = (event, index) => {
    setPicture((prev) => ({ ...prev, [index]: event.target.files[0] }));
  };
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      stock: [],
    },
    resolver: yupResolver(schema),
  });
  const {
    fields: size_field,
    append: addSize,
    remove: rmSize,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "stock", // unique name for your Field Array
  });
  const {
    fields: pic_field,
    append: addPic,
    remove: rmPic,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "file", // unique name for your Field Array
  });
  const handleUpload = async () => {
    // const upload = await Promise.all(
    //   Object.entries(picture).map(([_, picture]) => {
    //     const formData = new FormData();
    //     formData.append("picture", picture);
    //     return axios({
    //       method: "POST",
    //       url: "http://localhost:3000/api/upload",
    //       data: formData,
    //     });
    //   })
    // );
  };
  const handleCheckPrimaryPicture = (event) => {
    setPrimaryPicture(+event.target.value);
  };
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const formData = new FormData();
        data.file.forEach((file) => formData.append("file", file[0]));

        // console.log({
        //   ...data,
        //   file: data.file.map((file) => file[0]),
        //   stock: data.stock.reduce((s, { size, quantity }) => {
        //     s[size] = quantity;
        //     console.log(s);
        //     return s;
        //   }, {}),
        // });

        // [{url: "1", public_id: "1"}, file, {url: "3", public_id: "3"}]

        // isString lodash => false => filter [file] => upload => response => index => map => replace =>  call api

        try {
          //4 anh => update 1 anh => upload 1 anh
          // khi upload => logic => only file
          const upload = await axios({
            method: "POST",
            url: "http://localhost:3000/api/upload",
            data: formData,
          });
          console.log(upload.data);

          const product = await createProduct({
            name: "Khoi",
            price: 1,
            images: upload.data.map((item, index) => ({
              ...item,
              type: index === primaryPicture ? "primary" : "secondary",
            })),
          });
          console.log(product);
          // const res = await axios({
          //   method: "GET",
          //   url: `http://localhost:3000/api/test?${qs.stringify({
          //     category: "ring",
          //     select: {
          //       name: 1,
          //       price: 1,
          //     },
          //   })}`,
          // });
        } catch (err) {
          console.log(err);
        }
      })}
    >
      <div>
        <label>Name</label>
        <input {...register("name")} />
      </div>
      <span>{errors?.size?.message}</span>
      <div style={{ display: "flex" }}>
        <label>Image</label>
        <div>
          <button type="button" onClick={() => addPic(null)}>
            Add Image
          </button>
          {pic_field.map(({ id }, index) => (
            <div key={id}>
              <input
                type="checkbox"
                name="primary"
                value={index}
                checked={primaryPicture === index}
                onChange={handleCheckPrimaryPicture}
              />
              <input type="file" {...register(`file[${index}]`)} />
              <button type="button" onClick={() => rmPic(index)}>
                Rm Image
              </button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <label>Size</label>
        <div>
          <button type="button" onClick={() => addSize("")}>
            Add size
          </button>

          {size_field.map(({ id }, index) => (
            <div key={id}>
              <input {...register(`stock[${index}].size`)} />
              <input {...register(`stock[${index}].quantity`)} />
              <button type="button" onClick={() => rmSize(index)}>
                Remove size
              </button>
            </div>
          ))}
        </div>
      </div>
      <button>Upload</button>
      <button
        type="button"
        onClick={async () => {
          const res = await axios({
            method: "POST",
            url: `/api/create-rating`,
            data: {
              user_id: "62f23a340eba31bf91cbce14",
              product_id: "62f23a340eba31bf91cbce12",
              count: Math.ceil(Math.random() * 5),
              comment: "San pham qua tot",
            },
          });
          console.log(res.data);
        }}
      >
        add rating
      </button>
      <button
        type="button"
        onClick={async () => {
          const res = await axios({
            method: "GET",
            url: `/api/ratings?product_id=62f23a340eba31bf91cbce12`,
          });
          console.log(res.data);
        }}
      >
        get all with rating
      </button>
    </form>
  );
}
