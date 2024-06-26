insert into "AcademicStaff" (email, salt, password, name, dob, matricnumber, institution, isstaff,isstudent, verified, iscoordinator, issupervisor)
values 
('dummydata15@dummymail.com', 'dummysalt123', 'dummypass123', 'Ikhsan Damar', '1965-10-12', '105102', 'Universiti Utara Malaysia', true, false, true, false, true), 
('dummydata16@dummymail.com', 'dummysalt123', 'dummypass123', 'Joko Rakasiregar', '1965-10-12', '105103', 'Universiti Utara Malaysia', true, false, true, false, true),
('dummydata17@dummymail.com', 'dummysalt123', 'dummypass123', 'Kartika Ayu', '1965-10-12', '105104', 'Universiti Utara Malaysia', true, false, true, false, true),
('dummydata18@dummymail.com', 'dummysalt123', 'dummypass123', 'Lukman Hakim', '1965-10-12', '105105', 'Universiti Utara Malaysia', true, false, true, false, true);

delete from "AcademicStaff" where salt = 'dummysalt123';

-- insert into "Student" (email, salt, password, name, dob, matricnumber, institution, isstaff,isstudent, verified)
-- values 
-- ('dummydata1@dummymail.com', 'dummysalt123', 'dummypass123', 'Afiq Arsyad', '2001-10-12', '283951', 'Universiti Utara Malaysia', false, true, true), 
-- ('dummydata2@dummymail.com', 'dummysalt123', 'dummypass123', 'Budi Santoso', '2001-10-12', '283952', 'Universiti Utara Malaysia', false, true, true),
-- ('dummydata3@dummymail.com', 'dummysalt123', 'dummypass123', 'Dewi Sartika', '2001-10-12', '283953', 'Universiti Utara Malaysia', false, true, true),
-- ('dummydata4@dummymail.com', 'dummysalt123', 'dummypass123', 'Eko Prasetyo', '2001-10-12', '283954', 'Universiti Utara Malaysia', false, true, true),
-- ('dummydata5@dummymail.com', 'dummysalt123', 'dummypass123', 'Fahmi Idris', '2001-10-12', '283955', 'Universiti Utara Malaysia', false, true, true),
-- ('dummydata6@dummymail.com', 'dummysalt123', 'dummypass123', 'Gita Suryani', '2001-10-12', '283956', 'Universiti Utara Malaysia', false, true, true),
-- ('dummydata7@dummymail.com', 'dummysalt123', 'dummypass123', 'Hari Nugroho', '2001-10-12', '283957', 'Universiti Utara Malaysia', false, true, true),
-- ('dummydata8@dummymail.com', 'dummysalt123', 'dummypass123', 'Indah Lestari', '2001-10-12', '283958', 'Universiti Utara Malaysia', false, true, true),
-- ('dummydata9@dummymail.com', 'dummysalt123', 'dummypass123', 'Joko Widodo', '2001-10-12', '283959', 'Universiti Utara Malaysia', false, true, true),
-- ('dummydata10@dummymail.com', 'dummysalt123', 'dummypass123', 'Kartika Ayu', '2001-10-12', '283960', 'Universiti Utara Malaysia', false, true, true);

