import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pollAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Common/Sidebar';

const PollCard = ({ poll, onVote }) => {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(
    poll.votes?.some(vote => vote.user?._id === user?._id || vote === user?._id) || false
  );
  const [totalVotes, setTotalVotes] = useState(poll.votes?.length || 0);

  const handleVote = async (optionIndex) => {
    if (hasVoted || !user) return;
    
    try {
      await pollAPI.vote(poll._id, optionIndex);
      setSelectedOption(optionIndex);
      setHasVoted(true);
      setTotalVotes(totalVotes + 1);
      if (onVote) onVote();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getPercentage = (optionIndex) => {
    if (totalVotes === 0) return 0;
    const optionVotes = poll.votes?.filter(vote => {
      const voteIndex = typeof vote === 'object' ? vote.optionIndex : null;
      return voteIndex === optionIndex;
    }).length || 0;
    return Math.round((optionVotes / totalVotes) * 100);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{poll.question}</h3>
          {poll.description && (
            <p className="text-gray-600 text-sm">{poll.description}</p>
          )}
        </div>
        {poll.isActive !== false ? (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            Active
          </span>
        ) : (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
            Closed
          </span>
        )}
      </div>

      <div className="space-y-3 mb-4">
        {poll.options && poll.options.map((option, index) => {
          const percentage = hasVoted ? getPercentage(index) : 0;
          const isSelected = selectedOption === index;

          return (
            <div key={index}>
              {!hasVoted ? (
                <button
                  onClick={() => handleVote(index)}
                  className="w-full text-left px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  {option}
                </button>
              ) : (
                <div className="relative">
                  <div
                    className={`px-4 py-3 rounded-lg ${
                      isSelected ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50 border-2 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={isSelected ? 'font-semibold text-blue-700' : 'text-gray-700'}>
                        {option}
                      </span>
                      <span className="text-sm font-medium text-gray-600">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isSelected ? 'bg-blue-600' : 'bg-gray-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-sm text-gray-500">
        <span>{totalVotes} votes</span>
        <span>Created by {poll.createdBy?.fullname || poll.owner?.fullname || 'Unknown'}</span>
      </div>
    </div>
  );
};

const Polls = () => {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPolls();
  }, [filter]);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      let response;
      
      if (filter === 'active') {
        response = await pollAPI.getActive();
        setPolls(response.data.data || []);
      } else {
        response = await pollAPI.getAll();
        setPolls(response.data.data?.polls || response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-60">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Campus Polls</h1>
              <p className="text-gray-600">Share your opinion and see what others think</p>
            </div>
            {(user?.role === 'Faculty' || user?.role === 'Admin') && (
              <Link
                to="/polls/create"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
              >
                + Create Poll
              </Link>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === 'all'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              All Polls
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 font-medium transition-colors ${
                filter === 'active'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Active Polls
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Polls List */}
          {!loading && polls.length > 0 && (
            <div>
              {polls.map((poll) => (
                <PollCard key={poll._id} poll={poll} onVote={fetchPolls} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && polls.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No polls found</h3>
              <p className="mt-2 text-gray-600">
                {filter === 'active'
                  ? 'No active polls at the moment.'
                  : 'Be the first to create a poll!'
                }
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Polls;
