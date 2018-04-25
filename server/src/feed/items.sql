CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE items
(
  id uuid DEFAULT uuid_generate_v4(),
  published_at TIMESTAMP DEFAULT NOW(),
  type character varying(20) NOT NULL,
  size int NOT NULL,
  content text NOT NULL,
  extension character varying(20),
  mimeType character varying(20) NOT NULL,
  encoding character varying(20) NOT NULL,
  originalName character varying(160),
  users_id UUID NOT NULL,
  CONSTRAINT items_id PRIMARY KEY (id),
  CONSTRAINT items_users_id FOREIGN KEY (users_id) REFERENCES users (id)
);
