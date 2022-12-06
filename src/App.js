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
  // offlineItems: "++id,name,username,email,address,phone,website,company",
  offlineItems:
    "++id,Id,name,firstname,lastname,email,primaryorganization,status",
});
function App() {
  const offlineItems = useLiveQuery(() => db.offlineItems.toArray(), []);
  if (!offlineItems) return null;

  const addItemToDb = async (event) => {
    // event.preventDefault();
    const name = document.querySelector("#first-name").value;
    const username = document.querySelector("#last-name").value;
    console.log(name + " " + username);
    await db.offlineItems.add({
      Id: "",
      name: "",
      firstname: name,
      lastname: username,
      email: "",
      primaryorganization: "",
      status: "",
    });
    // await db.offlineItems.add({
    //   name: name,
    //   username: username,
    //   phone: "",
    //   website: "",
    //   email: "",
    //   company: {},
    //   address: {},
    // });
  };

  return (
    <>
      <ResponsiveAppBar db={db} addItemToDb={addItemToDb} />
      <div style={{ margin: "10px" }}>
        <Routes>
          <Route
            exact
            path="/"
            element={<PeopleTableOne db={db} offlineItems={offlineItems} />}
          ></Route>
          <Route exact path="/about" element={<About />}></Route>
          {/* <Route path="/detail/:id" element={<PeopleDetails />}></Route> */}
        </Routes>
      </div>
    </>
  );
}

export default App;
