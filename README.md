# Ahead Chats App 💬

Ahead Chats is a full-stack real-time chat application built using the MERN stack and Socket.IO. It supports one-on-one messaging with online/offline indicators, typing indicators, authentication, and more.

## 🚀 Features

- User registration and login (with JWT)
- Real-time one-on-one chat using Socket.IO
- Online and typing status indicators
- Fully responsive UI using React and Chakra UI
- MongoDB for database storage

---

## 🛠 Tech Stack

- **Frontend**: React.js, Chakra UI, Axios, Context API
- **Backend**: Node.js, Express.js, Socket.IO, MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **Real-Time**: Socket.IO


## 🖥️ Installation & Running Locally


1 .CLone the Repo
```bash
git clone https://github.com/Paras022/Ahead-Chats-App.git
cd Ahead-Chats-App

2.Setup Backend
cd backend
npm install

3.Create a .env file inside the backend folder with the following keys:
PORT=8000
MONGO_URI= your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

4.Start the backend server
npm start

5.Setup Frontend
Open a new terminal and run:
cd frontend
npm install
npm run dev




