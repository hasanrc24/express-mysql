module.exports = verificationEmail = (user, url, code) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        .email-container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #dddddd;
        }
        .email-header img {
            max-width: 150px;
        }
        .email-body {
            padding: 20px;
            color: #333333;
            line-height: 1.6;
        }
        .email-body h1 {
            font-size: 24px;
            margin-bottom: 20px;
            color: #333333;
        }
        .email-body p {
            font-size: 16px;
            margin-bottom: 20px;
        }
        .reset-button {
            display: block;
            width: 200px;
            margin: 0 auto;
            padding: 15px;
            background-color: #28a745;
            color: #ffffff;
            text-align: center;
            border-radius: 5px;
            text-decoration: none;
            font-size: 18px;
        }
        .reset-button:hover {
            background-color: #218838;
        }
        .email-footer {
            margin-top: 30px;
            text-align: center;
            color: #777777;
            font-size: 14px;
        }
        .email-footer p {
            margin: 5px 0;
        }
        @media screen and (max-width: 600px) {
            .email-container {
                width: 100%;
                padding: 10px;
            }
            .reset-button {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <img src="https://via.placeholder.com/150x50?text=Your+Logo" alt="Your Logo">
        </div>
        <div class="email-body">
            <h1>Verify your account</h1>
            <p>Hello, ${user.firstName} ${user.lastName}</p>
            <a href="${url}api/v1/user/verify/${code}" >${url}api/v1/user/verify/${code}</a>
            <p>Click the button below to verify your account:</p>
            <a href="${url}api/v1/user/verify/${code}" class="reset-button">Verify</a>
            <p>If you didn't request this, please ignore this email or contact support if you have questions.</p>
            <p>Thank you,<br>Your Company Team</p>
        </div>
        <div class="email-footer">
            <p>© 2024 Your Company. All rights reserved.</p>
            <p><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
        </div>
    </div>
</body>
</html>
`
}