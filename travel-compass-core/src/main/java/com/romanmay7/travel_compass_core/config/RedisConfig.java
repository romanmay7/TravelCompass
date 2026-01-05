package com.romanmay7.travel_compass_core.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.romanmay7.travel_compass_core.model.TravelPlan; // Import YOUR local model
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

@Configuration
public class RedisConfig {

    @Bean
    public RedisCacheConfiguration cacheConfiguration() {
        // 1. Create the ObjectMapper and register the JavaTimeModule
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());

        // 2. IMPORTANT: Use Jackson2JsonRedisSerializer bound specifically to TravelPlan.class
        // This tells Jackson: "No matter what package name is in the JSON,
        // parse it into com.romanmay7.travel_compass_core.model.TravelPlan"
        Jackson2JsonRedisSerializer<TravelPlan> serializer = new Jackson2JsonRedisSerializer<>(mapper, TravelPlan.class);

        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(1))
                .disableCachingNullValues()
                // 3. Set the key and value serializers
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(serializer));
    }
}