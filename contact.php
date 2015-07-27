<?php

$errors = array(); // array to hold validation errors
$data   = array(); // array to pass back data

// sanity checks
if ( empty($_POST['name']) ) {
     $errors['name'] = 'Name is required.';
}
if ( empty($_POST['email']) ) {
     $errors['email'] = 'Email is required.';
}
if ( empty($_POST['phone']) ) {
     $errors['phone'] = 'Phone is required.';
}
if ( empty($_POST['message']) ) {
     $errors['message'] = 'Message is required.';
}

if ( empty($errors) ) {
     // send email
     $to = "gepesz@hotmail.com";
     $email_subject = "Website Contact From:  ".$_POST['name'];
     $email_body = "New message arrived from http://peter.szocs.info.\n\n";
     $email_body .= "Name:  ".$_POST['name']."\n\n";
     $email_body .= "Email: ".$_POST['email']."\n\n";
     $email_body .= "Phone: ".$_POST['phone']."\n\n";
     $email_body .= "Message:\n".$_POST['message'];
     $headers = "From: noreply@peter.szocs.info\n";
     $headers .= "Reply-To: ".$_POST['email'];
     mail($to, $email_subject, $email_body, $headers);
     
     // return with success
     $data['success'] = true;
} else {
     // handle errors
     $data['success'] = false;
     $data['errors']  = $errors;     
}

// return data
echo json_encode($data);

?>