import { useState } from 'react';
import { Link } from 'react-router-dom';

const GroupCard = ({ group }) => {
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = () => {
    setIsJoined(!isJoined);
    // TODO: Implement join group API call
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 hover:shadow-lg transition-shadow border border-gray-100">
      {/* Group Header */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-xl w-16 h-16 flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{group.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {group.members?.length || 0} members
          </p>
        </div>
      </div>

      {/* Group Description */}
      <p className="text-gray-700 mb-4 line-clamp-2">{group.description || 'No description available.'}</p>

      {/* Group Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Link
          to={`/group/${group._id}`}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          View Details →
        </Link>
        
        <button
          onClick={handleJoin}
          className={`
            px-6 py-2 rounded-lg font-semibold transition-colors
            ${isJoined
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          {isJoined ? '✓ Joined' : 'Join Group'}
        </button>
      </div>
    </div>
  );
};

export default GroupCard;





