import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
const PeopleTableOne = ({ db, allItems }) => {
  const [peoples, setPeoples] = useState([]);
  const [mode, setMode] = useState("online");

  const fetchData = () => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        setPeoples(response.data);
        storeToIndexedDB(response.data);
        // localStorage.setItem("peoples", JSON.stringify(response.data));
      })
      .catch((error) => {
        setMode("offline");
        console.log(error);
        // let collection = localStorage.getItem("peoples");
        // setPeoples(JSON.parse(collection));
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

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
        {mode === "offline" ? (
          <AgGridReact
            rowData={allItems}
            columnDefs={columnDefs}
            pagination={true}
          ></AgGridReact>
        ) : (
          <AgGridReact
            rowData={peoples}
            columnDefs={columnDefs}
            pagination={true}
          ></AgGridReact>
        )}
      </div>
    </>
  );
};

export default PeopleTableOne;
