# Student-Teacher Connect API

A web application where teachers can post assignments and students can view them.

## Features

- **Role-based Authentication**: Users can register as either Teacher or Student
- **Teacher Features**: 
  - Create assignments with title, description, deadline, and subject
  - View their own assignments
  - Update and delete their assignments
- **Student Features**:
  - View all active assignments
  - View individual assignment details

## Tech Stack

- **Backend**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Documentation**: Swagger UI

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-teacher-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `env.example` to `.env`
   - Update the following variables:
     ```
     PORT=3000
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student-teacher-connect
     JWT_SECRET=your-super-secret-jwt-key-here
     NODE_ENV=development
     ```

4. **MongoDB Atlas Setup**
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string and update `MONGODB_URI` in `.env`

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access Swagger Documentation**
   - Open your browser and go to: `http://localhost:3000/api-docs`
   - Test all API endpoints directly from the Swagger UI

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Assignments
- `POST /api/assignments` - Create assignment (Teacher only)
- `GET /api/assignments` - Get assignments
- `GET /api/assignments/:id` - Get single assignment
- `PUT /api/assignments/:id` - Update assignment (Teacher only)
- `DELETE /api/assignments/:id` - Delete assignment (Teacher only)

## API Usage Examples

### Register as Teacher
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "teacher"
  }'
```

### Register as Student
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Assignment (Teacher)
```bash
curl -X POST http://localhost:3000/api/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Math Homework",
    "description": "Complete exercises 1-10",
    "subject": "Mathematics",
    "deadline": "2024-12-31T23:59:59.000Z"
  }'
```

### Get Assignments
```bash
curl -X GET http://localhost:3000/api/assignments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
student-teacher-connect/
├── models/
│   ├── User.js          # User model with role-based authentication
│   └── Assignment.js    # Assignment model
├── routes/
│   ├── auth.js          # Authentication routes
│   └── assignments.js   # Assignment routes
├── middleware/
│   └── auth.js          # Authentication middleware
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Security Features

- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS enabled for cross-origin requests
- Simple password comparison (no hashing for simplicity)

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- General server errors
