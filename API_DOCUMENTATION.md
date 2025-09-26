# API Documentation

## Base URL

```
http://localhost:3001/api
```

## Authentication

Currently, this API does not require authentication. In production, you should implement proper authentication and authorization.

## Response Format

All API responses follow this format:

```json
{
  "success": boolean,
  "message": string,
  "data": any,
  "timestamp": string
}
```

## Error Handling

Error responses include:

```json
{
  "error": string,
  "message": string,
  "details": string (development only)
}
```

---

## Users API

### Get All Users

- **GET** `/api/users`
- **Description**: Retrieve all users
- **Response**: Array of user objects

**Example Response:**

```json
[
  {
    "uid": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com"
  }
]
```

### Create User

- **POST** `/api/users`
- **Description**: Create a new user
- **Body**:

```json
{
  "name": "string (required)",
  "email": "string (required, unique, valid email)"
}
```

### Get User by ID

- **GET** `/api/users/:userId`
- **Description**: Get a specific user by ID
- **Parameters**: `userId` - User UUID

### Update User

- **PUT** `/api/users/:userId`
- **Description**: Update user information
- **Body**:

```json
{
  "name": "string (optional)",
  "email": "string (optional, unique, valid email)"
}
```

### Delete User

- **DELETE** `/api/users/:userId`
- **Description**: Delete a user
- **Response**: 204 No Content

---

## Chats API

### Get User Chats

- **GET** `/api/chats/:userId`
- **Description**: Get all chats for a specific user
- **Parameters**: `userId` - User UUID
- **Response**: Array of chat objects with participants and last message

**Example Response:**

```json
[
  {
    "chat_id": "550e8400-e29b-41d4-a716-446655440001",
    "user1_id": "550e8400-e29b-41d4-a716-446655440000",
    "user2_id": "550e8400-e29b-41d4-a716-446655440002",
    "created_at": "2023-01-01T00:00:00.000Z",
    "user1": {
      "uid": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "user2": {
      "uid": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "messages": [
      {
        "message_id": "550e8400-e29b-41d4-a716-446655440003",
        "content": "Hello!",
        "sent_at": "2023-01-01T12:00:00.000Z"
      }
    ]
  }
]
```

### Create Chat

- **POST** `/api/chats`
- **Description**: Create a new chat between two users
- **Body**:

```json
{
  "user1_id": "string (required, UUID)",
  "user2_id": "string (required, UUID, different from user1_id)"
}
```

### Get Chat by ID

- **GET** `/api/chats/chat/:chatId`
- **Description**: Get a specific chat with all messages
- **Parameters**: `chatId` - Chat UUID

### Delete Chat

- **DELETE** `/api/chats/chat/:chatId`
- **Description**: Delete a chat and all its messages
- **Response**: 204 No Content

---

## Messages API

### Get Chat Messages

- **GET** `/api/messages/:chatId`
- **Description**: Get messages for a specific chat
- **Parameters**: `chatId` - Chat UUID
- **Query Parameters**:
  - `page` - Page number (default: 1)
  - `limit` - Messages per page (default: 50, max: 100)

**Example Response:**

```json
[
  {
    "message_id": "550e8400-e29b-41d4-a716-446655440003",
    "chat_id": "550e8400-e29b-41d4-a716-446655440001",
    "sent_by": "550e8400-e29b-41d4-a716-446655440000",
    "content": "Hello, how are you?",
    "sent_at": "2023-01-01T12:00:00.000Z",
    "sender": {
      "uid": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

### Send Message

- **POST** `/api/messages`
- **Description**: Send a new message
- **Body**:

```json
{
  "chat_id": "string (required, UUID)",
  "sent_by": "string (required, UUID)",
  "content": "string (required, non-empty)"
}
```

### Get Message by ID

- **GET** `/api/messages/message/:messageId`
- **Description**: Get a specific message
- **Parameters**: `messageId` - Message UUID

### Update Message

- **PUT** `/api/messages/message/:messageId`
- **Description**: Update message content
- **Body**:

```json
{
  "content": "string (required, non-empty)"
}
```

### Delete Message

- **DELETE** `/api/messages/message/:messageId`
- **Description**: Delete a message
- **Response**: 204 No Content

---

## Socket.IO Events

### Client to Server Events

#### join_chat

Join a chat room to receive real-time messages.

```javascript
socket.emit("join_chat", chatId);
```

#### leave_chat

Leave a chat room.

```javascript
socket.emit("leave_chat", chatId);
```

#### send_message

Send a message via socket.

```javascript
socket.emit("send_message", {
  chat_id: "string",
  sent_by: "string",
  content: "string",
});
```

#### typing_start

Notify others that user is typing.

```javascript
socket.emit("typing_start", {
  chat_id: "string",
  user_id: "string",
  user_name: "string",
});
```

#### typing_stop

Notify others that user stopped typing.

```javascript
socket.emit("typing_stop", {
  chat_id: "string",
  user_id: "string",
});
```

#### message_read

Mark message as read.

```javascript
socket.emit("message_read", {
  chat_id: "string",
  message_id: "string",
  user_id: "string",
});
```

#### user_status

Update user online/offline status.

```javascript
socket.emit("user_status", {
  user_id: "string",
  status: "online" | "offline",
});
```

### Server to Client Events

#### new_message

Receive new messages in real-time.

```javascript
socket.on("new_message", (message) => {
  // Handle new message
});
```

#### user_joined

Notification when user joins chat.

```javascript
socket.on("user_joined", (data) => {
  // Handle user joined
});
```

#### user_left

Notification when user leaves chat.

```javascript
socket.on("user_left", (data) => {
  // Handle user left
});
```

#### user_typing

Receive typing indicators.

```javascript
socket.on("user_typing", (data) => {
  // Handle typing indicator
});
```

#### message_read_status

Receive message read confirmations.

```javascript
socket.on("message_read_status", (data) => {
  // Handle read status
});
```

#### user_status_update

Receive user status updates.

```javascript
socket.on("user_status_update", (data) => {
  // Handle status update
});
```

#### error

Receive error notifications.

```javascript
socket.on("error", (error) => {
  // Handle error
});
```

#### message_sent

Confirmation that message was sent successfully.

```javascript
socket.on("message_sent", (confirmation) => {
  // Handle send confirmation
});
```

---

## Status Codes

- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Error Codes

### Database Error Codes

- `23505` - Unique constraint violation (PostgreSQL)
- `23503` - Foreign key constraint violation
- `42P01` - Table does not exist

### Custom Validation Errors

- Invalid email format
- Required field missing
- Cannot create chat with yourself
- Message content cannot be empty
