# Chat Application

A real-time chat application built with Node.js backend and React frontend using Socket.io for real-time communication.

## Project Structure

```
chat-application/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── config/
│   │     └── db.js
│   ├── models/
│   │     ├── User.js
│   │     ├── Chat.js
│   │     └── Message.js
│   └── routes/
│         └── userRoutes.js
│
└── frontend/
    ├── package.json
    └── src/
        ├── index.js
        ├── App.js
        ├── socket.js
        └── components/
              ├── Chat.js
              ├── Message.js
              └── Login.js
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for database)

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd chat-application
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create environment variables:
```bash
cp .env.example .env
```

Update `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
```

Start the backend server:
```bash
npm start
# or for development
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

Navigate to the frontend directory (in a new terminal):
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `NODE_ENV`: Environment (development/production)

## Features

- Real-time messaging using Socket.io
- User authentication
- Chat rooms
- Message history
- Responsive design

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile

### Chat
- `GET /api/chats` - Get user chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/:id/messages` - Get chat messages

## Socket.io Events

### Client to Server
- `join_room` - Join a chat room
- `send_message` - Send a message
- `disconnect` - User disconnects

### Server to Client
- `receive_message` - Receive a message
- `user_joined` - User joined room
- `user_left` - User left room

## Development

### Running in Development Mode

1. Start MongoDB server
2. Start backend server (`npm run dev` in backend directory)
3. Start frontend server (`npm start` in frontend directory)

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

Backend:
```bash
cd backend
npm start
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill process using the port

3. **CORS Issues**
   - Ensure frontend URL is allowed in backend CORS configuration

4. **Socket Connection Issues**
   - Check if backend server is running
   - Verify socket.io client configuration

## Technologies Used

### Backend
- Node.js
- Express.js
- Socket.io
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs

### Frontend
- React
- Socket.io-client
- Axios
- CSS/Styled Components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit and push
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
