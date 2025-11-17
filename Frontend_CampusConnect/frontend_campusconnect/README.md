# CampusConnect Frontend

Beautiful, modern frontend for the CampusConnect social networking platform built with React.js and Tailwind CSS.

## 🎨 Features

### Design
- **Glassmorphism UI** - Modern, elegant login/register pages
- **Responsive Design** - Works seamlessly on all devices
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Animations** - Smooth transitions and effects

### Pages
1. **Login/Register** - Animated glassmorphism cards with form validation
2. **Home/Feed** - Main dashboard with posts, sidebar, and trending topics
3. **Events** - Browse and filter campus events
4. **Groups** - Join communities and study groups
5. **Resources** - Access study materials and course resources
6. **Profile** - View and edit user profiles with tabs

### Components
- **PostCard** - Display posts with likes, comments, and shares
- **EventCard** - Show events with attendance and details
- **GroupCard** - Group information and join functionality
- **ResourceCard** - Resource details and download options
- **Navbar** - Global navigation with search and user menu
- **Sidebar** - Left navigation with quick stats
- **Footer** - Site information and links

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd Frontend_CampusConnect/frontend_campusconnect

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Common/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   └── Cards/
│       ├── PostCard.jsx
│       ├── EventCard.jsx
│       ├── GroupCard.jsx
│       └── ResourceCard.jsx
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── Home.jsx
│   ├── Events.jsx
│   ├── Groups.jsx
│   ├── Resources.jsx
│   └── Profile.jsx
├── context/
│   └── AuthContext.jsx
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
├── index.css
└── App.css
```

## 🎯 Key Technologies

- **React 19** - Latest React with hooks
- **React Router DOM** - Client-side routing
- **Tailwind CSS 4** - Utility-first styling
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server

## 🔐 Authentication

- JWT-based authentication
- Protected routes with authentication checks
- Automatic token refresh
- User context management

## 📱 Responsive Design

All pages are fully responsive and optimized for:
- Desktop (1280px+)
- Tablet (768px - 1279px)
- Mobile (< 768px)

## 🎨 Color Scheme

- **Primary**: Blue (#2563eb)
- **Secondary**: Amber (#f59e0b)
- **Background**: Gray-100 (#f3f4f6)
- **Cards**: White (#ffffff)
- **Text**: Gray-900 (#111827)

## 📝 API Integration

All API calls are handled through the centralized service in `src/services/api.js`:
- Auth APIs (login, register, profile)
- Post APIs (create, read, update, delete, like)
- Comment APIs (create, read, update, delete)
- Event APIs (create, read, attend)
- Resource APIs (upload, download, search)
- Poll APIs (create, vote)

## 🔄 State Management

- **React Context** - Global authentication state
- **Local State** - Component-specific state with useState
- **API State** - Server data management

## 🛡️ Error Handling

- Global error boundaries
- API error interceptors
- User-friendly error messages
- Loading states

## 🚀 Deployment

The frontend can be deployed to:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Any static hosting service

```bash
# Build for production
npm run build

# Deploy the 'dist' folder
```

## 📄 License

ISC License
