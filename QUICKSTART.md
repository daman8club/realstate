# 🚀 TechProp - Quick Start Guide

## Project Overview

A professional, full-stack real estate platform built with **Next.js**, **Node.js/Express**, and **MySQL**. 

## What's Included

✅ **Frontend**: Next.js with Tailwind CSS, modern UI components
✅ **Backend**: Express.js REST API with JWT authentication
✅ **Database**: MySQL with complete schema and indexes
✅ **Admin Panel**: Full property and inquiry management
✅ **Features**: Search, EMI calculator, 3D tours, AI chat, neighborhood insights

## Installation & Setup

### Step 1: Database Setup

1. **Open phpMyAdmin** (http://localhost/phpmyadmin)
2. **Create database**:
   - Click "New" → Database name: `realstate_db`
3. **Import schema**:
   - Select `realstate_db`
   - Click "Import" tab
   - Choose `database/schema.sql`
   - Click "Go"

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# The .env file is already created with default values
# Update if needed:
# - DB_HOST, DB_USER, DB_PASSWORD
# - JWT_SECRET (change to random string)
# - FRONTEND_URL

# Start development server
npm run dev
# Server runs on http://localhost:5000
```

### Step 3: Frontend Setup

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# The .env.local file is already created
# Start development server
npm run dev
# App runs on http://localhost:3000
```

## Project Structure

```
realstate/
├── frontend/
│   ├── app/                    # Pages
│   │   ├── page.jsx           # Home
│   │   ├── properties/         # Property pages
│   │   ├── login/              # Authentication
│   │   ├── dashboard/          # User dashboard
│   │   └── admin/              # Admin panel
│   ├── components/             # Reusable components
│   ├── lib/                    # Utilities, API, store
│   ├── styles/                 # CSS
│   └── package.json
├── backend/
│   ├── routes/                 # API routes
│   ├── config/                 # Database
│   ├── server.js               # Entry point
│   └── package.json
└── database/
    └── schema.sql              # Database schema
```

## Key Features Implemented

### For Users
- ✅ Search & filter properties
- ✅ View property details
- ✅ 3D virtual tour integration
- ✅ EMI calculator
- ✅ Schedule property visits
- ✅ Submit inquiries
- ✅ Neighborhood insights
- ✅ WhatsApp agent contact
- ✅ User authentication
- ✅ Dashboard with visits & inquiries

### For Admins
- ✅ Add/edit/delete properties
- ✅ Manage inquiries & responses
- ✅ View analytics & statistics
- ✅ Manage agent profiles
- ✅ Property price tracking

### Frontend Components
- ✅ Navbar with authentication
- ✅ Footer
- ✅ SearchBar with filters
- ✅ PropertyCard
- ✅ EMI Calculator widget
- ✅ AI Chat widget
- ✅ Responsive design

## API Endpoints

### Example Requests

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'

# Get properties
curl http://localhost:5000/api/properties?city=Bangalore&bhk=3

# Get property details
curl http://localhost:5000/api/properties/1

# Create inquiry
curl -X POST http://localhost:5000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{"property_id":1,"name":"John","email":"john@example.com","phone":"9876543210","message":"Interested","inquiry_type":"call_back"}'
```

## Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=realstate_db
JWT_SECRET=change_to_random_secret_key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Testing the Application

### 1. Create Sample Data (Optional)

You can manually add properties via the admin panel or use SQL:
```sql
INSERT INTO properties (title, description, property_type, bhk, price, location, city, status) 
VALUES ('Beautiful 3BHK Villa', 'Spacious villa with garden', 'villa', 3, 50000000, 'Koramangala', 'Bangalore', 'available');
```

### 2. Test User Flow

1. Open http://localhost:3000
2. **Register** → Fill form → Submit
3. **Login** → Use credentials
4. **Search Properties** → Use filters
5. **View Details** → Click on property
6. **Schedule Visit** → Fill form
7. **Submit Inquiry** → Get call back

### 3. Test Admin Panel

1. http://localhost:3000/admin
2. View statistics
3. Add property → Fill form
4. Manage inquiries → Update status
5. View analytics

## Troubleshooting

### Database connection fails
- Check MySQL is running
- Verify credentials in `.env`
- Ensure `realstate_db` exists

### Frontend shows API errors
- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for errors

### Port already in use
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Next Steps

1. **Add Real Data** → Use admin panel to add properties
2. **Configure APIs** → Add real Google Maps, Cloudinary keys
3. **Customize Design** → Modify colors, fonts in Tailwind config
4. **Deploy** → Use Vercel (frontend), Heroku/Railway (backend)
5. **Add Features** → Payments, promotions, analytics

## Files Location

- **Database Schema**: `database/schema.sql`
- **Backend Config**: `backend/.env`
- **Frontend Config**: `frontend/.env.local`
- **API Routes**: `backend/routes/*.js`
- **Pages**: `frontend/app/*/page.jsx`
- **Components**: `frontend/components/*.jsx`

## Support

For issues or questions:
- Check README.md for detailed documentation
- Review API endpoints in backend routes
- Check browser console for errors
- Verify database tables exist

---

**Happy Building! 🏠🚀**
