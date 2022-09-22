import Trip from '../src/Trip.js'

class Traveler {
    constructor(travelerData) {
        this.id = travelerData.id,
        this.name = travelerData.name,
        this.travelerType = travelerData.travelerType
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

    createNewTrip(trips, destinations, newTripData) {
        const tripID = this.generateTripID(trips)
        const destinationID = this.updateDestinationID(destinations, newTripData)

        const newTrip = new Trip(tripID, this.id, newTripData, destinationID);

        return newTrip
    };

    calculateTotalSpent(trips, destinations) {
        const previousTrips = this.returnPreviousTrips(trips);

    }

    //Helper Functions
    returnCurrentDate() {
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');       
        const yyyy = today.getFullYear();

        today = yyyy + '/' + dd + '/' + mm;

        return today;
    };

    generateTripID(trips) {
        return trips.length + 1
    };

    updateDestinationID(destinations, newTripData) {
        const destinationID = destinations.find(destination => {
            return destination.destination === newTripData.destinationName
        });
        
        if (destinationID === undefined) {
            this.destinationID = null;
            return 'Something went wrong, please try again later';
        } else {
            return this.destinationID = destinationID.id;
        };
    }
};

export default Traveler;