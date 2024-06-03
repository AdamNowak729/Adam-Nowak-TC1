<?php
    include 'functions.php';

    // Determine the type of request and call the appropriate function from functions.php
    $action = $_GET['action'] ?? $_POST['action'] ?? '';

    switch ($action) {
        case 'fetchCities':
            // Function to fetch cities goes here
            echo json_encode(getAllCities());
            break;
        case 'fetchAllContacts':
            echo json_encode(getAllContacts());
            break;
        case 'addContact':
            // Expects POST data
            echo json_encode(addContact($_POST['name'], $_POST['first_name'], $_POST['email'], $_POST['street'], $_POST['zip_code'], $_POST['city_id']));
            break;
        case 'updateContact':
            // Expects POST data
            echo json_encode(updateContact($_POST['id'], $_POST['name'], $_POST['first_name'], $_POST['email'], $_POST['street'], $_POST['zip_code'], $_POST['city_id']));
            break;
        case 'deleteContact':
            // Expects POST data
            echo json_encode(deleteContact($_POST['id']));
            break;
        case 'exportXML':
            exportContactsXML();
            break;
        case 'exportJSON':
            exportContactsJSON();
            break;
        default:
            echo json_encode(["error" => "No action specified"]);
    }
?>
