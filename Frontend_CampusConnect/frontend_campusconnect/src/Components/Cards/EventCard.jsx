import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventAPI } from '../../services/api';

const EventCard = ({ event, onUpdate }) => {
  const { user } = useAuth();
  const [isAttending, setIsAttending] = useState(
    event.attendees?.some(attendee => attendee._id === user?._id) || false
  );
  const [attendeesCount, setAttendeesCount] = useState(event.attendees?.length || 0);
  const [isLoading, setIsLoading] = useState(false);

  const handleAttendance = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await eventAPI.attend(event._id);
      setIsAttending(!isAttending);
      setAttendeesCount(isAttending ? attendeesCount - 1 : attendeesCount + 1);
    } catch (error) {
      console.error('Error attending event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isPastEvent = new Date(event.date) < new Date();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 mb-6 hover:shadow-lg transition-shadow border border-blue-100">
      {/* Event Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-600 text-white p-3 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
            <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
          </div>
        </div>
        
        {isPastEvent && (
          <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
            Past Event
          </span>
        )}
      </div>

      {/* Event Description */}
      {event.description && (
        <p className="text-gray-700 mb-4 line-clamp-2">{event.description}</p>
      )}

      {/* Event Location */}
      {event.location && (
        <div className="flex items-center space-x-2 text-gray-600 mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{event.location}</span>
        </div>
      )}

      {/* Event Creator */}
      <div className="flex items-center space-x-2 mb-4">
        <img
          src={event.owner?.avatar || `https://ui-avatars.com/api/?name=${event.owner?.fullname}`}
          alt={event.owner?.fullname}
          className="w-8 h-8 rounded-full border border-blue-200"
        />
        <span className="text-sm text-gray-600">
          Organized by <span className="font-semibold">{event.owner?.fullname}</span>
        </span>
      </div>

      {/* Event Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-blue-200">
        <div className="flex items-center space-x-2 text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="font-medium">{attendeesCount} attending</span>
        </div>

        {!isPastEvent && (
          <button
            onClick={handleAttendance}
            disabled={isLoading}
            className={`
              px-6 py-2 rounded-lg font-semibold transition-colors
              ${isAttending
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {isAttending ? '✓ Attending' : 'Join Event'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;





