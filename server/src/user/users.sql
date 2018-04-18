CREATE TABLE passwordless
(
  id serial NOT NULL,
  uid character varying(160),
  token character varying(60) NOT NULL,
  origin text,
  ttl bigint,
  CONSTRAINT passwordless_pkey PRIMARY KEY (id),
  CONSTRAINT passwordless_token_key UNIQUE (token),
  CONSTRAINT passwordless_uid_key UNIQUE (uid)
);
