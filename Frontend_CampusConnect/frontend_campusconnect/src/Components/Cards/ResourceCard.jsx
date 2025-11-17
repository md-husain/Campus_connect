import { Link } from 'react-router-dom';

const ResourceCard = ({ resource }) => {
  const handleDownload = () => {
    if (resource.fileUrl) {
      window.open(resource.fileUrl, '_blank');
    }
  };

  const getFileIcon = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    if (['pdf'].includes(extension)) {
      return (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.444 3.685a1 1 0 00-.14-.146l-.004-.004-.001-.001a.999.999 0 00-.206-.13c-.023-.01-.048-.016-.071-.026a1 1 0 00-.203-.056l-.02-.004a1 1 0 00-.211-.018H17a1 1 0 100 2h1.586l-6.293 6.293a1 1 0 001.414 1.414L20 7.414V9a1 1 0 102 0V4.768a1 1 0 00-.028-.207l-.005-.02a1 1 0 00-.043-.105.999.999 0 00-.092-.149l-.007-.009-.005-.005a1 1 0 00-.176-.083l-.003-.002-.005-.002zM4 4h6v3a1 1 0 001 1h4v8H4V4z"/>
        </svg>
      );
    }
    return (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex items-start space-x-4">
        {/* File Icon */}
        <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
          {getFileIcon(resource.fileUrl || 'default.pdf')}
        </div>

        {/* Resource Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
          
          {resource.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {resource.description}
            </p>
          )}

          {/* Course Info */}
          {resource.course && (
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-sm text-gray-600">{resource.course.name}</span>
            </div>
          )}

          {/* Uploader Info */}
          {resource.uploadedBy && (
            <div className="flex items-center space-x-2 mb-3">
              <img
                src={resource.uploadedBy.avatar || `https://ui-avatars.com/api/?name=${resource.uploadedBy.fullname}`}
                alt={resource.uploadedBy.fullname}
                className="w-6 h-6 rounded-full border border-gray-300"
              />
              <span className="text-sm text-gray-600">
                {resource.uploadedBy.fullname}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Resource Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
        <span className="text-xs text-gray-500">
          {new Date(resource.createdAt).toLocaleDateString()}
        </span>
        
        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="font-medium">Download</span>
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;





