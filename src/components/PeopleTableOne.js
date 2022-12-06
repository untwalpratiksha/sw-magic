import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
const PeopleTableOne = ({ db }) => {
  const [peoples, setPeoples] = useState([]);
  const [mode, setMode] = useState("online");

  const fetchData = () => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        setPeoples(response.data);
        // localStorage.setItem("peoples", JSON.stringify(response.data));
      })
      .catch((error) => {
        setMode("offline");
        console.log(error);
        // let collection = localStorage.getItem("peoples");
        // setPeoples(JSON.parse(collection));
      });
  };
  //Fetch Data for first time
  useEffect(() => {
    fetchData();
  }, []);

  //check user is online/offline
  useEffect(() => {
    // window.addEventListener("online", () => {
    //   console.log("Became online");
    //   fetchData();
    //   setMode("online");
    // });
    // window.addEventListener("offline", () => {
    //   console.log("Became offline");
    //   setMode("offline");
    // });
    // console.log(navigator);
    // return () => {
    //   window.removeEventListener("online");
    //   window.removeEventListener("offline");
    // };
  });

  // store fetched data into indexedDB
  const storeToIndexedDB = async (payload) => {
    console.log(payload);
    payload.map(async (item) => {
      await db.items.add({
        name: item.name,
        username: item.username,
        email: item.email,
        address: item.address,
        phone: item.phone,
        website: item.website,
        company: item.company,
      });
    });
  };

  //Columns name to show in ag-grid
  const [columnDefs] = useState([
    { field: "id" },
    { field: "name" },
    { field: "username" },
    { field: "email" },
    { field: "address" },
    { field: "phone" },
    { field: "website" },
    { field: "company" },
  ]);
  return (
    <>
      {mode === "offline" ? <div>You are in offline mode</div> : null}
      <div>People</div>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          rowData={peoples}
          columnDefs={columnDefs}
          pagination={true}
        ></AgGridReact>
      </div>
    </>
  );
};

export default PeopleTableOne;
