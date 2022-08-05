import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { createProduct } from "../fetching/product";
import { useFieldArray, useForm } from "react-hook-form";

export default function Home() {
  const [picture, setPicture] = useState({});
  const [primaryPicture, setPrimaryPicture] = useState(0);
  const handleUpload1 = (event, index) => {
    setPicture((prev) => ({ ...prev, [index]: event.target.files[0] }));
  };
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      size: ["s"],
    },
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
      onSubmit={handleSubmit((data) =>
        console.log({ ...data, file: data.file.map((file) => file[0]) })
      )}
    >
      <div>
        <label>Name</label>
        <input {...register("name")} />
      </div>

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
      {/* {pic_field.map(({ id }, index) => (
        <Fragment key={id}>
          <div>
            <label>Image</label>

            <div>
              <button type="button" onClick={() => addSize("")}>
                Add Image
              </button>
              <input
                type="checkbox"
                name="primary"
                value={index}
                checked={primaryPicture === index}
                onChange={handleCheckPrimaryPicture}
              />
              <input type="file" {...register(`file[${index}]`)} />
              <button type="button" onClick={() => rmSize(index)}>
                Rm image
              </button>
            </div>
          </div>
        </Fragment>
      ))} */}
      <div style={{ display: "flex" }}>
        <label>Size</label>
        <div>
          <button type="button" onClick={() => addSize("")}>
            Add size
          </button>
          {size_field.map(({ id }, index) => (
            <div key={id}>
              <input {...register(`size[${index}]`)} />
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
