import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getPriorities = createAsyncThunk("priorities/getPriorities", async () => {
  return await axios.get(`/api/priorities`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
});