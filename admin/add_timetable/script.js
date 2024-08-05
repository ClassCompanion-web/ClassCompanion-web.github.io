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
var db = firebase.firestore();

// Check if the user is logged in and has the appropriate role
document.addEventListener('DOMContentLoaded', function() {
    const role = localStorage.getItem('role');
    if (role !== 'admin' && role !== 'volunteer') {
        alert('Access denied!');
        window.location.href = '/admin_login'; // Redirect to the login page if not authorized
    }
});

// Populate the country dropdown
const countryDropdown = document.getElementById('country');
const countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor (Timor-Leste)", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Sudan, South", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];
countries.forEach(country => {
    let option = document.createElement('option');
    option.value = country;
    option.text = country;
    countryDropdown.add(option);
});

// Event listener for country dropdown
countryDropdown.addEventListener('change', function() {
    const schoolDropdown = document.getElementById('school');
    schoolDropdown.disabled = true;
    schoolDropdown.innerHTML = '<option value="">Select School</option>';
    
    if (this.value) {
        db.collection('schools').where('country', '==', this.value).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                let option = document.createElement('option');
                option.value = doc.id;
                option.text = doc.id;
                schoolDropdown.add(option);
            });
            schoolDropdown.disabled = false;
            document.querySelector('label[for="school"]').classList.remove('disabled');
        });
    }
});

// Event listener for school dropdown
document.getElementById('school').addEventListener('change', function() {
    const classDropdown = document.getElementById('class');
    classDropdown.disabled = true;
    classDropdown.innerHTML = '<option value="">Select Class</option>';
    
    if (this.value) {
        db.collection('schools').doc(this.value).collection('classes').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                let option = document.createElement('option');
                option.value = doc.id;
                option.text = doc.id;
                classDropdown.add(option);
            });
            classDropdown.disabled = false;
            document.querySelector('label[for="class"]').classList.remove('disabled');
        });
    }
});

// Event listener for class dropdown
document.getElementById('class').addEventListener('change', function() {
    const timetableContainer = document.getElementById('timetableContainer');
    timetableContainer.classList.remove('hidden');
    document.querySelector('.submit-button').disabled = false;
});

// Subjects array
const subjects = ["-", "International Mathematics", "Additional Mathematics", "English Language", "English Literature", "French", "Hindi", "Computer Science", "ICT", "Physics", "Chemistry", "Biology", "Global Perspectives", "Geography", "History", "Business Studies", "Economics", "General Knowledge", "Library", "Games", "Visual Arts", "Test", "Mathematics", "English", "Technology", "Art", "Yoga", "DIV"];

// Populate timetable
const timetableBody = document.getElementById('timetableBody');

for (let period = 1; period <= 11; period++) {
    let row = document.createElement('tr');
    let periodCell = document.createElement('td');
    periodCell.textContent = `${period}th`;
    row.appendChild(periodCell);

    for (let day = 1; day <= 6; day++) {
        let cell = document.createElement('td');
        for (let classNum = 1; classNum <= 3; classNum++) {
            let select = document.createElement('select');
            select.classList.add(`period${period}-${classNum}`, `day${day}`);
            subjects.forEach(subject => {
                let option = document.createElement('option');
                option.value = subject;
                option.text = subject;
                select.add(option);
            });
            cell.appendChild(select);
        }
        row.appendChild(cell);
    }
    timetableBody.appendChild(row);
}

// Form submission
document.getElementById('addTimetableForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const country = document.getElementById('country').value;
    const school = document.getElementById('school').value;
    const classId = document.getElementById('class').value;

    if (!country || !school || !classId) {
        alert('Please fill all fields');
        return;
    }

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let timetableData = {};

    days.forEach((day, dayIndex) => {
        let dayData = {};
        for (let period = 1; period <= 11; period++) {
            for (let classNum = 1; classNum <= 3; classNum++) {
                let subject = document.querySelector(`.period${period}-${classNum}.day${dayIndex + 1}`).value;
                dayData[`period${period}.${classNum}`] = subject;
            }
        }
        timetableData[day] = dayData;
    });

    const classDocRef = db.collection('schools').doc(school).collection('classes').doc(classId);

    Promise.all(days.map(day => classDocRef.collection('timetable').doc(day).set(timetableData[day])))
        .then(() => {
            alert('Timetable successfully added!');
        })
        .catch(error => {
            console.error('Error writing document: ', error);
        });
});
