package com.roamrush.backend.features.auth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

// A simple mock for sending emails. Replace this with a real
// implementation using AWS SES, SendGrid, etc.
@Service
public class MockEmailService implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(MockEmailService.class);

    @Override
    public void sendEmail(String to, String subject, String body) {
        logger.info("=====================================");
        logger.info("Sending Email to: {}", to);
        logger.info("Subject: {}", subject);
        logger.info("Body: \n{}", body);
        logger.info("=====================================");
    }
}