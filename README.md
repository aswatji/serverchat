# Chat Server with Prisma

A real-time chat server built with Node.js, Express, Socket.IO, and Prisma ORM using PostgreSQL database. This project follows a modular architecture with separate controllers, routes, middleware, and socket handlers.

## 🚀 Features

- **Real-time messaging** with Socket.IO
- **User management** with CRUD operations
- **Chat creation and management** between users
- **Message history** with pagination
- **Last message tracking** per user pair
- **RESTful API endpoints** with proper validation
- **Modular architecture** for maintainability
- **Error handling** with custom middleware
- **Input validation** and sanitization
- **Typing indicators** and user status updates
- **Graceful shutdown** handling

## 📁 Project Structure

```
serverchat/
├── src/
│   ├── config/
│   │   ├── database.js          # Prisma client configuration
│   │   └── socket.js            # Socket.IO configuration
│   ├── controllers/
│   │   ├── userController.js    # User-related business logic
│   │   ├── chatController.js    # Chat-related business logic
│   │   └── messageController.js # Message-related business logic
│   ├── middleware/
│   │   ├── errorHandler.js      # Error handling middleware
│   │   └── validation.js        # Input validation middleware
│   ├── routes/
│   │   ├── index.js            # Main router
│   │   ├── userRoutes.js       # User routes
│   │   ├── chatRoutes.js       # Chat routes
│   │   └── messageRoutes.js    # Message routes
│   ├── sockets/
│   │   └── chatSocket.js       # Socket.IO event handlers
│   └── utils/
│       └── helpers.js          # Utility functions
├── prisma/
│   └── schema.prisma           # Database schema
├── .env                        # Environment variables
├── index.js                    # Main server file
└── package.json               # Dependencies and scripts
```

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up your database:

   - Create a PostgreSQL database
   - Update the `DATABASE_URL` in `.env` file with your database credentials

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Run database migrations:

```bash
npm run prisma:migrate
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/serverchat?schema=public"
PORT=3000
NODE_ENV=development
```

## Running the Application

### Development mode with auto-restart:

```bash
npm run dev
```

### Production mode:

```bash
npm start
```

### Database management:

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Reset database (careful: deletes all data)
npm run prisma:reset
```

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

### Chats

- `GET /api/chats/:userId` - Get all chats for a user
- `POST /api/chats` - Create a new chat

### Messages

- `GET /api/messages/:chatId` - Get messages for a chat
- `POST /api/messages` - Send a new message

## Socket.IO Events

### Client to Server:

- `join_chat` - Join a chat room
- `leave_chat` - Leave a chat room
- `send_message` - Send a message

### Server to Client:

- `new_message` - Receive a new message
- `error` - Receive error information

## Database Schema

The application uses the following models:

- **User**: User information and relationships
- **Chat**: Chat sessions between two users
- **Message**: Individual messages in chats
- **LastMessage**: Tracking of last messages per user pair

## Example Usage

### Create a user:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Create a chat:

```bash
curl -X POST http://localhost:3000/api/chats \
  -H "Content-Type: application/json" \
  -d '{"user1_id": "user1-uuid", "user2_id": "user2-uuid"}'
```

### Send a message:

```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"chat_id": "chat-uuid", "sent_by": "user-uuid", "content": "Hello!"}'
```

## License

ISC
