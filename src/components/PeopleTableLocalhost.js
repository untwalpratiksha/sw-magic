import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
const PeopleTableLocalhost = ({ db }) => {
  const [peoples, setPeoples] = useState([]);
  const [mode, setMode] = useState("online");

  const localhostFetchPeople = () => {
    fetch(
      "https://jllsa-dev.iwmsapp.com/tririga/p/webapi/rest/v2/peopleReactPU/-1/allPeopleRecordsPU?countOnly=false",
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    )
      .then((response) => {
        response.json().then((res) => {
          setPeoples(res.data);
        });
      })
      .catch((error) => {
        setMode("offline");
        console.log(error);
      });
  };

  useEffect(() => {
    localhostFetchPeople();
  }, []);

  const [columnDefs] = useState([
    { field: "id", filter: true, floatingFilter: true },
    { field: "name", filter: true, floatingFilter: true },
    { field: "firstname", filter: true, floatingFilter: true },
    { field: "lastname", filter: true, floatingFilter: true },
    { field: "email", filter: true, floatingFilter: true },
    { field: "primaryorganization", filter: true, floatingFilter: true },
    { field: "status", filter: true, floatingFilter: true },
  ]);

  return (
    <>
      <div>Peoples</div>
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

export default PeopleTableLocalhost;
