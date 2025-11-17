import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
const CourseGroup = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-courses');

  // Mock course data
  const myCourses = [
    {
      id: 1,
      title: 'Data Structures & Algorithms',
      instructor: 'Naveen Rajpal',
      progress: 75,
      nextClass: 'Tomorrow, 10:00 AM',
      assignments: 2
    },
    {
      id: 2,
      title: 'Web Development',
      instructor: 'Sanjay Malik',
      progress: 60,
      nextClass: 'Friday, 2:00 PM',
      assignments: 1
    },
    {
      id: 3,
      title: 'Software Engineering ',
      instructor: 'Ruchi Sehrawat',
      progress: 45,
      nextClass: 'Next Week',
      assignments: 3
    }
  ];

  const availableCourses = [
    {
      id: 4,
      title: 'Machine Learning',
      instructor: 'RL Ujwal',
      department: 'Computer Science',
      credits: 4,
      enrolled: 85
    },
    {
      id: 5,
      title: 'Computer Networks',
      instructor: 'Sartaj Singh Sodhi',
      department: 'Computer Science',
      credits: 3,
      enrolled: 92
    },
    {
      id: 6,
      title: 'Design and Analysis of Algorithms',
      instructor: 'Anuradha Chug',
      department: 'Computer Science',
      credits: 4,
      enrolled: 78
    }
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-60 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <nav className="p-4 space-y-2">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Course Management</h2>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('my-courses')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'my-courses'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                My Courses
              </button>
              <button
                onClick={() => setActiveTab('browse-courses')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'browse-courses'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Browse Courses
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'schedule'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Class Schedule
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-60 mr-80">
        <div className="max-w-6xl mx-auto py-8 px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses</h1>
            <p className="text-gray-600">Manage your academic journey</p>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'my-courses' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myCourses.map((course) => (
                  <div key={course.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <p>📅 Next: {course.nextClass}</p>
                        <p>📝 {course.assignments} pending assignments</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        Continue Learning
                      </button>
                      <button className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                        ⋯
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'browse-courses' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Courses</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availableCourses.map((course) => (
                  <div key={course.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">{course.instructor}</p>
                      <p className="text-sm text-gray-500 mb-3">{course.department}</p>
                      
                      <div className="flex justify-between text-sm text-gray-600 mb-4">
                        <span>Credits: {course.credits}</span>
                        <span>{course.enrolled} enrolled</span>
                      </div>
                    </div>

                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                      Enroll Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Class Schedule</h2>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center py-12">
                  <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Schedule Coming Soon</h3>
                  <p className="text-gray-600">Your class schedule will be available here.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] bg-white border-l border-gray-200 overflow-y-auto p-6">
        {/* Course Stats */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Course Overview</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Enrolled Courses</span>
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Completed</span>
                <span className="text-2xl font-bold text-green-600">12</span>
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">In Progress</span>
                <span className="text-2xl font-bold text-amber-600">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Add Course
            </button>
            <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
              View Grades
            </button>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
              Academic Calendar
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CourseGroup;