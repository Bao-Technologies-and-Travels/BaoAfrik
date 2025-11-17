-- 1. CreateEnum only if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'messagetype') THEN
        CREATE TYPE "MessageType" AS ENUM ('INQUIRY', 'NEGOTIATION', 'ORDER', 'COMPLAINT', 'GENERAL', 'TEXT', 'IMAGE', 'VOICE', 'FILE');
    ELSE
        -- Add new enum values if they don't exist
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'messagetype') AND enumlabel = 'VOICE') THEN
            ALTER TYPE "MessageType" ADD VALUE 'VOICE';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'messagetype') AND enumlabel = 'FILE') THEN
            ALTER TYPE "MessageType" ADD VALUE 'FILE';
        END IF;
    END IF;
END $$;

-- 2. Create tables only if they don't exist
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone_number" TEXT,
    "password_hash" TEXT,
    "profile_image" TEXT,
    "gender" TEXT,
    "birth_date" TIMESTAMP(3),
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verification_code" TEXT,
    "email_verification_expires" TIMESTAMP(3),
    "password_reset_token" TEXT,
    "password_reset_token_expires" TIMESTAMP(3),
    "password_reset_code" TEXT,
    "password_reset_expires" TIMESTAMP(3),
    "provider" TEXT,
    "provider_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified_seller" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION DEFAULT 0.0,
    "total_sales" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "products" (
    "id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "location" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "sale_type" TEXT NOT NUll DEFAULT 'DEFAULT',
    "delivery_available" BOOLEAN DEFAULT false,
    "images" JSONB,
    "specifications" JSONB,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'DRAFT'
    "tags" JSONB,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "save_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "product_likes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_likes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "product_saves" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_saves_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "messages" (
    "id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "product_id" TEXT,
    "conversation_id" TEXT,
    "image_url" TEXT,
    "audio_url" TEXT,
    "file_url" TEXT,
    "file_name" TEXT,
    "file_size" INTEGER,
    "reply_to_id" TEXT,
    "product_snapshot" JSONB,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "message_type" "MessageType" NOT NULL DEFAULT 'INQUIRY',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "countries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "flag" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "conversations" (
    "id" TEXT NOT NULL,
    "product_id" TEXT,
    "last_message_id" TEXT,
    "last_message_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "conversation_participants" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("id")
);

-- 3. Create new tables for enhanced features
CREATE TABLE IF NOT EXISTS "message_status" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "message_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "message_status_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "message_status_message_id_user_id_key" UNIQUE ("message_id", "user_id")
);

-- 4. Create indexes (idempotent)
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "refresh_tokens_token_key" ON "refresh_tokens"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "product_likes_user_id_product_id_key" ON "product_likes"("user_id", "product_id");
CREATE UNIQUE INDEX IF NOT EXISTS "product_saves_user_id_product_id_key" ON "product_saves"("user_id", "product_id");
CREATE UNIQUE INDEX IF NOT EXISTS "categories_name_key" ON "categories"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_key" ON "categories"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "countries_name_key" ON "countries"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "countries_code_key" ON "countries"("code");

CREATE INDEX IF NOT EXISTS "conversations_product_id_idx" ON "conversations"("product_id");
CREATE INDEX IF NOT EXISTS "conversations_last_message_at_idx" ON "conversations"("last_message_at" DESC);
CREATE INDEX IF NOT EXISTS "conversation_participants_conversation_id_idx" ON "conversation_participants"("conversation_id");
CREATE INDEX IF NOT EXISTS "conversation_participants_user_id_idx" ON "conversation_participants"("user_id");
CREATE INDEX IF NOT EXISTS "messages_conversation_id_idx" ON "messages"("conversation_id");
CREATE INDEX IF NOT EXISTS "messages_sender_id_idx" ON "messages"("sender_id");
CREATE INDEX IF NOT EXISTS "messages_receiver_id_idx" ON "messages"("receiver_id");
CREATE INDEX IF NOT EXISTS "messages_created_at_idx" ON "messages"("created_at" DESC);

