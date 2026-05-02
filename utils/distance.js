const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R  = 6371; // Radius of the Earth in kilometers
    const phi1 = lat1 * Math.PI / 180; // Convert latitude to radians
    const phi2 = lat2 * Math.PI / 180; // Convert latitude to radians
    const lambda1 = lon1 * Math.PI / 180; // Convert longitude to radians
    const lambda2 = lon2 * Math.PI / 180; // Convert longitude to radians
    const deltaPhi = phi2 - phi1; // Difference in latitude
    const deltaLambda = lambda2 - lambda1; // Difference in longitude

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
}
module.exports = { calculateDistance };