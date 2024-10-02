// blogsSlice.js
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
    updateBlog(state, action) {
      const id = action.payload.id;
      const blogToUpdate = state.find(blog => blog.id === id);
      if (blogToUpdate) {
        blogToUpdate.likes = action.payload.likes;
      }
    },
    removeBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload);
    },
  },
});

export const { setBlogs, addBlog, updateBlog, removeBlog } = blogsSlice.actions;

export const fetchBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (newBlog) => {
  return async (dispatch) => {
    const createdBlog = await blogService.create(newBlog);
    dispatch(addBlog(createdBlog));
  };
};

export const likeBlog = (id) => {
  return async (dispatch, getState) => {
    const blog = getState().blogs.find(b => b.id === id);
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    await blogService.update(id, updatedBlog);
    dispatch(updateBlog(updatedBlog));
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id);
    dispatch(removeBlog(id));
  };
};

export default blogsSlice.reducer;
