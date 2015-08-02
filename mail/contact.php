<?php

$errors = array(); // array to hold validation errors
$data   = array(); // array to pass back data

// locals
//$name = $_POST['name'];
//$email_address = $_POST['email'];
//$phone = $_POST['phone'];
//$message = $_POST['message'];

$name = "John Smith";
$email_address = "somebody@gmail.com";
$phone = "123-456-7890";
$message = "Hi Peter,\n\nGood looking website!  I was wondering if I could grab a copy of your resume perhaps?  Please send me a copy.\n\nThanks,\nJohn";

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
     $email_subject = "Contact from your website!";
     $message = str_replace(array("\r\n", "\r", "\n"), "<br/>", $message);
     $email_body = file_get_contents("email_template.html");
     $email_body = str_replace("__DATE__", date("F j"), $email_body);
     $email_body = str_replace("__NAME__", $name, $email_body);
     $email_body = str_replace("__EMAIL__", $email_address, $email_body);
     $email_body = str_replace("__PHONE__", $phone, $email_body);
     $email_body = str_replace("__MESSAGE__", $message, $email_body);
     $headers = "MIME-Version: 1.0\r\n";
     $headers .= "Content-Type: text/html; charset=UTF-8\r\n";     
     $headers .= "From: ".$name." <".$email_address.">\n";
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