-- New indexes 
CREATE INDEX IF NOT EXISTS "messages_reply_to_id_idx" ON "messages"("reply_to_id");
CREATE INDEX IF NOT EXISTS "messages_message_type_idx" ON "messages"("message_type");
CREATE INDEX IF NOT EXISTS "messages_audio_url_idx" ON "messages"("audio_url") WHERE "audio_url" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "messages_file_url_idx" ON "messages"("file_url") WHERE "file_url" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "messages_conversation_created_idx" ON "messages"("conversation_id", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "messages_unread_idx" ON "messages"("conversation_id", "is_read") WHERE "is_read" = false;

CREATE INDEX IF NOT EXISTS "message_status_message_id_idx" ON "message_status"("message_id");
CREATE INDEX IF NOT EXISTS "message_status_user_id_idx" ON "message_status"("user_id");
CREATE INDEX IF NOT EXISTS "message_status_status_idx" ON "message_status"("status");

-- 5. Add foreign keys (idempotent)
DO $$ BEGIN
    -- Refresh tokens
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'refresh_tokens_user_id_fkey') THEN
        ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    -- Products
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'products_seller_id_fkey') THEN
        ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    -- Product likes
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'product_likes_user_id_fkey') THEN
        ALTER TABLE "product_likes" ADD CONSTRAINT "product_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'product_likes_product_id_fkey') THEN
        ALTER TABLE "product_likes" ADD CONSTRAINT "product_likes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    -- Product saves
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'product_saves_user_id_fkey') THEN
        ALTER TABLE "product_saves" ADD CONSTRAINT "product_saves_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'product_saves_product_id_fkey') THEN
        ALTER TABLE "product_saves" ADD CONSTRAINT "product_saves_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    -- Conversations
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'conversations_product_id_fkey') THEN
        ALTER TABLE "conversations" ADD CONSTRAINT "conversations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'conversations_last_message_id_fkey') THEN
        ALTER TABLE "conversations" ADD CONSTRAINT "conversations_last_message_id_fkey" FOREIGN KEY ("last_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    -- Conversation participants
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'conversation_participants_conversation_id_fkey') THEN
        ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'conversation_participants_user_id_fkey') THEN
        ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    -- Messages
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'messages_sender_id_fkey') THEN
        ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'messages_receiver_id_fkey') THEN
        ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'messages_product_id_fkey') THEN
        ALTER TABLE "messages" ADD CONSTRAINT "messages_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'messages_conversation_id_fkey') THEN
        ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    -- Enhanced features foreign keys
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'messages_reply_to_id_fkey') THEN
        ALTER TABLE "messages" ADD CONSTRAINT "messages_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'message_status_message_id_fkey') THEN
        ALTER TABLE "message_status" ADD CONSTRAINT "message_status_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'message_status_user_id_fkey') THEN
        ALTER TABLE "message_status" ADD CONSTRAINT "message_status_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- 6. Create functions and triggers
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "conversations" 
    SET 
        "last_message_id" = NEW."id",
        "last_message_at" = NEW."created_at",
        "updated_at" = NOW()
    WHERE "id" = NEW."conversation_id";
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_conversation_last_message ON "messages";
CREATE TRIGGER trigger_update_conversation_last_message
    AFTER INSERT ON "messages"
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_last_message();

CREATE OR REPLACE FUNCTION initialize_message_status()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "message_status" ("message_id", "user_id", "status")
    VALUES (NEW."id", NEW."receiver_id", 'sent');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_initialize_message_status ON "messages";
CREATE TRIGGER trigger_initialize_message_status
    AFTER INSERT ON "messages"
    FOR EACH ROW
    EXECUTE FUNCTION initialize_message_status();

-- 7. Create views
CREATE OR REPLACE VIEW conversation_details AS
SELECT 
    c.id as conversation_id,
    c.product_id,
    c.last_message_id,
    c.last_message_at,
    c.created_at as conversation_created_at,
    c.updated_at as conversation_updated_at,
    p1.user_id as user1_id,
    p2.user_id as user2_id,
    u1.first_name as user1_first_name,
    u1.last_name as user1_last_name,
    u1.profile_image as user1_profile_image,
    u2.first_name as user2_first_name,
    u2.last_name as user2_last_name,
    u2.profile_image as user2_profile_image,
    prod.name as product_name,
    prod.price as product_price,
    prod.images as product_images,
    lm.content as last_message_content,
    lm.message_type as last_message_type,
    lm.created_at as last_message_created_at,
    sender.first_name as last_message_sender_first_name,
    sender.last_name as last_message_sender_last_name
