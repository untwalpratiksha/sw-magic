import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import About from "./components/About";
import ResponsiveAppBar from "./components/Navbar/ResponsiveAppBar";
import PeopleTableOne from "./components/PeopleTableOne";

import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";

const db = new Dexie("MarketList");
db.version(1).stores({
  items: "++id,name,username,email,address,phone,website,company",
});

function App() {
  const allItems = useLiveQuery(() => db.items.toArray(), []);
  if (!allItems) return null;

  // const addItemToDb = async (event) => {
  //   // event.preventDefault();
  //   const name =
  //     document.querySelector("#first-name").value +
  //     " " +
  //     document.querySelector("#last-name").value;
  //   const firstName = document.querySelector("#first-name").value;
  //   const lastName = document.querySelector("#last-name").value;
  //   console.log(name + " " + lastName);
  //   await db.items.add({
  //     name: name,
  //     firstname: firstName,
  //     lastname: lastName,
  //     email: "",
  //     primaryorganization: "",
  //     status: "",
  //   });
  // };
  return (
    <>
      <ResponsiveAppBar />
      <div style={{ margin: "10px" }}>
        <Routes>
          <Route
            exact
            path="/"
            element={<PeopleTableOne db={db} allItems={allItems} />}
          ></Route>
          <Route exact path="/about" element={<About />}></Route>
          {/* <Route path="/detail/:id" element={<PeopleDetails />}></Route> */}
        </Routes>
      </div>
    </>
  );
}

export default App;
