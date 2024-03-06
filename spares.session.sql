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

