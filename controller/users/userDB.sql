

CREATE TABLE users(
id SERIAL PRIMARY KEY NOT NULL,
fullname TEXT NOT NULL,
email TEXT NOT NULL,
password TEXT NOT NULL,
gender text not null,
is_active boolean default 'true',
created_at date not null,
updated_at date,
deleted_at date
);

alter table users add column varchar(50) default 'frontend_user'