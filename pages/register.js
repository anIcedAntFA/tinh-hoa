import React, { useEffect, useState } from "react";
import axios from "axios";

export default function register({ a }) {
  // const authState = useRecoilValue(authAtom);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const formInput = [
    {
      type: "text",
      label: "name",
    },
    {
      type: "text",
      label: "pmail",
    },
    {
      type: "password",
      label: "password",
    },
  ];

  useEffect(() => {
    //GET, POST, PUT, DELETE, PATCH  OPTIONS HEAD
    (async () => {
      const res = await axios({
        method: "PUT",
        url: "/api/user",
        data: "data",
        headers: {
          Authorization: "Bearer authState.accessToken",
        },
      });
      console.log(res.data);
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      {formInput.map((input, i) => (
        <div key={i}>
          <label
            style={{
              minWidth: "60px",
              display: "inline-block",
              textTransform: "capitalize",
            }}
          >
            {input.label}
          </label>
          <input
            type={input.type}
            onChange={(event) => {
              setData((prev) => ({
                ...prev,
                [input.label]: event.target.value,
              }));
            }}
          />
        </div>
      ))}
      <button>Submit</button>
    </form>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      a: "b",
    }, // will be passed to the page component as props
  };
}
