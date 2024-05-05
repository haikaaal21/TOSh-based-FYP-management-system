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

-- DELETE FROM "User" WHERE email ='kalkal22@gmail.com';
-- ALTER TABLE "User" ALTER COLUMN email SET UNIQUE; -- Remove the "SET" keyword
-- select * from "User";

-- alter table "User" alter column email 
-- set email varchar(255) not null unique;
-- SELECT * from "AcademicStaff";




-- -- Batch Items

-- create table if not exists "Batch" (
--     batchID serial primary key,
--     batchName varchar(255) not null,
--     batchYear varchar(4) not null,
--     batchStatus boolean not null default false,
--     batchImage varchar(255) not null default './assets/default/batch.jpg',
--     batchHead integer not null references "AcademicStaff"(staffID)
-- );

-- create table if not exists "BatchDocumentation" (
--     batchDocumentationID serial primary key,
--     batchID integer not null references "Batch"(batchID),
--     batchYear varchar(4) not null,
--     batchDocumentation varchar(255) not null
-- );

-- -- Project Items

-- create table if not exists "Project" (
--     projectID serial primary key,
--     projectTitle varchar(255) not null,
--     projectDescription text not null,
--     approvalStatus boolean not null default false,
--     projectType varchar(255) not null,
--     projectImage varchar(255) not null default './assets/default/project.jpg',
--     supervisorID integer not null references "AcademicStaff"(staffID),
--     batchID integer not null references "Batch"(batchID)
-- );

-- create table if not exists "RequestToUndertakeProject" (
--     requestID serial primary key,
--     projectID integer not null references "Project"(projectID),
--     studentID integer not null references "Student"(studentID),
--     requestStatus boolean not null default false
-- );

-- -- Task Items

-- create table if not exists "Task" (
--     taskID serial primary key,
--     taskTitle varchar(255) not null,
--     taskDescription text not null,
--     taskSubmitted boolean not null default false,
--     duedate date not null,
--     yellowZone date not null,
--     redZone date not null,
--     lock boolean not null default false,
--     assignedFrom integer not null references "AcademicStaff"(staffID)
-- );

-- create table if not exists "TaskUser" (
--     taskUserID serial primary key,
--     taskID integer not null references "Task"(taskID),
--     assignedTo integer not null references "User"(userID)
-- );

-- create table if not exists "TaskFiles" (
--     taskFileID serial primary key,
--     taskID integer not null references "Task"(taskID),
--     taskFile varchar(255) not null
-- );

-- create table if not exists "TaskSubmissionFile" (
--     taskSubmissionFileID serial primary key,
--     taskID integer not null references "Task"(taskID),
--     taskSubmissionFile varchar(255) not null
-- );

-- -- Event Items

-- create table if not exists "Event" (
--     eventID serial primary key,
--     eventTitle varchar(255) not null,
--     eventDescription text not null,
--     eventDate date not null,
--     eventTime time not null,
--     gmapEmbed varchar(255) not null,
--     eventImage varchar(255) not null default './assets/default/event.jpg',
--     eventHead integer not null references "AcademicStaff"(staffID)
-- );

-- create table if not exists "EventUser" (
--     eventUserID serial primary key,
--     eventID integer not null references "Event"(eventID),
--     assignedTo integer not null references "User"(userID)
-- );

-- create table if not exists "EventFiles" (
--     eventFileID serial primary key,
--     eventID integer not null references "Event"(eventID),
--     eventFile varchar(255) not null
-- );

-- create table if not exists "EventSpeaker" (
--     eventSpeakerID serial primary key,
--     eventID integer not null references "Event"(eventID),
--     eventSpeaker varchar(255) not null,
--     eventSpeakerImage varchar(255) not null default './assets/default/speaker.jpg',
--     eventSpeakerBio varchar(255)
-- );

-- -- Altered Items

-- alter table if exists "Student" alter column batchID type integer references "Batch"(batchID);
-- alter table if exists "Student" add column projectID integer references "Project"(projectID);

-- alter table "Student" add constraint student_batch_fk foreign key (batchid) references "Batch"(batchid);

-- alter table "User" drop column unsubmittedTasks;

-- alter table "User" add column pastduetasks integer not null default 0;
-- alter table "User" add column redtasks integer not null default 0;
-- alter table "User" add column yellowtasks integer not null default 0; 

Select * from "Event";