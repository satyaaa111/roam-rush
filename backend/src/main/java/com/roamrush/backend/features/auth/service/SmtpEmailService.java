package com.roamrush.backend.features.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.context.annotation.Primary;

@Service
@Primary
public class SmtpEmailService implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(SmtpEmailService.class);
    private final JavaMailSender mailSender;

    public SmtpEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Make it Async so the API returns immediately without waiting for SMTP
    @Async 
    @Override
    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("noreply@roamrush.com"); // Change this to your verified sender
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); // 'true' means HTML content

            mailSender.send(message);
            logger.info("Email sent successfully to {}", to);

        } catch (MessagingException e) {
            logger.error("Failed to send email to {}", to, e);
            // In a real app, you might want to queue this to retry later via Kafka/RabbitMQ
        }
    }
}