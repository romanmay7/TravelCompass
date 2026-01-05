package com.romanmay7.travel_compass_core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class TravelCompassCoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(TravelCompassCoreApplication.class, args);
	}

}
