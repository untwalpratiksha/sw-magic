import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
const PeopleTableOne = () => {
  const [peoples, setPeoples] = useState([]);
  const [mode, setMode] = useState("online");

  const fetchData = () => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        setPeoples(response.data);
        localStorage.setItem("peoples", JSON.stringify(response.data));
      })
      .catch((error) => {
        setMode("offline");
        console.log(error);
        let collection = localStorage.getItem("peoples");
        setPeoples(JSON.parse(collection));
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
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
