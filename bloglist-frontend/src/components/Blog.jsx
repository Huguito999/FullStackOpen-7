import { useState } from 'react'
import PropTypes from 'prop-types'
const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [showDetails, setShowDetails] = useState(false)

  const showWhenVisible = { display: showDetails ? '' : 'none' }

  const onLike = () => {
    handleLike(blog)
  }
  console.log(blog.user)

  const onDelete = () => {
    if (
      window.confirm(
        `Do you really want to delete the blog "${blog.title}" by ${blog.author}?`
      )
    ) {
      handleDelete(blog)
    }
  }

  return (
    <div style={blogStyle}>
      <div className='blog'>
        {blog.title} {blog.author}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          Likes &nbsp;
          {blog.likes} <button onClick={onLike}>like</button>
        </div>
        <div>Added by: {blog.user.username}</div>
        {user.username === blog.user.username && (
          <button onClick={onDelete}>Delete</button>
        )}
      </div>
    </div>
  )
}
Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
}
export default Blog
