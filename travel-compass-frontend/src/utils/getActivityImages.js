// A utility function to get all available images for an activity
export const getActivityImages = (activity) => {
    const PROXY_URL = "http://localhost:8080/api/photos";

    // 1. If we have mock URLs, use them
    if (activity.imageUrls && activity.imageUrls.length > 0) {
        return activity.imageUrls;
    }

    // 2. If we have Google references, transform them into proxy URLs
    if (activity.photoReferences && activity.photoReferences.length > 0) {
        return activity.photoReferences.map(ref => `${PROXY_URL}?photoReference=${ref}`);
    }

    // 3. Fallback
    return ["https://via.placeholder.com/400x200?text=No+Photo+Available"];
};