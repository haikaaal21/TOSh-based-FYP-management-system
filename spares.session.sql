-- Table Creation

-- create table "User" (
--     userID serial primary key,
--     email varchar(255) not null unique,
--     salt varchar(255) not null,
--     password varchar(255) not null,
--     name varchar(255) not null,
--     dob date not null,
--     matricNumber varchar(7) not null unique,
--     institution varchar(255) not null,
--     unsubmittedTasks integer not null default 0,
--     profilePic varchar(255) not null default './assets/defaultProfilePic.jpg'
-- );

-- create table "AcademicStaff" (
--     staffID serial primary key,
--     isCoordinator boolean,
--     isSupervisor boolean,
--     userID integer not null references "User"(userID)
-- ) inherits ("User");

-- create table "Student" (
--     studentID serial primary key,
--     batchID varchar(15) not null,
--     userID integer not null references "User"(userID)
-- ) inherits ("User");

-- alter table "User" alter column matricNumber type varchar(50),
-- alter column matricNumber set not null,
-- add constraint matricNumber unique (matricNumber);

-- select * from "Student";

-- Create table University (
--     uniID serial primary key,
--     uniName varchar(255) not null,
--     typeOfUni varchar(255) not null
-- );

-- INSERT INTO University (uniID, uniName, typeOfUni) VALUES
-- (1, 'Universiti Utara Malaysia', 'Public'),
-- (2, 'Universiti Malaya', 'Public'),
-- (3, 'Universiti Teknologi Malaysia', 'Public'),
-- (4, 'Universiti Sains Malaysia', 'Public'),
-- (5, 'Universiti Kebangsaan Malaysia', 'Public'),
-- (6, 'Universiti Putra Malaysia', 'Public'),
-- (7, 'Universiti Islam Antarabangsa Malaysia', 'Public'),
-- (8, 'Universiti Malaysia Sabah', 'Public'),
-- (9, 'Universiti Malaysia Sarawak', 'Public'),
-- (10, 'Universiti Teknologi MARA', 'Public'),
-- (11, 'Universiti Kuala Lumpur', 'Public'),
-- (12, 'Universiti Tun Hussein Onn Malaysia', 'Public'),
-- (13, 'Universiti Teknikal Malaysia Melaka', 'Public'),
-- (14, 'Universiti Malaysia Pahang', 'Public'),
-- (15, 'Universiti Malaysia Perlis', 'Public'),
-- (16, 'Universiti Sultan Zainal Abidin', 'Public'),
-- (17, 'Universiti Malaysia Terengganu', 'Public'),
-- (18, 'Multimedia University', 'Private'),
-- (19, 'Taylor''s University', 'Private'),
-- (20, 'Sunway University', 'Private'),
-- (21, 'Monash University Malaysia', 'Private'),
-- (22, 'Asia Pacific University of Technology & Innovation', 'Private'),
-- (23, 'International Medical University', 'Private'),
-- (24, 'University of Nottingham Malaysia', 'Private'),
-- (25, 'HELP University', 'Private');

select * from university;

