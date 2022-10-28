

CREATE TABLE users(
id SERIAL PRIMARY KEY NOT NULL,
email TEXT NOT NULL,
password TEXT NOT NULL,
role text default('users') not null,
is_active boolean default('false'),
fullname TEXT ,
cv text,
created_at date not null,
updated_at date,
deleted_at date,
is_deleted boolean default('false')
);
