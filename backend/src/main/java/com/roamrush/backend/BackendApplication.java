package com.roamrush.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
// import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import com.roamrush.backend.config.JwtConfig;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
@EnableConfigurationProperties(JwtConfig.class)
// @EnableJpaRepositories(basePackages = "com.roamrush.backend.user")
@EnableJpaRepositories("com.roamrush.backend.features")  
// @EnableMongoRepositories(basePackages = "com.roamrush.backend.social")
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

}