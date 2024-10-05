import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UsersList = () => {
  const users = useSelector((state) => state.user?.users || []);
  const blogs = useSelector((state) => state.blogs || []);

  const usersWithBlogCount = users.map((user) => ({
    id: user?.id,
    name: user?.name,
    blogCount: blogs.filter((blog) => blog.user && blog.user.id === user.id)
      .length,
  }));

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Users and Blogs Created</h2>
      <ul className="list-group">
        {usersWithBlogCount.map((user) => (
          <li
            key={user.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <Link to={`/users/${user.id}`} className="text-decoration-none">
              {user.name}
            </Link>
            <span className="badge badge-primary badge-pill">
              {user.blogCount} blogs created
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
