import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';
import userService from '../services/userService';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    users: [],
  },
  reducers: {
    setUser(state, action) {
      state.currentUser = action.payload;
    },
    clearUser(state) {
      state.currentUser = null;
    },
    setUsers(state, action) {
      state.users = action.payload;
    },
  },
});

export const { setUser, clearUser, setUsers } = userSlice.actions;

export const loginUser = (credentials) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(credentials);
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      dispatch(setUser(user));
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    window.localStorage.removeItem('loggedBlogAppUser');
    dispatch(clearUser());
  };
};

export const initializeUser = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
    }
  };
};


export const fetchUsers = () => {
  return async (dispatch) => {
    try {
      const users = await userService.getAll();
      dispatch(setUsers(users));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
};

export default userSlice.reducer;
