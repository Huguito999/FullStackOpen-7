import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import blogService from '../services/blogs';
import { fetchBlogs } from '../redux/blogsSlice';
import { setNotification } from '../redux/notificationSlice';

const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id)
  );
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Fetch comments on mount and whenever the blog changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await blogService.getComments(id);
        setComments(fetchedComments);
      } catch (exception) {
        dispatch(setNotification('Error fetching comments', 'error'));
      }
    };

    if (blog) {
      fetchComments();
    }
  }, [blog, id, dispatch]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      await blogService.addComment(id, newComment);
      setNewComment(''); // Limpiar el campo de comentario
      // Fetch comments again to get the updated list
      const updatedComments = await blogService.getComments(id);
      setComments(updatedComments);
      dispatch(setNotification('Comment added successfully', 'success'));
    } catch (exception) {
      dispatch(setNotification('Error adding comment', 'error'));
    }
  };

  if (!blog) {
    return <div>Blog not found</div>;
  }

  const handleLike = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    try {
      await blogService.update(blog.id, updatedBlog);
      dispatch(fetchBlogs());
    } catch (exception) {
      dispatch(setNotification('Error updating likes', 'error'));
    }
  };

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>
        <strong>Author:</strong> {blog.author}
      </p>
      <p>
        <strong>URL:</strong> {blog.url}
      </p>
      <p>
        <strong>Likes:</strong> {blog.likes}
      </p>
      <button onClick={handleLike}>Like</button>
      
      <h3>Comments</h3>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>

      <h3>Add a Comment</h3>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BlogDetail;
