document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const newPatientForm = document.getElementById('new-patient-form');
    const patientContainers = document.getElementById('patient-containers');
    let token = localStorage.getItem('token');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(loginForm);
            const username = formData.get('username');
            const password = formData.get('password');

            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                token = data.token;
                localStorage.setItem('token', token);
                alert('Login successful');
                loadPatients();
                window.location.href = 'patients.html'; // Redirect to patients.html
            } else {
                alert('Login failed');
            }
        });
    }

    if (newPatientForm) {
        newPatientForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (!token) {
                alert('You must be logged in to perform this action');
                return;
            }
            const formData = new FormData(newPatientForm);
            const patientName = formData.get('patient-name').trim();
            const beforeImageFile = formData.get('before-image');

            formData.append('patientName', patientName); // Add patientName to form data

            const response = await fetch('/upload-before', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (response.ok) {
                alert('Before image uploaded successfully');
                loadPatients();
            } else {
                alert('Failed to upload before image');
            }
        });
    }

    const loadPatients = async () => {
        if (!token) {
            window.location.href = 'index.html'; // Redirect to login page if not authenticated
            return;
        }
        const response = await fetch('/patient-images', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const patients = await response.json();
        renderPatients(patients);
    };

    const renderPatients = (patients) => {
    patientContainers.innerHTML = '';
    const patientMap = {};

    // Group patients by name
    patients.forEach(patient => {
        if (!patientMap[patient.patientName]) {
            patientMap[patient.patientName] = {
                before: null,
                after: null,
                _id: patient._id
            };
        }
        if (patient.tag === 'before') {
            patientMap[patient.patientName].before = patient;
        } else {
            patientMap[patient.patientName].after = patient;
        }
    });

    Object.keys(patientMap).forEach(patientName => {
        const patient = patientMap[patientName];
        const container = document.createElement('div');
        container.classList.add('patient-container');

        // Create a clickable link with the patient's name
        const patientLink = document.createElement('a');
        patientLink.href = `${window.location.origin}/${patientName}`;
        patientLink.textContent = patientName;
        patientLink.classList.add('patient-link');

        // Add the link to the container instead of a separate h3
        container.appendChild(patientLink);

        const imagesDiv = document.createElement('div');
        imagesDiv.classList.add('patient-images');

        const beforeImg = document.createElement('img');
        beforeImg.src = patient.before ? patient.before.url : '';
        imagesDiv.appendChild(beforeImg);

        if (patient.after) {
            const afterImg = document.createElement('img');
            afterImg.src = patient.after.url;
            imagesDiv.appendChild(afterImg);
        } else {
            const uploadAfterDiv = document.createElement('div');
            uploadAfterDiv.classList.add('upload-after');

            const afterImgArea = document.createElement('div');
            afterImgArea.classList.add('img-area');
            afterImgArea.dataset.patientId = patient._id;
            afterImgArea.dataset.patientName = patientName;

            const icon = document.createElement('i');
            icon.classList.add('bx', 'bxs-cloud-upload', 'icon');
            afterImgArea.appendChild(icon);

            const afterText = document.createElement('p');
            afterText.textContent = 'Upload After Image';
            afterImgArea.appendChild(afterText);

            uploadAfterDiv.appendChild(afterImgArea);
            imagesDiv.appendChild(uploadAfterDiv);

            afterImgArea.addEventListener('click', () => {
                const patientId = afterImgArea.dataset.patientId;
                const patientName = afterImgArea.dataset.patientName; 
                const afterInputFile = document.createElement('input');
                afterInputFile.type = 'file';
                afterInputFile.accept = 'image/*';
                afterInputFile.style.display = 'none';
                afterInputFile.dataset.patientId = patientId;
                afterInputFile.dataset.patientName = patientName;
                afterInputFile.addEventListener('change', handleAfterImageUpload);
                document.body.appendChild(afterInputFile);
                afterInputFile.click();
            });
        }

        container.appendChild(imagesDiv);
        patientContainers.appendChild(container);
    });
};

    const handleAfterImageUpload = async function () {
        const image = this.files[0];
        const patientId = this.dataset.patientId;
        const patientName = this.dataset.patientName;

        if (image.size < 20000000) {
            const formData = new FormData();
            formData.append('after-image', image);
            formData.append('patientId', patientId);
            formData.append('patientName', patientName);

            const response = await fetch('/upload-after', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (response.ok) {
                alert('After image uploaded successfully');
                const patientUrl = `${window.location.origin}/${patientName}`;
                alert(`Patient's unique link: ${patientUrl}`);
                loadPatients();
            } else {
                alert('Failed to upload after image');
            }
        } else {
            alert("Image size more than 2MB");
        }

        this.remove();
    };

    // Initially load patients if logged in
    if (token) {
        loadPatients();
    }
    
    // New code for patient.html page
        const toggleButton = document.getElementById('toggle-button');
    const saveButton = document.getElementById('save');
    const sendButton = document.getElementById('send');
    const sendPopup = document.getElementById('send-popup');
    const closePopup = document.querySelector('.close');
    const sendConfirmButton = document.getElementById('send-confirm');
    const viewSwitch = document.getElementById('view-switch');
    const savePdfButton = document.getElementById('save-pdf');

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const beforeImage = document.getElementById('before-image');
            const afterImage = document.getElementById('after-image');

            if (afterImage.style.opacity === '0') {
                afterImage.style.opacity = '1';
                beforeImage.style.opacity = '0';
            } else {
                afterImage.style.opacity = '0';
                beforeImage.style.opacity = '1';
            }
        });

        const loadPatientImages = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const patientId = urlParams.get('id');
            const response = await fetch(`/patient-images?id=${patientId}`);
            const data = await response.json();

            document.getElementById('before-image').src = data.beforeImageUrl;
            document.getElementById('after-image').src = data.afterImageUrl;
            document.getElementById('side-before-image').src = data.beforeImageUrl;
            document.getElementById('side-after-image').src = data.afterImageUrl;
        };

        loadPatientImages();
    }

    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const image = document.querySelector('#after-image').src;
            const link = document.createElement('a');
            link.href = image;
            link.download = `after-image.jpg`;
            link.click();
        });
    }

    if (sendButton) {
        sendButton.addEventListener('click', () => {
            sendPopup.style.display = "block";
        });
    }

    if (closePopup) {
        closePopup.addEventListener('click', () => {
            sendPopup.style.display = "none";
        });
    }

    if (sendConfirmButton) {
        sendConfirmButton.addEventListener('click', async () => {
            const contactInfo = document.getElementById('contact-info').value;
            const image = document.querySelector('#after-image').src;

            const response = await fetch('/send-photo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contactInfo,
                    image,
                }),
            });

            if (response.ok) {
                alert('Photo sent successfully.');
            } else {
                alert('Failed to send photo.');
            }

            sendPopup.style.display = "none";
        });
    }

    if (viewSwitch) {
        viewSwitch.addEventListener('change', () => {
            const imageContainer = document.querySelector('.image-container');
            const sideBySideContainer = document.querySelector('.side-by-side-container');
            const toggleButton = document.getElementById('toggle-button');

            if (viewSwitch.checked) {
                imageContainer.style.display = 'none';
                sideBySideContainer.style.display = 'flex';
                toggleButton.style.display = 'none';
            } else {
                imageContainer.style.display = 'block';
                sideBySideContainer.style.display = 'none';
                toggleButton.style.display = 'inline-block';
            }
        });
    }

    if (savePdfButton) {
        savePdfButton.addEventListener('click', () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            const beforeImage = document.getElementById('side-before-image');
            const afterImage = document.getElementById('side-after-image');

            doc.text('Before and After Comparison', 105, 15, null, null, 'center');
            
            doc.addImage(beforeImage, 'JPEG', 10, 30, 90, 90);
            doc.addImage(afterImage, 'JPEG', 110, 30, 90, 90);

            doc.text('Before', 55, 130, null, null, 'center');
            doc.text('After', 155, 130, null, null, 'center');

            doc.save('before-after-comparison.pdf');
        });
    }
});
