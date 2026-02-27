# 💬 Full-Stack Chat Application (AS2)

A real-time full-stack chat application built using React, Node.js, Express, Socket.IO, and MongoDB.

This project demonstrates real-time communication, message persistence, and scalable WebSocket architecture.

---

## 📌 Project Overview

This application allows users to:

- Engage in real-time one-to-one chats
- Participate in group chats
- Store and retrieve chat history
- Track message delivery and seen status
- Experience seamless frontend-backend integration

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Socket.IO Client
- Axios
- CSS / Tailwind (if used)

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB (Mongoose)
- Redis Adapter (optional for scaling)
- dotenv

---

## 🧠 System Architecture

Client (React)  
⬇ WebSocket (Socket.IO)  
Server (Node.js + Express)  
⬇  
MongoDB (Message Storage)  

Real-time communication is handled using Socket.IO, while persistent message storage is managed using MongoDB.

---

## ✨ Features

### ✅ Real-Time Messaging
- Instant message delivery using WebSockets

### ✅ Private Chats
- One-to-one communication using unique rooms

### ✅ Group Chats
- Multiple users connected to shared chat rooms

### ✅ Message History
- Messages stored in MongoDB
- Chat history loaded on page refresh

### ✅ Message Status Tracking
- Sent
- Delivered
- Seen

### ✅ Scalable Architecture
- Redis Adapter support for horizontal scaling (optional)

---

## 📂 Project Structure

```text
Chat-Application-AS2/
│
├── backend/
│ ├── models/
│ ├── routes/
│ ├── server.js
│ └── .env
│
├── frontend/
│ ├── src/
│ └── main.jsx
│
└── package.json
```

---

## ⚙️ Installation & Local Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Shsrma/Chat-Application-AS2.git
cd Chat-Application-AS2
```

### 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

Create `.env` file inside backend:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/chatapp
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### 3️⃣ Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4️⃣ Start MongoDB

Make sure MongoDB is running:

```bash
mongod
```

### 5️⃣ Run the Application

From root folder:

```bash
npm run dev
```

Or manually:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## 📊 Evaluation Criteria Coverage

| Requirement | Status |
|---|---|
| Chat UI in React | ✅ Completed |
| WebSocket Backend (Socket.IO) | ✅ Completed |
| Store Chat History | ✅ Completed |
| Seen/Delivered Status | ✅ Implemented |
| Private & Group Chats | ✅ Supported |
| Real-time Messages | ✅ Working |
| Multiple Users | ✅ Supported |
| Frontend-Backend Integration | ✅ Complete |

---

## 📚 References

- Socket.IO Documentation: https://socket.io/docs/
- WebSocket API: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
- MongoDB Documentation: https://www.mongodb.com/docs/

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this project, feel free to fork it and submit a Pull Request.

1. **Fork the Repository** on GitHub.
2. **Clone your Fork** locally:
   ```bash
   git clone https://github.com/your-username/Chat-Application-AS2.git
   ```
3. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Commit your Changes**:
   ```bash
   git commit -m "Add some feature"
   ```
5. **Push to the Branch**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** to the main repository.

If you find any bugs or have feature requests, please [open an issue](https://github.com/Shsrma/Chat-Application-AS2/issues).

---

## 👨‍💻 Author

**Ankur Sharma**  
Full-Stack Developer

---

## 📌 Future Improvements

- Typing indicator
- Online/offline status
- Message reactions
- File sharing
- Deployment to AWS / Render
