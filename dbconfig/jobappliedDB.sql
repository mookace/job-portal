create table jobapplied(
    id serial primary key not null,
    job_id int not null,
    user_id int not null,
    foreign key(job_id) references jobs(id),
    foreign key(user_id) references users(id),
    applied_at date
)