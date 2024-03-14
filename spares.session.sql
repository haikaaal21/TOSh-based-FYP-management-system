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
--     profilePic varchar(255) not null default './assets/defaultProfilePic.jpg'--- );"
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
-- );mi-- INSERT INTO University (uniID, uniName, typeOfUni) VALUESr-- (1, 'Universiti Utara Malaysia', 'Public'),o-- (2, 'Universiti Malaya', 'Public'),l-- (3, 'Universiti Teknologi Malaysia', 'Public'),o-- (4, 'Universiti Sains Malaysia', 'Public'),
-- (5, 'Universiti Kebangsaan Malaysia', 'Public'),n-- (6, 'Universiti Putra Malaysia', 'Public'), -- (7, 'Universiti Islam Antarabangsa Malaysia', 'Public'),1-- (8, 'Universiti Malaysia Sabah', 'Public'),o-- (9, 'Universiti Malaysia Sarawak', 'Public'),
-- (10, 'Universiti Teknologi MARA', 'Public'),a-- (11, 'Universiti Kuala Lumpur', 'Public'),u-- (12, 'Universiti Tun Hussein Onn Malaysia', 'Public'),c-- (13, 'Universiti Teknikal Malaysia Melaka', 'Public'),e-- (14, 'Universiti Malaysia Pahang', 'Public'),s-- (15, 'Universiti Malaysia Perlis', 'Public'),m-- (16, 'Universiti Sultan Zainal Abidin', 'Public'),2-- (17, 'Universiti Malaysia Terengganu', 'Public'),r-- (18, 'Multimedia University', 'Private'),n-- (19, 'Taylor''s University', 'Private'),i-- (20, 'Sunway University', 'Private'),a-- (21, 'Monash University Malaysia', 'Private'),y-- (22, 'Asia Pacific University of Technology & Innovation', 'Private'),o-- (23, 'International Medical University', 'Private'),s-- (24, 'University of Nottingham Malaysia', 'Private'),n-- (25, 'HELP University', 'Private');atan Zainal Abidin', 'Public'),
-- (17, 'Universiti Malaysia Terengganu', 'Public'),
-- (18, 'Multimedia University', 'Private'),
-- (19, 'Taylor''s University', 'Private'),
-- (20, 'Sunway University', 'Private'),
-- (21, 'Monash University Malaysia', 'Private'),
-- (22, 'Asia Pacific University of Technology & Innovation', 'Private'),
-- (23, 'International Medical University', 'Private'),
-- (24, 'University of Nottingham Malaysia', 'Private'),
-- (25, 'HELP University', 'Private');

-- Make a trigger if isStaff is true, then isStudent is false, and vice versa

