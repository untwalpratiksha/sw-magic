import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
const PeopleTableLocalhost = ({ allItems, db }) => {
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
          storeToIndexedDB(res.data);
          // localStorage.setItem("peoples", JSON.stringify(res.data)); // store data into local storage
        });
      })
      .catch((error) => {
        setMode("offline");
        console.log(error);
        let collection = localStorage.getItem("peoples"); //// get data from local storage
        setPeoples(JSON.parse(collection));
      });
  };

  const storeToIndexedDB = async (payload) => {
    console.log(payload);
    payload.map(async (item) => {
      await db.items.add({
        name: item.name,
        firstname: item.firstname,
        lastname: item.lastname,
        email: item.email,
        primaryorganization: item.primaryorganization,
        status: item.status,
      });
    });
  };
  useEffect(() => {
    localhostFetchPeople();
  }, []);
  useEffect(() => {
    window.addEventListener("online", () => {
      alert("Became online");
      localhostFetchPeople();
      setMode("online");
    });
    window.addEventListener("offline", () => {
      alert("Became offline");
      setMode("offline");
    });
    return () => {
      window.removeEventListener("online", alert("Became online"));
      window.removeEventListener("offline", alert("Became offline"));
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

export default PeopleTableLocalhost;
