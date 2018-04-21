CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users
(
  id uuid DEFAULT uuid_generate_v4(),
  email character varying(160) NOT NULL,
  role character varying(20) NOT NULL,
  CONSTRAINT users_uid PRIMARY KEY (id),
  CONSTRAINT users_email UNIQUE (email)
);
