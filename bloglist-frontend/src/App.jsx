import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Blog from './components/Blog';
import UsersList from './components/UserList';
import { fetchBlogs, createBlog } from './redux/blogsSlice';
import { fetchUsers } from './redux/userSlice';

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const users = useSelector((state) => state.user.users); 
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });

  useEffect(() => {
    dispatch(fetchUsers()); 
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      dispatch(fetchBlogs());
    }
  }, [dispatch]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: null, type: null });
    }, 5000);
  };

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
      dispatch(fetchBlogs());
      showNotification('Login successful');
    } catch (exception) {
      showNotification('Wrong credentials', 'error');
    }
  };

  const handleCreateBlog = async (blog) => {
    try {
      await dispatch(createBlog(blog)); 
      dispatch(fetchBlogs()); 
      showNotification('Blog added successfully');
    } catch (exception) {
      showNotification('Error adding blog', 'error');
    }
  };

  const handleLike = async (blog) => {
    try {
      const updatedBlog = { ...blog, likes: blog.likes + 1 };
      await blogService.update(blog.id, updatedBlog);
      dispatch(fetchBlogs());
    } catch (exception) {
      showNotification('Error updating blog', 'error');
    }
  };

  const handleDelete = async (blog) => {
    if (
      window.confirm(
        `Are you sure you want to delete the blog "${blog.title}" by ${blog.author}?`
      )
    ) {
      try {
        await blogService.remove(blog.id);
        dispatch(fetchBlogs());
        showNotification(
          `The blog "${blog.title}" by ${blog.author} was deleted successfully`
        );
      } catch (exception) {
        showNotification('Error deleting blog', 'error');
      }
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
  };

  const sortedBlogs = Array.isArray(blogs)
    ? [...blogs].sort((a, b) => b.likes - a.likes)
    : [];

  if (user === null) {
    return (
      <div>
        <Notification message={notification.message} type={notification.type} />
        <h2>Log in to application</h2>
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      </div>
    );
  }

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>
      <div>
        <h2>create new</h2>
        <BlogForm
          handleCreateBlog={handleCreateBlog}
          newTitle={newTitle}
          newAuthor={newAuthor}
          newUrl={newUrl}
          setNewTitle={setNewTitle}
          setNewAuthor={setNewAuthor}
          setNewUrl={setNewUrl}
        />
      </div>
      <div>
        {sortedBlogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
            user={user}
          />
        ))}
      </div>

      
      <UsersList />
    </div>
  );
};

export default App;
