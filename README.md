# Chat Server

A real-time chat server built with Node.js, Express, Socket.IO, and PostgreSQL.

## Features

- Real-time messaging with Socket.IO
- RESTful API for user and chat management
- PostgreSQL database with native SQL queries
- User authentication and management
- Chat room management
- Message history
- Typing indicators
- User online/offline status
- CORS enabled for cross-origin requests

## Tech Stack

- **Backend**: Node.js, Express.js
- **Real-time**: Socket.IO
- **Database**: PostgreSQL (with pg driver)
- **Environment**: Docker support

## API Documentation

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/:userId` - Get user by ID
- `PUT /api/users/:userId` - Update user
- `DELETE /api/users/:userId` - Delete user

### Chats
- `GET /api/chats/user/:userId` - Get user's chats
- `POST /api/chats` - Create a new chat
- `GET /api/chats/:chatId` - Get chat by ID
- `DELETE /api/chats/:chatId` - Delete chat

### Messages
- `GET /api/messages/chat/:chatId` - Get messages in a chat
- `POST /api/messages` - Send a new message
- `GET /api/messages/:messageId` - Get message by ID
- `PUT /api/messages/:messageId` - Update message
- `DELETE /api/messages/:messageId` - Delete message

## Socket Events

### Client to Server
- `join_chat` - Join a chat room
- `leave_chat` - Leave a chat room
- `send_message` - Send a message
- `typing` - User is typing
- `stop_typing` - User stopped typing
- `user_online` - User came online
- `user_offline` - User went offline

### Server to Client
- `message_received` - New message received
- `user_typing` - Someone is typing
- `user_stop_typing` - Someone stopped typing
- `user_online` - User came online
- `user_offline` - User went offline
- `error` - Error occurred

## Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd serverchat
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your database URL in `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

5. Set up the database by running the SQL schema:
```bash
# Connect to your PostgreSQL database and run:
psql -d your_database -f database-schema.sql
```

6. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Docker Setup

1. Build the Docker image:
```bash
docker build -t serverchat .
```

2. Run the container:
```bash
docker run -p 80:80 --env-file .env serverchat
```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 80)
- `NODE_ENV` - Environment (development/production)

## Database Schema

The application uses the following main entities:

- **User**: Stores user information (uid, name, email)
- **Chat**: Represents a chat between two users
- **Message**: Individual messages in chats

Database schema is available in `database-schema.sql` file.

## Key Changes from Prisma Version

✅ **Removed Prisma dependencies** - No more complex binary compatibility issues
✅ **Native PostgreSQL queries** - Direct pg driver connection
✅ **Simplified Docker setup** - No Prisma generation needed
✅ **Better performance** - Direct SQL queries
✅ **Easier deployment** - No ORM complications

## Deployment

For CapRover or other container platforms:

1. Ensure your `DATABASE_URL` environment variable is set
2. Run the `database-schema.sql` on your PostgreSQL database
3. Deploy using the provided Dockerfile

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC License