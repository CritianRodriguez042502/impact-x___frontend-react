import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const axiosAllBlogs = createAsyncThunk("allBlogs", async () => {
  const url = `${"http://127.0.0.1:8000"}/blog/all_blog/`;
  try {
    const response = await axios.get(url);
    return {
      status : response.status,
      data : response.data
    };
  } catch (error) {
    return {
      status : error.response.status,
      data : error.response.data
    };
  }
});

const initialState = {
  info: null,
  status: null,
  error: null,
};

const allBlogsSlice = createSlice({
  name: "allBlogs",
  initialState,
  reducers: {},
  extraReducers: function (builder) {
    builder.addCase(axiosAllBlogs.pending, function (state) {
      state.status = "pending";
    });
    builder.addCase(axiosAllBlogs.fulfilled, function (state, action) {
      if (action.payload.status === 404) {
        state.status = "rejected"
        state.info = action.payload.data
      } else {
        state.status = "fulfilled"
        state.info = action.payload.data
      }
    });
  },
});

export default allBlogsSlice.reducer;
