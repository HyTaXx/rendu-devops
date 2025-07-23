import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useApi, useApiMutation } from "@/hooks/useApi";
import { userService, postService } from "@/services/api";
import type { User, Post } from "@/types/api";

function ApiDemo() {
  // Example of automatic data fetching
  const {
    data: users,
    loading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useApi(() => userService.getUsers());

  // Example of manual mutation (for forms, buttons, etc.)
  const {
    data: newPost,
    loading: createPostLoading,
    error: createPostError,
    mutate: createPost,
  } = useApiMutation<
    Post,
    { title: string; content: string; authorId: string }
  >();

  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    authorId: "1", // Example author ID
  });

  const handleCreatePost = async () => {
    try {
      await createPost((data) => postService.createPost(data), postForm);
      alert("Post created successfully!");
      setPostForm({ title: "", content: "", authorId: "1" });
    } catch (error) {
      // Error is already handled by the hook
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">API Demo Page</h1>

        {/* Navigation */}
        <div className="flex gap-4 mb-8 justify-center">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/about">About</Link>
          </Button>
        </div>

        {/* Users List Example */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Users List</h2>
            <Button onClick={refetchUsers} disabled={usersLoading}>
              {usersLoading ? "Loading..." : "Refresh"}
            </Button>
          </div>

          {usersError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Error: {usersError}
            </div>
          )}

          {usersLoading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : users && users.length > 0 ? (
            <div className="grid gap-2">
              {users.map((user: User) => (
                <div
                  key={user.id}
                  className="border border-gray-200 rounded p-3"
                >
                  <div className="font-medium">{user.name}</div>
                  <div className="text-gray-600 text-sm">{user.email}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No users found. This might be because the API is not running yet.
            </div>
          )}
        </div>

        {/* Create Post Example */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Create New Post</h2>

          {createPostError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Error: {createPostError}
            </div>
          )}

          {newPost && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Post created successfully! ID: {newPost.id}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={postForm.title}
                onChange={(e) =>
                  setPostForm({ ...postForm, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter post title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                value={postForm.content}
                onChange={(e) =>
                  setPostForm({ ...postForm, content: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter post content..."
              />
            </div>

            <Button
              onClick={handleCreatePost}
              disabled={
                createPostLoading || !postForm.title || !postForm.content
              }
              className="w-full"
            >
              {createPostLoading ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </div>

        {/* API Configuration Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">API Configuration</h3>
          <p className="text-sm text-gray-600 mb-2">
            Current API Base URL:{" "}
            <code className="bg-gray-100 px-1 rounded">
              {import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}
            </code>
          </p>
          <p className="text-sm text-gray-600">
            To configure the API URL, create a{" "}
            <code className="bg-gray-100 px-1 rounded">.env</code> file and set{" "}
            <code className="bg-gray-100 px-1 rounded">
              VITE_API_BASE_URL=your_api_url
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ApiDemo;
