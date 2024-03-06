const express = require('express');

class SparesStudentModel {
    constructor() {
        this.table_name = 'Student';
    }
    
    createStudentConstructor(email, name, password, salt, dob, matric_number, institution, unsubmitted_tasks, profile_picture){
        this.email = email;
        this.name = name;
        this.password = password;
        this.salt = salt;
        this.dob = dob;
        this.matric_number = matric_number;
        this.institution = institution;
        this.unsubmitted_tasks = unsubmitted_tasks;
        this.profile_picture = profile_picture;
    }
    
    createStudent() {
        let studentCreateQuery = `INSERT INTO "${this.table_name}" (email, name, password, salt, dob, matricNumber, institution, unsubmittedTasks, profilePic) VALUES ('${this.email}', '${this.name}' , '${this.password}', '${this.salt}', '${this.dob}', '${this.matric_number}', '${this.institution}' , '${this.unsubmitted_tasks}' , '${this.profile_picture}')`;
        return studentCreateQuery;
    }
}

module.exports = SparesStudentModel;
