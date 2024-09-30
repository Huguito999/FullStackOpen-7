import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      state.push(action.payload);
    },
  },
});

export const { setBlogs, addBlog } = blogsSlice.actions;

export const fetchBlogs = () => {
    return async (dispatch) => {
      try {
        const blogs = await blogService.getAll();
        if (Array.isArray(blogs)) {
          dispatch(setBlogs(blogs));
        } else {
          console.error('La respuesta no es un array:', blogs);
          dispatch(setBlogs([])); 
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        dispatch(setBlogs([])); 
      }
    };
  };
  

export const createBlog = (newBlog) => {
  return async (dispatch) => {
    try {
      const createdBlog = await blogService.create(newBlog);
      dispatch(addBlog(createdBlog)); 
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };
};

export default blogsSlice.reducer;
