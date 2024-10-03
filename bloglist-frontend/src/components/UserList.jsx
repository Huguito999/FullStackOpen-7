import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
const UsersList = () => {
  const users = useSelector((state) => state.user.users);
  const blogs = useSelector((state) => state.blogs);

  const usersWithBlogCount = users.map((user) => ({
    id: user.id,
    name: user.name,
    blogCount: blogs.filter((blog) => blog.user.id === user.id).length,
  }));

  return (
    <div>
      <h2>Users and Blogs Created</h2>
      <ul>
        {usersWithBlogCount.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>: {user.blogCount}{' '}
            blogs created
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
