const mockPlan = {
    id: "mock-123",
    destination: "Paris, France",
    startDate: "2026-06-01",
    endDate: "2026-06-03",
    itinerary: [
        {
            dayNumber: 1,
            theme: "Historical Landmarks",
            activities: [
                {
                    time: "10:00 AM",
                    siteName: "Eiffel Tower",
                    description: "Experience the breathtaking views from the iron lattice tower. Built for the 1889 World's Fair, it has become the global cultural icon of France.",
                    coordinates: { lat: 48.8584, lng: 2.2945 },
                    category: "Sightseeing",
                    // Added multiple mock images for the gallery
                    imageUrls: [
                        "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800",
                        "https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&w=800",
                    ]
                },
                {
                    time: "02:00 PM",
                    siteName: "Louvre Museum",
                    description: "Explore the world's largest art museum, home to the Mona Lisa and thousands of historic masterpieces from antiquity to the 19th century.",
                    coordinates: { lat: 48.8606, lng: 2.3376 },
                    category: "Culture",
                    imageUrls: [
                        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800",
                    ]
                }
            ]
        },
        {
            dayNumber: 2,
            theme: "Art & Leisure",
            activities: [
                {
                    time: "11:00 AM",
                    siteName: "Montmartre",
                    description: "Wander through the cobblestone streets of the 18th arrondissement. Visit the Sacré-Cœur Basilica and enjoy the artistic vibe of Place du Tertre.",
                    coordinates: { lat: 48.8867, lng: 2.3431 },
                    category: "Adventure",
                    imageUrls: [
                        "https://images.unsplash.com/photo-1503917988258-f87a78e3c995?auto=format&fit=crop&w=800",
                    ]
                }
            ]
        }
    ]
};

const mockPlan2 = {
    id: "mock-tailand-789",
    destination: "Thailand (Bangkok, Chiang Mai, Phuket)",
    startDate: "2026-11-10",
    endDate: "2026-11-17",
    itinerary: [
        {
            dayNumber: 1,
            theme: "Bangkok: Royal Heritage",
            activities: [
                {
                    time: "09:00 AM",
                    siteName: "The Grand Palace",
                    description: "Marvel at the spectacular complex of buildings that has been the official residence of the Kings of Siam since 1782.",
                    coordinates: { lat: 13.7500, lng: 100.4913 },
                    category: "History",
                    imageUrls: [
                        "https://images.unsplash.com/photo-1528181304800-2f140819ad9c?auto=format&fit=crop&w=800",
                        "https://images.unsplash.com/photo-1590011855909-6447c433c267?auto=format&fit=crop&w=800",
                        "https://images.unsplash.com/photo-1584300063255-6677f985c692?auto=format&fit=crop&w=800"
                    ]
                },
                {
                    time: "02:00 PM",
                    siteName: "Wat Arun (Temple of Dawn)",
                    description: "A stunning riverside temple known for its towering spire decorated with porcelain.",
                    coordinates: { lat: 13.7437, lng: 100.4889 },
                    category: "Culture",
                    imageUrls: [
                        "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800",
                        "https://images.unsplash.com/photo-1543329064-16278893f41a?auto=format&fit=crop&w=800"
                    ]
                }
            ]
        },
        {
            dayNumber: 2,
            theme: "Bangkok: Local Flavors",
            activities: [
                {
                    time: "10:00 AM",
                    siteName: "Damnoen Saduak Floating Market",
                    description: "Experience the colorful bustle of vendor boats selling fresh fruits and local food.",
                    coordinates: { lat: 13.5188, lng: 99.9576 },
                    category: "Shopping",
                    imageUrls: [
                        "https://images.unsplash.com/photo-1546271876-af6caec5fae5?auto=format&fit=crop&w=800",
                        "https://images.unsplash.com/photo-1583344605934-934c2642a8b9?auto=format&fit=crop&w=800"
                    ]
                }
            ]
        },
        {
            dayNumber: 3,
            theme: "Chiang Mai: Ancient Temples",
            activities: [
                {
                    time: "04:00 PM",
                    siteName: "Wat Phra That Doi Suthep",
                    description: "A sacred mountaintop temple offering panoramic views of Chiang Mai city.",
                    coordinates: { lat: 18.8048, lng: 98.9219 },
                    category: "Spiritual",
                    imageUrls: [
                        "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=800",
                        "https://images.unsplash.com/photo-1582468546235-9bf31e5bc4a1?auto=format&fit=crop&w=800"
                    ]
                }
            ]
        },
        {
            dayNumber: 4,
            theme: "Chiang Mai: Elephant Sanctuary",
            activities: [
                {
                    time: "09:00 AM",
                    siteName: "Elephant Nature Park",
                    description: "A rehabilitation center for rescued elephants where you can feed and bathe these gentle giants.",
                    coordinates: { lat: 19.2154, lng: 98.8617 },
                    category: "Nature",
                    imageUrls: [
                        "https://images.unsplash.com/photo-1581012772111-370e4d0d046c?auto=format&fit=crop&w=800",
                        "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800",
                        "https://images.unsplash.com/photo-1516705649969-93e944747f3b?auto=format&fit=crop&w=800"
                    ]
                }
            ]
        },
        {
            dayNumber: 5,
            theme: "Phuket: Island Hopping",
            activities: [
                {
                    time: "08:30 AM",
                    siteName: "Phi Phi Islands",
                    description: "Speedboat tour to the famous Maya Bay and crystal clear snorkeling spots.",
                    coordinates: { lat: 7.7407, lng: 98.7784 },
                    category: "Beach",
                    imageUrls: [
                        "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800",
                        "https://images.unsplash.com/photo-1537953391147-f45e85b0d453?auto=format&fit=crop&w=800",
                        "https://images.unsplash.com/photo-1589394815804-964ed9be2eb3?auto=format&fit=crop&w=800"
                    ]
                }
            ]
        },
        {
            dayNumber: 6,
            theme: "Phuket: Cultural Landmarks",
            activities: [
                {
                    time: "10:30 AM",
                    siteName: "The Big Buddha",
                    description: "A 45-meter tall white marble statue sitting atop Nakkerd Hill.",
                    coordinates: { lat: 7.8277, lng: 98.3125 },
                    category: "Landmark",
                    imageUrls: [
                        "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800",
                        "https://images.unsplash.com/photo-1563492065-f6285e6e905d?auto=format&fit=crop&w=800"
                    ]
                }
            ]
        },
        {
            dayNumber: 7,
            theme: "Phuket: Relaxation",
            activities: [
                {
                    time: "12:00 PM",
                    siteName: "Patong Beach",
                    description: "Enjoy the sunset and farewell dinner at one of Phuket's most famous beaches.",
                    coordinates: { lat: 7.8921, lng: 98.2962 },
                    category: "Leisure",
                    imageUrls: [
                        "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800",
                        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800"
                    ]
                }
            ]
        }
    ]
};

export const simulateApiCall = (formData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                status: 202,
                data: { id: "mock-123" }
            });
        }, 1000);
    });
};

export const simulatePolling = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: mockPlan2 });
        }, 2000); // Faster polling for testing
    });
};