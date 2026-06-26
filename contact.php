<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $to_email = "info@charmainflooring.com";
    $cc_email = "sales@charmainflooring.com";

    $name = htmlspecialchars(strip_tags(trim($_POST["name"] ?? "")));
    $email = filter_var(trim($_POST["email"] ?? ""), FILTER_SANITIZE_EMAIL);
    
    $country_code = htmlspecialchars(strip_tags(trim($_POST["country_code"] ?? "")));
    $phone_num = htmlspecialchars(strip_tags(trim($_POST["phone"] ?? "")));
    $phone = $country_code . " " . $phone_num;

    $collections_arr = $_POST["collections"] ?? [];
    if (!is_array($collections_arr)) {
        $collections_arr = [$collections_arr]; // fallback if it's a string
    }
    $collection = !empty($collections_arr[0]) ? htmlspecialchars(strip_tags(implode(", ", $collections_arr))) : "None selected";

    $design_code = htmlspecialchars(strip_tags(trim($_POST["design_code"] ?? "")));
    $designs = !empty($design_code) ? $design_code : "None selected";

    $thickness = htmlspecialchars(strip_tags(trim($_POST["thickness"] ?? "")));
    $thickness = !empty($thickness) ? $thickness : "N/A";

    $pattern = htmlspecialchars(strip_tags(trim($_POST["pattern"] ?? "")));
    $pattern = !empty($pattern) ? $pattern : "N/A";

    $message = htmlspecialchars(strip_tags(trim($_POST["message"] ?? "")));
    $message_out = !empty($message) ? $message : "N/A";

    if (empty($name) || empty($email) || empty($phone_num)) {
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

    $body = "Message\n";
    $body .= "Name: $name\n";
    $body .= "Phone: $phone\n";
    $body .= "Email: $email\n";
    $body .= "Collection: $collection\n";
    $body .= "Designs: $designs\n";
    $body .= "Thickness: $thickness\n";
    $body .= "Pattern: $pattern\n";
    $body .= "Message: $message_out\n";

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "From: Charmain Flooring <noreply@charmainflooring.com>\r\n";
    $headers .= "Reply-To: $name <$email>\r\n";
    $headers .= "Cc: $cc_email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    if (mail($to_email, $subject, $body, $headers, "-fnoreply@charmainflooring.com")) {
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