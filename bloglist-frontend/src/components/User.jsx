import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchUsers } from '../redux/userSlice';

const User = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const blogs = useSelector((state) => state.blogs);

  const user = users.find((user) => user?.id === id);

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users]);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  const userBlogs = blogs.filter((blog) => blog.user?.id === user?.id);

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {userBlogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
