package com.roamrush.backend.features.auth.service;

public interface EmailService {
    void sendEmail(String to, String subject, String body);
}
