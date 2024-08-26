import { Student } from "./classe/student.js";

let students = [
	{
		lastname: "nom1",
		firstname: "prenom1",
		lessons: {
			svt: [15, 12],
			bla: [12],
			anglais: [12, 12],
		},
	},
	{
		lastname: "nom2",
		firstname: "prenom2",
		lessons: {
			svt: [20, 12],
			bla: [6],
			anglais: [1, 12],
		},
	},
];

let allLessons = Object.keys(students[0].lessons);

let visibilityElements = document.querySelectorAll(".visibility");
const eleveSelect = document.querySelector("#grade-student");
const noteInput = document.querySelector("#grade");
const matiereSelect = document.querySelector("#grade-field");

let studentChoice = document.querySelector("#student-choice");
let lessonfieldChoice = document.querySelector("#lessonfield-choice");

visibilityElements.forEach((visibility) => {
	visibility.addEventListener("click", () => {
		let form;

		if (visibility.id === "add-student-visibility") {
			form = document.querySelector("#add-student-form");
		} else if (visibility.id === "add-lessonfield-visibility") {
			form = document.querySelector("#add-lessonfield-form");
		} else if (visibility.id === "add-grade-visibility") {
			form = document.querySelector("#add-grade-form");
		}

		form.classList.toggle("hidden");

		if (form.classList.contains("hidden")) {
			visibility.textContent = "OFF";
		} else {
			visibility.textContent = "ON";
		}
	});
});

document
	.getElementById("btnajoutstudent")
	.addEventListener("click", function (e) {
		e.preventDefault();

		let nom = document.getElementById("student-lastname").value;
		let prenom = document.getElementById("student-firstname").value;

		const nouveauStudent = new Student(nom, prenom);
		students.push(nouveauStudent);

		document.getElementById("student-lastname").value = "";
		document.getElementById("student-firstname").value = "";

		refreshStudentSelect();
	});

document
	.getElementById("btnajoutmatiere")
	.addEventListener("click", function (e) {
		e.preventDefault();

		const matiere = document.getElementById("lesson-field").value;

		students.forEach((student) => {
			student.lessons[matiere] = [];
		});

        updateAllLessons();
        document.getElementById("lesson-field").value = "";
		refreshMatiereSelect();
	});

const updateAllLessons = () => {
	allLessons = Object.keys(students[0].lessons);
};

const refreshStudentSelect = () => {
	eleveSelect.innerHTML = '<option value="">Sélectionnez un élève</option>';
	studentChoice.innerHTML = '<option value="">Sélectionnez un élève</option>';
	students.forEach((student, index) => {
		eleveSelect.innerHTML += `<option value="${index}">${student.firstname}</option>`;
		studentChoice.innerHTML += `<option value="${index}">${student.firstname}</option>`;
	});
};

const refreshMatiereSelect = () => {
	matiereSelect.innerHTML ='<option value="0">Sélectionnez une matière</option>';
	lessonfieldChoice.innerHTML =
		'<option value="0">Sélectionnez une matière</option>';
	allLessons.forEach((matiere) => {
		matiereSelect.innerHTML += `<option value="${matiere}">${matiere}</option>`;
		lessonfieldChoice.innerHTML += `<option value="${matiere}">${matiere}</option>`;
	});
};

document.getElementById("btnajoutnote").addEventListener("click", function (e) {
	e.preventDefault();

	const studentIndex = eleveSelect.value;
	const matiere = matiereSelect.value;
	const note = noteInput.value;


	const studentIdx = parseInt(studentIndex);

	if (students[studentIdx]) {
		if (!students[studentIdx].lessons[matiere]) {
			students[studentIdx].lessons[matiere] = [];
		}
		students[studentIdx].lessons[matiere].push(parseFloat(note));
	}

	noteInput.value = "";
	console.log(students);
});

document.addEventListener("DOMContentLoaded", (e) => {
    refreshStudentSelect();
    refreshMatiereSelect();
});

//-------------------------------------------------------------------------------
const updateNotesTable = () => {
	const studentIndex = studentChoice.value; 
	const matiere = lessonfieldChoice.value; 

	const tableBody = document.getElementById("table-data");
	const averageGradeDiv = document.getElementById("average-grade");

	tableBody.innerHTML = "";
	averageGradeDiv.innerHTML = "";

	let allNotes = [];
	let totalNotes = 0;

	console.log(studentIndex);

	if (studentIndex === "") { //pas de student 
		if (matiere === "") {  // pas de student + pas de matière
			students.forEach((student) => {
				for (const [matiereKey, notes] of Object.entries(student.lessons)) {
					notes.forEach((note) => {
						allNotes.push({
							lastname: student.lastname,
							firstname: student.firstname,
							matiere: matiereKey,
							note,
						});
					});
				}
			});
		} else { //pas de student mais une matière
			students.forEach((student) => {
				const notes = student.lessons[matiere] || [];
				notes.forEach((note) => {
					allNotes.push({
						lastname: student.lastname,
						firstname: student.firstname,
						matiere,
						note,
					});
				});
			});
		}
	} else { // 1 student selectionné
		const studentIdx = parseInt(studentIndex);
        const selectedStudent = students[studentIdx];
        console.log("etudiant" +students[studentIdx].firstname);
        console.log("matière : " + matiere);
        console.log(typeof matiere);
        
        

        if (matiere === "0") {//1 student selectionné mais pas de matière
            console.log("pas de matières");
            
			for (const [matiereKey, notes] of Object.entries(
				selectedStudent.lessons
			)) {
				notes.forEach((note) => {
					allNotes.push({
						lastname: selectedStudent.lastname,
						firstname: selectedStudent.firstname,
						matiere: matiereKey,
						note,
					});
				});
			}
		} else { // 1 student et 1 matière
			const notes = selectedStudent.lessons[matiere] || [];
			notes.forEach((note) => {
				allNotes.push({
					lastname: selectedStudent.lastname,
					firstname: selectedStudent.firstname,
					matiere,
					note,
				});
			});
		}
	}

	allNotes.forEach((entry) => {
		const row = document.createElement("tr");
		row.innerHTML = `
            <td>${entry.lastname}</td>
            <td>${entry.firstname}</td>
            <td>${entry.matiere}</td>
            <td>${entry.note}</td>
        `;
		tableBody.appendChild(row);

		totalNotes += entry.note;
	});

	if (allNotes.length > 0) {
		const average = (totalNotes / allNotes.length).toFixed(2);
		averageGradeDiv.innerHTML = `Moyenne: ${average}`;
	}
};




studentChoice.addEventListener("change", updateNotesTable);
lessonfieldChoice.addEventListener("change", updateNotesTable);