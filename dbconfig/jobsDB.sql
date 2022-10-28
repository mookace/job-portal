create table jobs(
    id serial primary key ,
    company_name text ,
    job_title text ,
    no_of_openings numeric ,
    job_category text,
    job_location text,
    job_level text,
    experience text,
    expiry_date text,
    skills text,
    job_description text,
    salary text,
    created_at date ,
    updated_at date,
    deleted_at date,
    is_deleted boolean default('false')
);