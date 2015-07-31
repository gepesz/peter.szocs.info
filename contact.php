<?php

$errors = array(); // array to hold validation errors
$data   = array(); // array to pass back data

// locals
$name = $_POST['name'];
$email_address = $_POST['email'];
$phone = $_POST['phone'];
$message = $_POST['message'];

// sanity checks
if ( empty($name) ) {
     $errors['name'] = 'Name is required.';
}
if ( empty($email_address) ) {
     $errors['email'] = 'Email is required.';
}
if ( empty($phone) ) {
     $errors['phone'] = 'Phone is required.';
}
if ( empty($message) ) {
     $errors['message'] = 'Message is required.';
}

if ( empty($errors) ) {
     // send email
     $to = "gepesz@hotmail.com";
     $email_subject = "Website Contact From:  ".$name;
     $email_body = "New message arrived from http://peter.szocs.info.\n\n";
     $email_body .= "Name:  ".$name."\n\n";
     $email_body .= "Email: ".$email_address."\n\n";
     $email_body .= "Phone: ".$phone."\n\n";
     $email_body .= "Message:\n".$message;
     $headers = "From: noreply@peter.szocs.info\n";
     $headers .= "Reply-To: ".$email_address;
     $retval = mail($to, $email_subject, $email_body, $headers);
     
     // check for success
     if ( $retval == true ) {
          // success
          $data['success'] = true;
     } else {
          // failure
          $errors['mail'] = 'Message could not be sent.';
          $data['success'] = false;
          $data['errors']  = $errors;
     }
} else {
     // handle errors
     $data['success'] = false;
     $data['errors']  = $errors;     
}

// return data
echo json_encode($data);

?>