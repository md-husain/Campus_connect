# CampusConnect Backend API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
Most endpoints require JWT authentication. Include the access token in cookies or Authorization header.

---

## 🚀 User Endpoints

### 1. Register User
```
POST /user/register_user
Body: { email, username, fullname, password, bio, department, role }
Response: User object with tokens
```

### 2. Login
```
POST /user/login_user
Body: { email, password }
Response: User object with tokens
```

### 3. Logout
```
GET /user/logout_user
Headers: Authorization (JWT)
Response: Success message
```

### 4. Get User Profile
```
GET /user/get_user_profile
Headers: Authorization (JWT)
Response: User profile
```

### 5. Update Profile
```
PUT /user/update_user_profile
Headers: Authorization (JWT), multipart/form-data
Body: { fullname?, bio?, department?, avatar?, coverimage? }
Response: Updated user profile
```

### 6. Change Password
```
PUT /user/change_password
Headers: Authorization (JWT)
Body: { oldpassword, newpassword }
Response: Success message
```

### 7. Delete Account
```
DELETE /user/delete_account
Headers: Authorization (JWT)
Response: Success message
```

### 8. Get All Users (Admin Only)
```
GET /user/get_all_users
Headers: Authorization (JWT), Admin role required
Response: List of all users
```

### 9. Search Users (Admin Only)
```
GET /user/search_users?keyword=john&role=Student&department=CS
Headers: Authorization (JWT), Admin role required
Response: Filtered users
```

---

## 📝 Post Endpoints

### 1. Create Post
```
POST /posts/create
Headers: Authorization (JWT), multipart/form-data
Body: { content, tags?, media? }
Response: Created post
```

### 2. Get All Posts
```
GET /posts/all?page=1&limit=10
Response: Paginated posts
```

### 3. Get Post by ID
```
GET /posts/:postId
Response: Single post details
```

### 4. Get User Posts
```
GET /posts/user/:userId
Response: All posts by specific user
```

### 5. Get Posts by Tag
```
GET /posts/tag/:tag
Response: Posts with specific tag
```

### 6. Update Post
```
PUT /posts/:postId
Headers: Authorization (JWT), multipart/form-data
Body: { content?, tags?, media? }
Response: Updated post
```

### 7. Delete Post
```
DELETE /posts/:postId
Headers: Authorization (JWT)
Response: Success message
```

### 8. Like/Unlike Post
```
POST /posts/:postId/like
Headers: Authorization (JWT)
Response: { liked: true/false }
```

---

## 💬 Comment Endpoints

### 1. Create Comment
```
POST /comments/post/:postId
Headers: Authorization (JWT)
Body: { text }
Response: Created comment
```

### 2. Get Post Comments
```
GET /comments/post/:postId
Response: All comments on a post
```

### 3. Update Comment
```
PUT /comments/:commentId
Headers: Authorization (JWT)
Body: { text }
Response: Updated comment
```

### 4. Delete Comment
```
DELETE /comments/:commentId
Headers: Authorization (JWT)
Response: Success message
```

---

## 🎉 Event Endpoints

### 1. Create Event
```
POST /events/create
Headers: Authorization (JWT)
Body: { title, description?, date, location? }
Response: Created event
```

### 2. Get All Events
```
GET /events/all?page=1&limit=10
Response: Paginated events
```

### 3. Get Upcoming Events
```
GET /events/upcoming
Response: Upcoming events list
```

### 4. Get Event by ID
```
GET /events/:eventId
Response: Single event details
```

### 5. Update Event
```
PUT /events/:eventId
Headers: Authorization (JWT)
Body: { title?, description?, date?, location? }
Response: Updated event
```

### 6. Delete Event
```
DELETE /events/:eventId
Headers: Authorization (JWT)
Response: Success message
```

### 7. Attend/Unattend Event
```
POST /events/:eventId/attend
Headers: Authorization (JWT)
Response: { attending: true/false }
```

---

## 📚 Resource Endpoints

### 1. Upload Resource
```
POST /resources/upload
Headers: Authorization (JWT), multipart/form-data
Body: { title, description, course?, file }
Response: Uploaded resource
```

### 2. Get All Resources
```
GET /resources/all?page=1&limit=10&course=courseId&search=query
Response: Paginated resources
```

### 3. Get Resource by ID
```
GET /resources/:resourceId
Response: Single resource details
```

### 4. Get Resources by Course
```
GET /resources/course/:courseId
Response: All resources for a course
```

### 5. Get User Resources
```
GET /resources/user/:userId
Response: All resources uploaded by user
```

### 6. Update Resource
```
PUT /resources/:resourceId
Headers: Authorization (JWT)
Body: { title?, description? }
Response: Updated resource
```

### 7. Delete Resource
```
DELETE /resources/:resourceId
Headers: Authorization (JWT)
Response: Success message
```

---

## 📊 Poll Endpoints

### 1. Create Poll
```
POST /polls/create
Headers: Authorization (JWT)
Body: { question, options: ["Option 1", "Option 2"], expiresAt? }
Response: Created poll
```

### 2. Get All Polls
```
GET /polls/all?page=1&limit=10
Response: Paginated polls
```

### 3. Get Active Polls
```
GET /polls/active
Response: Active (not expired) polls
```

### 4. Get Poll by ID
```
GET /polls/:pollId
Response: Single poll details
```

### 5. Vote on Poll
```
POST /polls/:pollId/vote
Headers: Authorization (JWT)
Body: { optionIndex: 0 }
Response: Updated poll with vote
```

### 6. Update Poll
```
PUT /polls/:pollId
Headers: Authorization (JWT)
Body: { question?, expiresAt? }
Response: Updated poll
```

### 7. Delete Poll
```
DELETE /polls/:pollId
Headers: Authorization (JWT)
Response: Success message
```

---

## 🔐 Authentication Flow

1. **Register/Login**: Get `accessToken` and `refreshToken` in cookies
2. **Make Requests**: Include `accessToken` in Authorization header or use cookies
3. **Token Expiry**: Use `POST /user/refresh_access_token` to refresh
4. **Logout**: Clear tokens and invalidate session

---

## 🛠️ Error Responses

All errors follow this format:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "data": null
}
```

---

## ✅ Success Responses

All success responses follow this format:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... }
}
```

---

## 📋 Notes

- All timestamps are in ISO 8601 format
- Pagination defaults: page=1, limit=10
- File uploads support images and documents
- JWT tokens expire based on environment configuration
- Admin-only endpoints require Admin role
- Resource sharing includes course filtering





