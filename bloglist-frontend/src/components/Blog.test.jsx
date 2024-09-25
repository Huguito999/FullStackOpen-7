import React, { useState } from 'react';
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";
import BlogForm from './BlogForm';

test("renders title and author but not url or likes by default", () => {
  const blog = {
    id: "1",
    title: "Testing React components",
    author: "Hugo",
    url: "https://test.com",
    likes: 10,
    user: {
      username: "testuser",
    },
  };

  const user = {
    username: "testuser",
  };

  render(
    <Blog
      blog={blog}
      user={user}
      handleLike={() => {}}
      handleDelete={() => {}}
    />
  );

  const titleAndAuthor = screen.getByText("Testing React components Hugo");
  expect(titleAndAuthor).toBeInTheDocument();

  const url = screen.queryByText("https://test.com", { exact: false });
  const likes = screen.queryByText("Likes 10", { exact: false });
  expect(url).not.toBeVisible();
  expect(likes).not.toBeVisible();
});

test('shows URL and likes when "view" button is clicked', async () => {
  const blog = {
    id: "1",
    title: "Testing React components",
    author: "Hugo",
    url: "https://test.com",
    likes: 10,
    user: {
      username: "testuser",
    },
  };

  const user = {
    username: "testuser",
  };

  render(
    <Blog
      blog={blog}
      user={user}
      handleLike={() => {}}
      handleDelete={() => {}}
    />
  );

  const url = screen.queryByText("https://test.com");
  const likes = screen.queryByText("Likes 10");
  expect(url).not.toBeVisible();
  expect(likes).not.toBeVisible();

  const button = screen.getByText("view");
  await userEvent.click(button);

  const visibleUrl = screen.getByText("https://test.com");
  const visibleLikes = screen.getByText("Likes 10");
  expect(visibleUrl).toBeVisible();
  expect(visibleLikes).toBeVisible();
});

test("clicking 'like' button twice calls event handler twice", async () => {
  const blog = {
    id: "1",
    title: "Testing React components",
    author: "Hugo",
    url: "https://test.com",
    likes: 10,
    user: {
      username: "testuser",
    },
  };

  const user = {
    username: "testuser",
  };

  const mockHandleLike = vi.fn();

  render(
    <Blog
      blog={blog}
      user={user}
      handleLike={mockHandleLike}
      handleDelete={() => {}}
    />
  );

  const userEventInstance = userEvent.setup();

  const likeButton = screen.getByText("like");

  await userEventInstance.click(likeButton);
  await userEventInstance.click(likeButton);

  expect(mockHandleLike).toHaveBeenCalledTimes(2);
});

test('form calls handleCreateBlog with correct details when a new blog is created', async () => {
  const mockHandleCreateBlog = vi.fn();
  const userEventInstance = userEvent.setup();

  const TestWrapper = () => {
    const [newTitle, setNewTitle] = useState('');
    const [newAuthor, setNewAuthor] = useState('');
    const [newUrl, setNewUrl] = useState('');

    return (
      <BlogForm
        handleCreateBlog={mockHandleCreateBlog}
        newTitle={newTitle}
        newAuthor={newAuthor}
        newUrl={newUrl}
        setNewTitle={setNewTitle}
        setNewAuthor={setNewAuthor}
        setNewUrl={setNewUrl}
      />
    );
  };

  render(<TestWrapper />);

  const titleInput = screen.getByPlaceholderText('title');
  const authorInput = screen.getByPlaceholderText('author');
  const urlInput = screen.getByPlaceholderText('url');

  await userEventInstance.type(titleInput, 'New Blog Title');
  await userEventInstance.type(authorInput, 'New Blog Author');
  await userEventInstance.type(urlInput, 'https://newblogurl.com');

  const createButton = screen.getByText('Create');
  await userEventInstance.click(createButton);

  expect(mockHandleCreateBlog).toHaveBeenCalledTimes(1);
  expect(mockHandleCreateBlog).toHaveBeenCalledWith({
    title: 'New Blog Title',
    author: 'New Blog Author',
    url: 'https://newblogurl.com',
  });
});