package com.romanmay7.travel_compass_worker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@EnableKafka
@SpringBootApplication
public class TravelCompassWorkerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TravelCompassWorkerApplication.class, args);
	}

}