FROM conversations c
JOIN conversation_participants p1 ON c.id = p1.conversation_id
JOIN conversation_participants p2 ON c.id = p2.conversation_id AND p1.user_id != p2.user_id
JOIN users u1 ON p1.user_id = u1.id
JOIN users u2 ON p2.user_id = u2.id
LEFT JOIN products prod ON c.product_id = prod.id
LEFT JOIN messages lm ON c.last_message_id = lm.id
LEFT JOIN users sender ON lm.sender_id = sender.id
WHERE p1.id < p2.id;

-- 8. Create utility functions
CREATE OR REPLACE FUNCTION get_user_unread_counts(user_uuid UUID)
RETURNS TABLE(conversation_id UUID, unread_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as conversation_id,
        COUNT(m.id) as unread_count
    FROM conversations c
    JOIN conversation_participants cp ON c.id = cp.conversation_id
    LEFT JOIN messages m ON c.id = m.conversation_id 
        AND m.sender_id != user_uuid 
        AND m.is_read = false
    WHERE cp.user_id = user_uuid
    GROUP BY c.id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION mark_conversation_as_read(conversation_uuid UUID, user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE messages 
    SET is_read = true
    WHERE conversation_id = conversation_uuid 
    AND sender_id != user_uuid 
    AND is_read = false;
    
    UPDATE message_status 
    SET status = 'read', updated_at = NOW()
    WHERE user_id = user_uuid 
    AND message_id IN (
        SELECT id FROM messages 
        WHERE conversation_id = conversation_uuid 
        AND sender_id != user_uuid
    );
    
    UPDATE conversation_participants 
    SET last_read_at = NOW()
    WHERE conversation_id = conversation_uuid 
    AND user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- 9. Initialize message_status for existing messages 
INSERT INTO "message_status" ("message_id", "user_id", "status")
SELECT 
    m.id as message_id,
    m.receiver_id as user_id,
    CASE 
        WHEN m.is_read = true THEN 'read'
        ELSE 'sent'
    END as status
FROM "messages" m
WHERE NOT EXISTS (
    SELECT 1 FROM "message_status" ms 
    WHERE ms.message_id = m.id AND ms.user_id = m.receiver_id
);

-- Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Database-level encryption key
CREATE OR REPLACE FUNCTION get_db_encryption_key()
RETURNS TEXT AS $$
BEGIN
    RETURN current_setting('app.db_encryption_key');
END;
$$ LANGUAGE plpgsql;

-- Database level encryption
CREATE OR REPLACE FUNCTION db_encrypt(data TEXT)
RETURN TEXT AS $$
DECLARE
    encryption_key TEXT;
BEGIN
    -- Get the encryption key from environment or use fallback
    BEGIN
        encryption_key := current_setting('app.db_encryption_key');
    EXCEPTION 
        WHEN undefined_object THEN
            encryption_key := 'fallback-db-encryption-key-change-in-prod';
    END;

    -- Encrypt the data
    RETURN encode(
        encrypt(
            convert_to(data, 'UTF8');
            db_key,
            'aes'
        ),
        'base64'
    );
END
$$ LANGUAGE plpgsql;

-- Database level decryption  
CREATE OR REPLACE FUNCTION db_decrypt(encrypted_data TEXT)
RETURNS TEXT AS $$
DECLARE
    encryption_key TEXT;
BEGIN
    -- Get the encryption key from environment or use a fallback
    BEGIN
        encryption_key := current_setting('app.db_encryption_key');
    EXCEPTION 
        WHEN undefined_object THEN
            encryption_key := 'fallback-db-encryption-key-change-in-prod';
    END;
    
    -- Decrypt the data
    RETURN convert_from(
        decrypt(
            decode(encrypted_data, 'base64'), 
            encryption_key, 
            'aes'
        ), 
        'UTF8'
    );
END;
$$ LANGUAGE plpgsql;