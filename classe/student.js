export class Student {
	

	constructor(lastname, firstname, lessons = {}) {
		this.lastname = lastname;
		this.firstname = firstname;
		this.lessons = lessons;
	}


	// addLesson(lesson) {
	// 	this.lessons[lesson];
	// }

	// addGrade(lesson, grade) {
	// 		this.lessons[lesson] = grade; 
	// }
}