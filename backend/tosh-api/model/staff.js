const express = require('express');

class SparesAcademicStaffModel {
    constructor() {
        this.table_name = 'AcademicStaff';
    }
    
    //TODO : ROMBAK MIDDLEWARE
    createAcademicStaffConstructor(email, password, name, salt, dob, matric_number, institution, unsubmitted_tasks, profile_picture, is_coordinator, is_supervisor){
        this.email = email;
        this.name = name;
        this.password = password;
        this.salt = salt;
        this.dob = dob;
        this.matric_number = matric_number;
        this.institution = institution;
        this.unsubmitted_tasks = unsubmitted_tasks;
        this.profile_picture = profile_picture;
        this.is_coordinator = is_coordinator;
        this.is_supervisor = is_supervisor;
    }
    
    createAcademicStaff() {
        let academicStaffCreateQuery = `insert into "${this.table_name}" (email, name, password, salt, dob, matricNumber, institution, unsubmittedTasks, profilePic, isCoordinator, isSupervisor, isStudent) values ('${this.email}','${this.name}' , '${this.password}', '${this.salt}', '${this.dob}', '${this.matric_number}', '${this.institution}' , '${this.unsubmitted_tasks}' , '${this.profile_picture}', '${this.is_coordinator}', '${this.is_supervisor}', false);`; 
        return academicStaffCreateQuery;
    }
}

module.exports = SparesAcademicStaffModel;