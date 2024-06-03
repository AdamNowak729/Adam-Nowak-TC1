document.addEventListener('DOMContentLoaded', function() {
    fetchCities();
    fetchContacts();

    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault();
        submitContactForm();
    });
});

function showAlert(message, type) {
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
        `   ${message}`,
        '   <button type="button" class="close" data-dismiss="alert" aria-label="Close">',
        '       <span aria-hidden="true">&times;</span>',
        '   </button>',
        '</div>'
    ].join('');

    alertPlaceholder.append(wrapper);
}

function fetchCities() {
    fetch('api.php?action=fetchCities')
        .then(response => response.json())
        .then(data => {
            const citySelect = document.getElementById('city');
            data.forEach(city => {
                let option = new Option(city.name, city.id);
                citySelect.add(option);
            });
        });
}

function fetchContacts() {
    fetch('api.php?action=fetchAllContacts')
        .then(response => response.json())
        .then(data => {
            const contactList = document.getElementById('contactList');
            contactList.innerHTML = ''; // Clear the list before appending
            data.forEach(contact => {
                let row = contactList.insertRow();
                row.innerHTML = `<td>${contact.name}</td>
                                 <td>${contact.first_name}</td>
                                 <td>${contact.email}</td>
                                 <td>${contact.street}</td>
                                 <td>${contact.zip_code}</td>
                                 <td>${contact.city_name}</td>
                                 <td>
                                     <button class='btn btn-primary btn-sm' onclick='setFormData(${JSON.stringify(contact)})'>Edit</button>
                                     <button class='btn btn-danger btn-sm' onclick='deleteContact(${contact.id})'>Delete</button>
                                 </td>`;
            });
        });
}

function setFormData(contact) {
    document.getElementById('contactId').value = contact.id;
    document.getElementById('name').value = contact.name;
    document.getElementById('first_name').value = contact.first_name;
    document.getElementById('email').value = contact.email;
    document.getElementById('street').value = contact.street;
    document.getElementById('zip_code').value = contact.zip_code;
    document.getElementById('city').value = contact.city_id; // Make sure city IDs match
}

function submitContactForm() {
    const formData = new FormData(document.getElementById('contactForm'));
    const action = formData.get('id') ? 'updateContact' : 'addContact';
    formData.append('action', action); // Determine if adding or updating based on the presence of an ID
    fetch('api.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        fetchContacts(); // Refresh the contact list
        clearForm();
        showAlertalert("Contact updated successfully!", 'success');
    })
    .catch((error) => {
        console.error('Error:', error);
        showAlert('Error: ' + error.message, 'danger');
    });
}

function deleteContact(id) {
    if(confirm('Are you sure you want to delete this contact?')) {
        fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=deleteContact&id=${id}`
        })
        .then(response => response.json())
        .then(data => {
            if(data == 1) {
                showAlert('Contact deleted successfully!', 'success');
                fetchContacts(); // Refresh the contact list
            } else {
                showAlert('Failed to delete contact.', 'danger');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('Error deleting contact.', 'danger');
        });
    }
}

function fetchCities() {
    fetch('api.php?action=fetchCities')
        .then(response => response.json())
        .then(data => {
            const citySelect = document.getElementById('city');
            citySelect.innerHTML = ''; // Clear existing options
            data.forEach(city => {
                let option = new Option(city.name, city.id);
                citySelect.add(option);
            });
        })
        .catch(error => console.error('Error fetching cities:', error));
}

function clearForm() {
    document.getElementById('contactForm').reset();
}

function submitContactForm() {
    if (!document.getElementById('contactForm').checkValidity()) {
        showAlert("Please fill out all required fields correctly.", 'danger');
        return;
    }

    const formData = new FormData(document.getElementById('contactForm'));
    formData.append('action', 'addContact'); // Append action for PHP switch case
    fetch('api.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if(data.error) {
            throw new Error(data.message);
        }
        console.log('Success:', data);
        fetchContacts(); // Refresh the contact list
        clearForm(); // Clear the form after successful submission
        showAlert("Contact added successfully!", 'success');
    })
    .catch((error) => {
        console.error('Error:', error);
        showAlert('Error: ' + error.message, 'danger');
    });
}

function exportData(format) {
    if (format === 'xml') {
        window.open('api.php?action=exportXML', '_blank');
    } else if (format === 'json') {
        window.open('api.php?action=exportJSON', '_blank');
    }
}
