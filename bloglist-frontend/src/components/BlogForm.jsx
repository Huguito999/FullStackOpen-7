import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setNotification, clearNotification } from '../redux/notificationSlice';

export default function BlogForm({
  handleCreateBlog,
  newTitle,
  newAuthor,
  newUrl,
  setNewTitle,
  setNewAuthor,
  setNewUrl,
}) {
  const [blogFormVisible, setBlogFormVisible] = useState(false);
  const dispatch = useDispatch();
  const hideWhenVisible = { display: blogFormVisible ? 'none' : '' };
  const showWhenVisible = { display: blogFormVisible ? '' : 'none' };

  const handleSubmit = (event) => {
    event.preventDefault();

    handleCreateBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });
    dispatch(
      setNotification({
        message: `A new blog "${newTitle}" by ${newAuthor} added!`,
        type: 'success',
      })
    );

    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={() => setBlogFormVisible(true)}>
          Create a new blog
        </button>
      </div>
      <div style={showWhenVisible}>
        <form onSubmit={handleSubmit}>
          <div>
            title
            <input
              type="text"
              value={newTitle}
              name="title"
              placeholder="title"
              onChange={({ target }) => setNewTitle(target.value)}
            />
          </div>
          <div>
            author
            <input
              type="text"
              value={newAuthor}
              name="author"
              placeholder="author"
              onChange={({ target }) => setNewAuthor(target.value)}
            />
          </div>
          <div>
            url
            <input
              type="text"
              value={newUrl}
              name="url"
              placeholder="url"
              onChange={({ target }) => setNewUrl(target.value)}
            />
          </div>
          <button type="submit">Create</button>
        </form>
        <button onClick={() => setBlogFormVisible(false)}>Cancel</button>
      </div>
    </div>
  );
}
