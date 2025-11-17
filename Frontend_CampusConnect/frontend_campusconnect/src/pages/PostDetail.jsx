import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postAPI, commentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Common/Sidebar';
import PostCard from '../components/Cards/PostCard';

const PostDetail = () => {
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await postAPI.getById(postId);
      setPost(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getByPost(postId);
      setComments(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      setCommentLoading(true);
      await commentAPI.create(postId, newComment);
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-60">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-60">
        <div className="max-w-3xl mx-auto py-8 px-4">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>

          <PostCard post={post} />

          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Comments ({comments.length})
            </h2>

            {/* Comment Form */}
            {user && (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex items-start space-x-3">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullname}`}
                    alt={user.fullname}
                    className="w-10 h-10 rounded-full border-2 border-blue-200"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={commentLoading || !newComment.trim()}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {commentLoading ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => {
                  const owner = comment.owner || comment.user || {};
                  const text = comment.text || comment.content || '';
                  
                  return (
                    <div key={comment._id} className="flex items-start space-x-3 pb-4 border-b border-gray-200 last:border-0">
                      <Link to={`/profile/${owner._id}`}>
                        <img
                          src={owner.avatar || `https://ui-avatars.com/api/?name=${owner.fullname || 'User'}`}
                          alt={owner.fullname || 'User'}
                          className="w-10 h-10 rounded-full border-2 border-blue-200"
                        />
                      </Link>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Link
                            to={`/profile/${owner._id}`}
                            className="font-semibold text-gray-900 hover:underline"
                          >
                            {owner.fullname || 'Unknown User'}
                          </Link>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.createdAt || comment.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{text}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetail;
