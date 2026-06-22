<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $to_email = "info@charmainflooring.com";
    $cc_email = "sales@charmainflooring.com";

    $name = htmlspecialchars(strip_tags(trim($_POST["name"] ?? "")));
    $email = filter_var(trim($_POST["email"] ?? ""), FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(strip_tags(trim($_POST["phone"] ?? "")));
    $message = htmlspecialchars(strip_tags(trim($_POST["message"] ?? "")));
    $service = htmlspecialchars(strip_tags(trim($_POST["service"] ?? "")));

    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Please fill in all required fields."]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid email address."]);
        exit;
    }

    $subject = "New Enquiry from Charmain Flooring Website — $name";

    $body = "You have received a new message from your website contact form.\n\n";
    $body .= "Name:    $name\n";
    $body .= "Email:   $email\n";
    $body .= "Phone:   $phone\n";
    $body .= "Service: $service\n\n";
    $body .= "Message:\n$message\n";

    $headers = "From: noreply@charmainflooring.com\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Cc: $cc_email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    if (mail($to_email, $subject, $body, $headers)) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Thank you! We'll be in touch shortly."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Something went wrong. Please call us directly."]);
    }

} else {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Forbidden."]);
}
?>