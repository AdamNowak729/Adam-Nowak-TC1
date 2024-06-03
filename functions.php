<?php
    include 'config.php';

    // Fetch all contacts
    function getAllContacts() {
        global $conn;
        $sql = "SELECT c.*, ct.name as city_name FROM contacts c JOIN cities ct ON c.city_id = ct.id";
        $result = $conn->query($sql);
        $contacts = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $contacts[] = $row;
            }
        }
        return $contacts;
    }

    // Add a new contact
    function addContact($name, $first_name, $email, $street, $zip_code, $city_id) {
        global $conn;
        $sql = $conn->prepare("INSERT INTO contacts (name, first_name, email, street, zip_code, city_id) VALUES (?, ?, ?, ?, ?, ?)");
        $sql->bind_param("sssssi", $name, $first_name, $email, $street, $zip_code, $city_id);
        $sql->execute();
        return $sql->insert_id; // Return the id of the inserted record
    }

    // Update an existing contact
    function updateContact($id, $name, $first_name, $email, $street, $zip_code, $city_id) {
        global $conn;
        $sql = $conn->prepare("UPDATE contacts SET name=?, first_name=?, email=?, street=?, zip_code=?, city_id=? WHERE id=?");
        $sql->bind_param("sssssii", $name, $first_name, $email, $street, $zip_code, $city_id, $id);
        $sql->execute();
        return $sql->affected_rows; // Return the number of affected rows
    }

    // Delete a contact
    function deleteContact($id) {
        global $conn;
        $sql = $conn->prepare("DELETE FROM contacts WHERE id=?");
        $sql->bind_param("i", $id);
        $sql->execute();
        return $sql->affected_rows; // Return the number of affected rows
    }

    // Export contacts to XML
    function exportContactsXML() {
        $contacts = getAllContacts();
        $xml = new SimpleXMLElement('<contacts/>');
        foreach ($contacts as $contact) {
            $xml_contact = $xml->addChild('contact');
            foreach ($contact as $key => $value) {
                $xml_contact->addChild($key, $value);
            }
        }
         // Set headers to force download
        header('Content-Disposition: attachment; filename="contacts.xml"');
        header('Content-Type: application/xml');
        echo $xml->asXML();
    }

    // Export contacts to JSON
    function exportContactsJSON() {
        $contacts = getAllContacts();
        // Set headers to force download
        header('Content-Disposition: attachment; filename="contacts.json"');
        header('Content-Type: application/json');
        echo json_encode($contacts);
    }

    // Fetch all cities
    function getAllCities() {
        global $conn;
        $sql = "SELECT id, name FROM cities ORDER BY name ASC";
        $result = $conn->query($sql);
        $cities = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $cities[] = $row;
            }
        }
        return $cities;
    }
?>
