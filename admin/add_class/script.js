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
    if (role !== 'admin') {
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
    const gradeDropdown = document.getElementById('grade');
    gradeDropdown.disabled = !this.value;
    document.querySelector('label[for="grade"]').classList.toggle('disabled', !this.value);
});

// Event listener for grade dropdown
document.getElementById('grade').addEventListener('change', function() {
    const sectionInput = document.getElementById('section');
    sectionInput.disabled = !this.value;
    document.querySelector('label[for="section"]').classList.toggle('disabled', !this.value);
});

// Event listener for section input
document.getElementById('section').addEventListener('input', function() {
    const submitButton = document.querySelector('.submit-button');
    submitButton.disabled = !this.value;
});

// Form submission
document.getElementById('addClassForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const country = document.getElementById('country').value;
    const school = document.getElementById('school').value;
    const grade = document.getElementById('grade').value;
    const section = document.getElementById('section').value;

    if (!country || !school || !grade || !section) {
        alert('Please fill all fields');
        return;
    }

    const classId = grade + section;
    const classData = {
        grade: grade,
        section: section
    };

    const classDocRef = db.collection('schools').doc(school).collection('classes').doc(classId);

    classDocRef.set(classData).then(() => {
        const collections = ['students', 'assignments', 'tests', 'notes', 'timetable'];

        // Create placeholder documents in each collection
        const placeholderDocument = { createdAt: new Date() };
        const promises = collections.map(collection => {
            return classDocRef.collection(collection).doc('placeholder').set(placeholderDocument);
        });

        Promise.all(promises).then(() => {
            alert('Class added successfully!');
            document.getElementById('addClassForm').reset();
            document.querySelector('.submit-button').disabled = true;
        }).catch(error => {
            console.error('Error adding placeholder documents: ', error);
            alert('Failed to add class.');
        });
    }).catch(error => {
        console.error('Error adding class: ', error);
        alert('Failed to add class.');
    });
});