package com.roamrush.backend.features.auth.service;

public class EmailTemplate {

    public static String getOtpEmail(String name, String otp) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff; }
                    .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0; }
                    .header h1 { color: #2563EB; margin: 0; }
                    .content { padding: 30px 20px; text-align: center; }
                    .otp-box { background-color: #f3f4f6; border-radius: 8px; padding: 15px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937; display: inline-block; margin: 20px 0; }
                    .footer { margin-top: 30px; font-size: 12px; text-align: center; color: #9ca3af; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Roam Rush</h1>
                    </div>
                    <div class="content">
                        <p>Hello %s,</p>
                        <p>Please use the following verification code to complete your login or registration:</p>
                        
                        <div class="otp-box">%s</div>
                        
                        <p>This code is valid for 10 minutes.</p>
                        <p>If you did not request this code, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        &copy; 2025 Roam Rush. All rights reserved.
                    </div>
                </div>
            </body>
            </html>
            """.formatted(name, otp);
    }
}