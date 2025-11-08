package com.roamrush.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
// --- THIS IS THE FIX ---
// Tell Spring to ONLY look for JPA Repositories in the 'user' package (and others we add)
@EnableJpaRepositories(basePackages = "com.roamrush.backend.user") 
// Tell Spring to ONLY look for Mongo Repositories in the 'social' package
@EnableMongoRepositories(basePackages = "com.roamrush.backend.social")
// --- END OF FIX ---
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

}