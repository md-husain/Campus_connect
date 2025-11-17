import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GroupCard from '../components/Cards/GroupCard';
import Sidebar from '../components/Common/Sidebar';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockGroups = [
      {
        _id: '1',
        name: 'Computer Science Study Group',
        description: 'A group for CS students to collaborate on projects and share study materials.',
        members: [{}, {}, {}] // 3 members
      },
      {
        _id: '2',
        name: 'Entrepreneurship Club',
        description: 'Connect with fellow entrepreneurs and build your network on campus.',
        members: [{}, {}, {}, {}, {}, {}, {}] // 7 members
      },
      {
        _id: '3',
        name: 'Data Science Society',
        description: 'Exploring the world of data science, machine learning, and AI together.',
        members: [{}, {}, {}, {}, {}] // 5 members
      },
    ];
    
    setTimeout(() => {
      setGroups(mockGroups);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-60">
        <div className="max-w-5xl mx-auto py-8 px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Groups & Communities</h1>
              <p className="text-gray-600">Join communities that interest you</p>
            </div>
            <Link
              to="/groups/create"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              + Create Group
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search groups..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Groups Grid */}
          {!loading && groups.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.map((group) => (
                <GroupCard key={group._id} group={group} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && groups.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No groups found</h3>
              <p className="mt-2 text-gray-600">Create the first group to get started!</p>
              <Link
                to="/groups/create"
                className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Group
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Groups;





