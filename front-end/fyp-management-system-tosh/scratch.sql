-- create table IF NOT EXISTS "Complaint" (
--     complaintid serial primary key,
--     studentid integer references "Student"(studentid),
--     complainttitle varchar(100),
--     complainttext text,
--     complaintstatus varchar(20),
--     complaintnotification integer
-- )

-- create table if not exists "ComplaintFile" (
--     complaintfileid serial primary key,
--     complaintid integer references "Complaint"(complaintid),
--     complaintfilename varchar(100),
--     complaintfiletype varchar(20),
--     studentid integer references "Student"(studentid)
-- )

-- create table if not exists "ComplaintReply" (
--     complaintreplyid serial primary key,
--     complaintid integer references "Complaint"(complaintid),
--     userid integer,
--     complaintreplytext text,
--     complaintreplydate date
-- )

-- create table if not exists "ComplaintReplyFile" (
--     complaintreplyfileid serial primary key,
--     complaintreplyid integer references "ComplaintReply"(complaintreplyid),
--     complaintreplyfilename varchar(100),
--     complaintreplyfiletype varchar(20),
--     userid integer
-- )


