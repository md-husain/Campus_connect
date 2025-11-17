import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';
import PostCard from '../components/Cards/PostCard';
import UniversityInfo from '../components/Universityinfo'; 
import Sidebar from '../components/Common/Sidebar';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    tags: '',
  });
  const [postMedia, setPostMedia] = useState(null);
  const [postLoading, setPostLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      console.log("Fetching posts for page:", page);
      
      const response = await postAPI.getAll(page);
      console.log("API Response:", response);
      console.log("Response data:", response.data);
      console.log("Response data.data:", response.data?.data);
      
      const { posts: fetchedPosts, pagination } = response.data.data || {};
      console.log("Fetched posts:", fetchedPosts);
      console.log("Pagination:", pagination);
      
      if (fetchedPosts && Array.isArray(fetchedPosts)) {
        setPosts(fetchedPosts);
        setHasMore(pagination ? page < pagination.totalPages : false);
        console.log("Posts set successfully:", fetchedPosts.length, "posts");
      } else {
        console.error("Invalid posts data:", fetchedPosts);
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!postForm.content.trim()) {
      setError("Please enter some content for your post");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Send as regular JSON object
      const postData = {
        content: postForm.content.trim(),
        title: postForm.title.trim() || undefined,
        tags: postForm.tags.trim() || undefined
      };

      // Remove undefined values
      Object.keys(postData).forEach(key => {
        if (postData[key] === undefined) {
          delete postData[key];
        }
      });

      console.log("Creating post with data:", postData);

      const response = await api.post("/posts/create", postData);
      console.log("Post creation response:", response);

      if (response.data.success) {
        console.log("Post created successfully, refreshing posts...");
        
        // Reset form
        setPostForm({ title: "", content: "", tags: "" });
        setPostMedia(null);
        
        // Refresh posts
        await fetchPosts();
        
        // Close modal
        setShowCreateModal(false);
      } else {
        setError(response.data.message || "Failed to create post");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      console.error("Error details:", err.response);
      const errorMessage = err.response?.data?.message || err.message || "Failed to create post";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Trending posts (mock data for now)
  const trendingPosts = [
    { id: 1, title: '#Exams2024', count: 234 },
    { id: 2, title: '#CampusLife', count: 189 },
    { id: 3, title: '#StudyGroup', count: 156 },
    { id: 4, title: '#FreeTime', count: 143 },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-60 mr-80">
        <div className="max-w-3xl mx-auto py-8 px-4">
          {/* Welcome Header */}
          {user && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.fullname ? user.fullname.split(' ')[0] : 'User'} !
              </h1>
              <p className="text-gray-600">Here's what's happening on campus today</p>
            </div>
          )}

          {/* Create Post Button */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullname}`}
                alt={user?.fullname}
                className="w-12 h-12 rounded-full border-2 border-blue-200"
              />
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-500 hover:bg-gray-100"
              >
                What's on your mind?
              </button>
            </div>
          </div>

          {/* Create Post Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Create Post</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleCreatePost} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title (optional)"
                    value={postForm.title}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="What's on your mind?"
                    value={postForm.content}
                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Tags (comma separated, e.g., campus, study, fun)"
                    value={postForm.tags}
                    onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPostMedia(e.target.files[0])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={postLoading}
                      className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {postLoading ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Posts Feed */}
          {!loading && posts.length > 0 && (
            <div>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && posts.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No posts yet</h3>
              <p className="mt-2 text-gray-600">Be the first to share something with campus!</p>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] bg-white border-l border-gray-200 overflow-y-auto p-6">
        {/* Trending Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Trending Topics</h2>
          <div className="space-y-3">
            {trendingPosts.map((topic) => (
              <div
                key={topic.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <span className="font-medium text-gray-900">{topic.title}</span>
                <span className="text-sm text-gray-500">{topic.count} posts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="space-y-2">
            <a href="/events" className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group">
              <div className="bg-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">View Events</div>
                <div className="text-xs text-gray-500">Upcoming campus events</div>
              </div>
            </a>

            <a href="/resources" className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group">
              <div className="bg-green-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">Study Resources</div>
                <div className="text-xs text-gray-500">Notes and materials</div>
              </div>
            </a>

            <a href="/groups" className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group">
              <div className="bg-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">Join Groups</div>
                <div className="text-xs text-gray-500">Connect with peers</div>
              </div>
            </a>
          </div>
        </div>

        {/* Campus Stats */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Campus Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="font-bold text-blue-600">1,234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Posts Today</span>
              <span className="font-bold text-amber-600">45</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Upcoming Events</span>
              <span className="font-bold text-green-600">8</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Home;




