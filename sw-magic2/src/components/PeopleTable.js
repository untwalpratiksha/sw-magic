import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
//Fetch API Data
import { getApiCall } from "../utils/helper";
import * as cstConstants from "../utils/constants";
const PeopleTable = ({ allItems, db }) => {
  const [peoples, setPeoples] = useState([]);
  const [mode, setMode] = useState("online");

  const fetchPeoples = () => {
    //use this while deploying onto tririga
    getApiCall(cstConstants.DS_All_PEOPLE_DATA).then((response) => {
      setPeoples(response.data);
    });
  };

  useEffect(() => {
    fetchPeoples();
  }, []);
  useEffect(() => {
    window.addEventListener("online", () => {
      alert("Became online");
      setMode("online");
    });
    window.addEventListener("offline", () => {
      alert("Became offline");
      setMode("offline");
    });
    return () => {
      window.removeEventListener("online", alert("RemoveBecame online"));
      window.removeEventListener("offline", alert("Remove Became offline"));
    };
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
        {mode === "offline" ? (
          <>
            <AgGridReact
              rowData={allItems}
              columnDefs={columnDefs}
              pagination={true}
            ></AgGridReact>
          </>
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

export default PeopleTable;
