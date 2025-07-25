# 🎓 Class Measures Management System

A comprehensive class management hub for tracking students, sessions, programs, and analytics.

## 🚀 Live Demo
- **Frontend**: [https://class-measures-mgmt-system-1jq6.vercel.app](https://class-measures-mgmt-system-1jq6.vercel.app)
- **Backend API**: [https://class-measures-mgmt-system-1.onrender.com/api](https://class-measures-mgmt-system-1.onrender.com/api)

## 🔧 Current Access (Development Mode)
**Auto-login as Admin** - Visit the site and you'll be automatically logged in with admin privileges.
- No login required
- Full access to all features
- Look for the orange "DEV MODE" indicator in top-right

## ✨ Features
- 📊 **Dashboard** - Overview of students, sessions, and key metrics
- 👥 **Student Management** - Add, edit, and track student information
- 📅 **Session Management** - Schedule and manage class sessions
- 📚 **Program Management** - Organize courses and programs
- 📈 **Business Analytics** - Track performance and insights
- 📋 **Attendance Tracking** - Monitor student attendance
- 🔄 **Real-time Updates** - Live data synchronization

## 🛠 Tech Stack

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **Socket.io Client** for real-time features

### Backend
- **Node.js** with Express
- **MySQL** database
- **Socket.io** for real-time communication
- **CORS** enabled for cross-origin requests

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MySQL (hosted)

## 🏗 Project Structure
```
class-measures-hub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Auth & Socket contexts
│   │   ├── api/           # API integration
│   │   └── pages/         # Page components
│   ├── vercel.json        # Vercel deployment config
│   └── package.json
├── server/                # Express backend
└── README.md
```

## 🚀 Quick Start

### Local Development
```bash
# Clone the repository
git clone https://github.com/Majmajiro/class-measures-mgmt-system.git
cd class-measures-mgmt-system

# Frontend setup
cd client
npm install
npm run dev

# Backend setup (in new terminal)
cd server
npm install
npm start
```

### Environment Variables
**Frontend (.env)**
```
VITE_API_URL=https://class-measures-mgmt-system-1.onrender.com/api
```

**Backend (.env)**
```
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=your-database-name
PORT=5000
```

## 🐛 Known Issues
- ⚠️ **Authentication temporarily bypassed** - Auto-login implemented for development
- 🔄 **Backend may sleep** - Render free tier has cold starts (first request may be slow)
- 🗄️ **Database connection** - Requires hosted MySQL database (localhost not supported in production)

## 📝 To-Do
- [ ] Fix production authentication system
- [ ] Implement proper user registration flow
- [ ] Add user role management
- [ ] Complete attendance tracking features
- [ ] Add data export functionality

## 🛡 Security Note
**Current deployment uses temporary admin access for development purposes. Remove auto-login before production use.**

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License
This project is licensed under the MIT License.

---

**Need Help?** Check the browser console for debug information or contact the development team.

*Last updated: January 2025*