// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB3yM94XYInt9mMMIlh-L_0yOP_oOZ8HKg",
    authDomain: "class-companion-platform.firebaseapp.com",
    projectId: "class-companion-platform",
    storageBucket: "class-companion-platform.appspot.com",
    messagingSenderId: "750536088298",
    appId: "1:750536088298:web:5a2e35a04b0888f7561593",
    measurementId: "G-WQRDHBV9M2"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Load timetable for hardcoded class 9A of Neerja Modi World School in India
document.addEventListener('DOMContentLoaded', function() {
    const schoolName = "Neerja Modi World School";
    const className = "8A";
    document.getElementById('class-name').textContent = className;
    loadTimetable(schoolName, className);
});

// Load timetable from Firebase
function loadTimetable(schoolName, className) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timetableBody = document.getElementById('timetableBody');

    db.collection('schools').doc(schoolName).collection('classes').doc(className).collection('timetable').get().then(querySnapshot => {
        let timetableData = {};

        querySnapshot.forEach(doc => {
            timetableData[doc.id] = doc.data();
        });

        for (let period = 1; period <= 11; period++) {
            let row = document.createElement('tr');
            let periodCell = document.createElement('td');
            periodCell.textContent = `${period}th Period`;
            row.appendChild(periodCell);

            days.forEach(day => {
                let cell = document.createElement('td');
                let periodData = timetableData[day] || {};
                let periodClasses = [
                    periodData[`period${period}.1`] || '-',
                    periodData[`period${period}.2`] || '-',
                    periodData[`period${period}.3`] || '-'
                ];
                cell.textContent = periodClasses.filter(p => p !== '-').join(' / ') || '-';
                row.appendChild(cell);
            });

            timetableBody.appendChild(row);
        }
    }).catch(error => {
        console.error('Error getting timetable:', error);
    });
}
