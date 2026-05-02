# 🏋️ GymBuddy - Full-Stack Fitness & E-commerce Platform

A production-ready MERN stack application combining **fitness tracking** with **gym supplements e-commerce**, featuring role-based dashboards for Admin, Seller, and User roles.

Perfect for:
- 💼 Resume showcase
- 👨‍💻 Interview discussions

---

## 🚀 Features

### 👤 User Dashboard
- **Fitness Tracking**: Log workouts with sets, reps, weight, duration
- **Analytics**: Visual charts showing workout frequency, calories burned, strength progress
- **Streak Tracking**: Motivational fitness streak counter
- **E-commerce**: Browse supplements, add to cart, place orders
- **Order Tracking**: View order history and status

### 🏪 Seller Dashboard
- **Product Management**: Add, edit, delete products with inventory control
- **Order Management**: View received orders, update order status
- **Sales Analytics**: Revenue tracking, product performance charts
- **Inventory Alerts**: Low stock notifications

### 👑 Admin Dashboard
- **Platform Analytics**: Revenue trends, order distribution, user statistics
- **User Management**: Activate/block users, view all platform users
- **Seller Approvals**: Approve or reject seller applications
- **Product Moderation**: Remove any product from the platform

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - RESTful API
- **MongoDB** + **Mongoose** - NoSQL database
- **JWT** - Authentication & authorization
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** (with Vite) - Component-based UI
- **Tailwind CSS** - Modern dark theme styling
- **React Router DOM** - Client-side routing
- **Recharts** - Analytics visualization
- **Axios** - HTTP client with interceptors

---

## 📁 Project Structure

```
GymBuddy/
├── backend/
│   ├── models/          # MongoDB schemas (User, Workout, Product, Order)
│   ├── routes/          # API routes (auth, workouts, products, orders, admin)
│   ├── middleware/      # JWT auth & role-based authorization
│   ├── server.js        # Express server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/  # Shared components (Navbar, ProtectedRoute, etc.)
    │   ├── context/     # Auth context for state management
    │   ├── pages/       # Dashboard pages organized by role
    │   ├── services/    # API client configuration
    │   ├── App.jsx      # Main app with routing
    │   └── index.css    # Tailwind + custom styles
    └── package.json
```

---

## ⚙️ Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
cd GymBuddy
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env and configure:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/gymbuddy
# JWT_SECRET=your_super_secret_jwt_key

# Start MongoDB (if running locally)
# mongod --dbpath <path_to_data_directory>

# Start backend server
npm start
# OR for development with auto-reload
npm run dev
```

Backend will run on **http://localhost:5000**

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

Frontend will run on **http://localhost:5173**

---

## 🧪 Testing the Application

### 1. Register Users

**Option 1: Manual Registration**
- Open http://localhost:5173/register
- Register as USER, SELLER, or manually create ADMIN

**Option 2: Create Demo Accounts via MongoDB**

For Admin, you'll need to manually create in MongoDB:

```javascript
// Connect to MongoDB and run:
db.users.insertOne({
  name: "Admin User",
  email: "admin@demo.com",
  password: "$2b$10$hashedPasswordHere", // Use bcrypt to hash "password123"
  role: "ADMIN",
  isActive: true,
  isApproved: true,
  createdAt: new Date()
})
```

### 2. Test Authentication
- Login with different roles
- Verify JWT tokens are stored in localStorage
- Test role-based dashboard access

### 3. Test User Features
- Log workouts and view analytics charts
- Browse products and add to cart
- Place orders and track status

### 4. Test Seller Features
- Wait for admin approval (or manually approve in DB)
- Add products with images
- View received orders
- Update order status
- Check sales analytics

### 5. Test Admin Features
- View platform analytics
- Approve/reject seller applications
- Activate/deactivate users
- Moderate products

---

## 🔑 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user

### Workouts (`/api/workouts`) - USER only
- `POST /` - Log workout
- `GET /` - Get user workouts
- `GET /analytics` - Get analytics
- `DELETE /:id` - Delete workout

### Products (`/api/products`)
- `GET /` - List products (public)
- `POST /` - Add product (SELLER)
- `PUT /:id` - Update product (SELLER)
- `DELETE /:id` - Delete product (SELLER)
- `GET /seller/my-products` - Get seller's products

### Orders (`/api/orders`)
- `POST /` - Place order (USER)
- `GET /user` - Get user orders (USER)
- `GET /seller` - Get seller orders (SELLER)
- `PUT /:id/status` - Update status (SELLER)

### Admin (`/api/admin`) - ADMIN only
- `GET /users` - Get all users
- `PUT /users/:id/activate` - Activate/block user
- `GET /sellers/pending` - Get pending sellers
- `PUT /sellers/:id/approve` - Approve seller
- `GET /analytics` - Platform analytics
- `DELETE /products/:id` - Remove product

---

## 🎨 UI/UX Features

✅ **Dark Mode Aesthetic** - Modern Gen-Z design  
✅ **Glassmorphism Effects** - Premium look and feel  
✅ **Smooth Animations** - Fade-in, slide-up transitions  
✅ **Responsive Design** - Mobile and desktop optimized  
✅ **Interactive Charts** - Recharts for analytics  
✅ **Clean Typography** - Inter font from Google Fonts  

---

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization middleware
- Protected routes on frontend
- CORS configuration
- Input validation
- Seller approval workflow

---

## 📝 Environment Variables

### Backend (`.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/gymbuddy
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### Frontend
No environment variables needed (API proxy configured in Vite)

---

## 🚢 Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

---

## 📚 Future Enhancements

- [ ] Email notifications for order updates
- [ ] Payment gateway integration
- [ ] Product image upload to cloud storage
- [ ] Social sharing for fitness achievements
- [ ] Advanced analytics with ML predictions
- [ ] Mobile app (React Native)

---

## 👨‍💻 Author

Built with ❤️ using the MERN stack

---

## 📄 License

This project is open source and available for educational purposes.

---

## 🙏 Acknowledgments

- Recharts for amazing chart library
- Tailwind CSS for utility-first styling
- MongoDB for flexible NoSQL database
- React ecosystem for powerful frontend tools

---

**Happy Coding! 💪🚀**
