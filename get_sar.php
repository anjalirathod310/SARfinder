<?php
// get_sar.php

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Include database configuration
    include 'db_config.php';

    // Retrieve and sanitize user input
    $frequency_input = isset($_POST['frequency']) ? $_POST['frequency'] : '';
    $tumor_status = isset($_POST['tumor_status']) ? $_POST['tumor_status'] : '';

    // Validate and round frequency to one decimal place
    if (is_numeric($frequency_input)) {
        $frequency = round(floatval($frequency_input), 1);
    } else {
        echo json_encode(['error' => 'Invalid frequency input.']);
        exit;
    }

    // Validate frequency
    if ($frequency < 1 || $frequency > 6) {
        echo json_encode(['error' => 'Frequency must be between 1 and 6 GHz.']);
        exit;
    }

    // Determine which columns to select based on tumor status
    if ($tumor_status === 'with') {
        $se_column = 'se_wt';
        $sar_column = 'sar_wt';
    } elseif ($tumor_status === 'without') {
        $se_column = 'se_wot';
        $sar_column = 'sar_wot';
    } else {
        echo json_encode(['error' => 'Invalid tumor status selected.']);
        exit;
    }

    // Prepare the SQL statement with frequency rounded to one decimal
    $stmt = $conn->prepare("SELECT $se_column, $sar_column FROM sar_data_base WHERE frequency = ?");

    if (!$stmt) {
        echo json_encode(['error' => 'Database query preparation failed.']);
        exit;
    }

    // Bind the frequency parameter as a string to ensure precise matching
    $frequency_str = number_format($frequency, 1, '.', '');
    $stmt->bind_param("s", $frequency_str);

    // Execute the query
    $stmt->execute();
    $stmt->bind_result($se, $sar);

    if ($stmt->fetch()) {
        // Format SE and SAR to four decimal places
        $se = number_format((float)$se, 4, '.', '');
        $sar = number_format((float)$sar, 4, '.', '');
        echo json_encode(['se' => $se, 'sar' => $sar]);
    } else {
        echo json_encode(['error' => 'No data found for the entered frequency.']);
    }

    // Close connections
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
