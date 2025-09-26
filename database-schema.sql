-- Database schema untuk aplikasi chat
-- Jalankan script ini di PostgreSQL database Anda

-- Buat tabel User
CREATE TABLE IF NOT EXISTS "User" (
    uid VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Buat tabel Chat
CREATE TABLE IF NOT EXISTS "Chat" (
    chat_id VARCHAR(36) PRIMARY KEY,
    user1_id VARCHAR(36) NOT NULL REFERENCES "User"(uid) ON DELETE CASCADE,
    user2_id VARCHAR(36) NOT NULL REFERENCES "User"(uid) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user1_id, user2_id)
);

-- Buat tabel Message
CREATE TABLE IF NOT EXISTS "Message" (
    message_id VARCHAR(36) PRIMARY KEY,
    chat_id VARCHAR(36) NOT NULL REFERENCES "Chat"(chat_id) ON DELETE CASCADE,
    sender_id VARCHAR(36) NOT NULL REFERENCES "User"(uid) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Buat index untuk performa yang lebih baik
CREATE INDEX IF NOT EXISTS idx_message_chat_id ON "Message"(chat_id);
CREATE INDEX IF NOT EXISTS idx_message_sent_at ON "Message"(sent_at);
CREATE INDEX IF NOT EXISTS idx_chat_user1 ON "Chat"(user1_id);
CREATE INDEX IF NOT EXISTS idx_chat_user2 ON "Chat"(user2_id);

-- Tambahkan beberapa data sample (opsional)
INSERT INTO "User" (uid, name, email) VALUES 
('user-1', 'John Doe', 'john@example.com'),
('user-2', 'Jane Smith', 'jane@example.com')
ON CONFLICT (email) DO NOTHING;