package com.roamrush.backend.social;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

// CHANGE <Object, String> TO <Post, String>
@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    // Now it's a real, valid repository
}