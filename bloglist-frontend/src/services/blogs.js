import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  try {
    const config = {
      headers: { Authorization: token },
    };
    const response = await axios.get(baseUrl, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

const create = async (newBlog) => {
  try {
    const config = {
      headers: { Authorization: token },
    };
    const response = await axios.post(baseUrl, newBlog, config);
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

const update = async (id, updatedBlog) => {
  try {
    const config = {
      headers: { Authorization: token },
    };
    const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config);
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

const remove = async (id) => {
  try {
    const config = {
      headers: { Authorization: token },
    };
    await axios.delete(`${baseUrl}/${id}`, config);
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

const getComments = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

const addComment = async (id, comment) => {
  try {
    const config = {
      headers: { Authorization: token },
    };
    const response = await axios.post(`${baseUrl}/${id}/comments`, { comment }, config);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export default { getAll, setToken, create, update, remove, getComments, addComment };
