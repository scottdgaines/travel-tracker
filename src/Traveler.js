import Trip from '../src/Trip.js'

class Traveler {
    constructor(travelerData) {
        this.id = travelerData.id,
        this.name = travelerData.name,
        this.travelerType = travelerData.travelerType
    };

    returnCurrentDate() {
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');       
        const yyyy = today.getFullYear();

        today = yyyy + '/' + dd + '/' + mm;

        return today;
    };

    returnPreviousTrips(tripsData) {
        let currentDate = this.returnCurrentDate();
 
        return tripsData.filter(trip => {
            return trip.userID === this.id && trip.date <= currentDate;
        });
    };

    returnPendingTrips(tripsData) {
        return tripsData.filter(trip => {
            return trip.userID === this.id && trip.status === 'pending';
        });
    };

    returnUpcomingTrips(tripsData) {
        let currentDate = this.returnCurrentDate();

        return tripsData.filter(trip => {
            return trip.userID === this.id && trip.date >= currentDate;
        });
    };

    createNewTrip(trips, newTripData) {
        const tripID = trips.length + 1

        const newTrip = new Trip(tripID, this.id, newTripData);
        return newTrip;
    };
};

export default Traveler;