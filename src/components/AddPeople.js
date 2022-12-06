import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
//Fetch API Data
import { performAction } from "../utils/helper";
import * as cstConstants from "../utils/constants";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #fff",
  boxShadow: 24,
  p: 4,
};
const AddPeople = ({ open, handleClose, addItemToDb, db }) => {
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");

  const navigate = useNavigate();

  const handleAddPeople = () => {
    // console.log(firstName, lastName);
    console.log(name, username);
    const newData = { name: name, username: username };
    addItemToDb();
    // performAction(
    //   cstConstants.DS_All_PEOPLE_DATA,
    //   newData,
    //   "createActionPU",
    //   "createDraftPU"
    // ).then((data) => {
    //   console.log(data.createdRecordId);
    //   navigate(`/`, { state: { peopleAdded: true } });
    //   handleClose();
    //   setFirstName("");
    //   setLastName("");
    // });
  };
  const removeItemFromDb = async (id) => {
    await db.items.delete(id);
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add People
        </Typography>
        <TextField
          sx={{ mr: 1 }}
          id="first-name"
          label="Name"
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          id="last-name"
          label="User Name"
          variant="standard"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
        <Stack sx={{ mt: 4, direction: "rtl" }} direction="row">
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleAddPeople}>
            Add
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddPeople;
