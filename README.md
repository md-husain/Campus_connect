# Campus Connect

A comprehensive campus social networking platform built with React.js, Node.js, Express.js, and MongoDB.

## 🎯 Project Overview

CampusConnect is a full-stack social platform designed for educational campuses, facilitating communication, collaboration, and resource sharing among students, faculty, and administrators.

---

## 🏗️ System Architecture

### 1. Frontend Layer (User Interface)
- **Framework**: React.js with Vite
- **Styling**: Tailwind CSS
- **Features**:
  - Role-based dashboards (Student, Faculty, Admin)
  - Posts, comments, and polls
  - Event calendar and announcements
  - Resource sharing module
  - AI recommendations (suggested groups/resources)

### 2. Middleware Layer (Backend Core)
- **Framework**: Node.js + Express.js
- **Responsibilities**:
  - User authentication (JWT-based login, registration, roles)
  - API routing for posts, events, comments, messages, etc.
  - File uploads (Multer + Cloudinary)
  - Business logic (managing user roles, handling resource sharing)
  - Secure connection between frontend and database

### 3. Backend Layer (Database & Services)
- **Database**: MongoDB
- **Storage**:
  - User profiles and authentication
  - Posts, comments, likes
  - Resources (notes, study materials)
  - Events, polls, messages

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for file uploads)

### Installation

#### Backend Setup
```bash
cd Backend_CampusConnect
npm install

# Create .env file with:
# MONGO_URI=your_mongodb_connection_string
# PORT=5000
# ACCESS_TOKEN_SECRET=your_secret
# REFRESH_TOKEN_SECRET=your_refresh_secret
# ACCESS_TOKEN_EXPIRY=1d
# REFRESH_TOKEN_EXPIRY=7d
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
# CORS_ORIGIN=http://localhost:5173

npm run dev
```

#### Frontend Setup
```bash
cd Frontend_CampusConnect/frontend_campusconnect
npm install
npm run dev
```

---

## 📁 Project Structure

```
Campus Connect/
├── Backend_CampusConnect/
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── constants/        # App constants
│   │   ├── controllers/      # Route handlers
│   │   │   ├── user.controller.js
│   │   │   ├── post.controller.js
│   │   │   ├── comment.controller.js
│   │   │   ├── event.controller.js
│   │   │   ├── resource.controller.js
│   │   │   └── poll.controller.js
│   │   ├── Database/         # MongoDB connection
│   │   ├── middlewares/      # Auth, upload, rate limit
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API routes
│   │   └── utils/            # Helper functions
│   ├── app.js                # Express app setup
│   ├── server.js             # Server entry point
│   └── package.json
│
└── Frontend_CampusConnect/
    └── frontend_campusconnect/
        ├── src/
        │   ├── Components/   # React components
        │   ├── pages/        # Page components
        │   ├── context/      # React Context
        │   ├── services/     # API services
        │   └── routes/       # React routes
        └── package.json
```

---

## 🔌 API Endpoints

### User Management
- `POST /api/v1/user/register_user` - Register new user
- `POST /api/v1/user/login_user` - User login
- `GET /api/v1/user/logout_user` - User logout
- `GET /api/v1/user/get_user_profile` - Get profile
- `PUT /api/v1/user/update_user_profile` - Update profile

### Posts
- `POST /api/v1/posts/create` - Create post
- `GET /api/v1/posts/all` - Get all posts
- `GET /api/v1/posts/:postId` - Get single post
- `POST /api/v1/posts/:postId/like` - Like/unlike post

### Comments
- `POST /api/v1/comments/post/:postId` - Add comment
- `GET /api/v1/comments/post/:postId` - Get comments
- `PUT /api/v1/comments/:commentId` - Update comment

### Events
- `POST /api/v1/events/create` - Create event
- `GET /api/v1/events/all` - Get all events
- `GET /api/v1/events/upcoming` - Get upcoming events
- `POST /api/v1/events/:eventId/attend` - Attend event

### Resources
- `POST /api/v1/resources/upload` - Upload resource
- `GET /api/v1/resources/all` - Get all resources
- `GET /api/v1/resources/course/:courseId` - Get by course

### Polls
- `POST /api/v1/polls/create` - Create poll
- `GET /api/v1/polls/all` - Get all polls
- `POST /api/v1/polls/:pollId/vote` - Vote on poll

For complete API documentation, see [API_DOCUMENTATION.md](Backend_CampusConnect/API_DOCUMENTATION.md)

---

## 🔐 Authentication & Authorization

- **JWT-based authentication** with access and refresh tokens
- **Role-based access control** (Student, Faculty, Admin)
- **Secure password hashing** using bcrypt
- **Rate limiting** on auth endpoints

---

## 📦 Key Features

### Student Features
- Create and share posts
- Comment and like posts
- Join course groups
- Upload and download study resources
- RSVP to campus events
- Participate in polls

### Faculty Features
- Post announcements
- Share course materials
- Create and manage course groups
- View student engagement

### Admin Features
- Manage all users
- Monitor platform activity
- Configure system settings
- Content moderation

---

## 🛠️ Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT
- Multer (file uploads)
- Cloudinary (cloud storage)
- bcrypt (password hashing)

### Frontend
- React.js
- Tailwind CSS
- React Context API
- Vite

---

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👥 Authors

- CampusConnect Development Team

---

## 🙏 Acknowledgments

- MongoDB University
- Cloudinary
- React Team
- Express.js Community
