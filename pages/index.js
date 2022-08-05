import axios from "axios";
import qs from "qs";
import { Fragment, useEffect, useState } from "react";
import { createProduct } from "../fetching/product";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  size: yup
    .array()
    .min(1, "Size is required")
    .test("check", "Size is wrong", (v) => {
      return ["S", "M", "L", "XL"].includes(...v.map((size) => size.size1));
    }),
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
      size: [],
    },
    resolver: yupResolver(schema),
  });
  const {
    fields: size_field,
    append: addSize,
    remove: rmSize,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "size", // unique name for your Field Array
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
    <form
      onSubmit={handleSubmit(async (data) => {
        console.log({
          ...data,
          file: data.file.map((file) => file[0]),
          stock: data.size.reduce((s, { size1, quantity }) => {
            s[size1] = quantity;
            return s;
          }, {}),
        });
        try {
          const res = await axios({
            method: "GET",
            url: `http://localhost:3000/api/test?${qs.stringify({
              category: "ring",
              select: {
                name: 1,
                price: 1,
              },
            })}`,
          });
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
              <input {...register(`size[${index}].size1`)} />
              <input {...register(`size[${index}].quantity`)} />
              <button type="button" onClick={() => rmSize(index)}>
                Remove size
              </button>
            </div>
          ))}
        </div>
      </div>
      <button>Upload</button>
    </form>
  );
}
