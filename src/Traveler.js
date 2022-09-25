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
            return trip.userID === this.id && trip.date < currentDate;
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

    returnTripsPerYear(tripsData) {
        let currentYear = String(new Date().getFullYear());

        return tripsData.filter(trip => {
            return trip.date.slice(0, 4) === currentYear && trip.userID === this.id;
        });
    };

    createNewTrip(trips, destinations, newTripData) {
        const reformattedDate = this.reformatDate(newTripData);
        const tripID = this.generateTripID(trips);
        const destinationID = this.updateDestinationID(destinations, newTripData);
        const newTrip = new Trip(tripID, this.id, newTripData, destinationID, reformattedDate);

        return newTrip;
    };

    returnDestinationData(trips, destinations) {
        const destinationIDs = this.returnDestinationID(trips)
        let destinationDataSets = []
    
        const destinationData =  destinationIDs.forEach(id => {
            let data = this.retrieveDestinationData(destinations, id)
            destinationDataSets.push(data)
            })
    
        return destinationDataSets
    }

    calculateTotalSpent(trips, destinations) {
        const yearsTrips = this.returnTripsPerYear(trips);

        const tripTotals = yearsTrips.map(trip => {
            return this.calculateCostsPerTrip(destinations, trip);
        });

        return tripTotals.reduce((acc, total) => {
            return acc += total;
        }, 0);
    };

    //Helper Functions
    returnCurrentDate() {
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');       
        const yyyy = today.getFullYear();

        today = yyyy + '/' + mm + '/' + dd;

        return today;
    };

    generateTripID(trips) {
        return trips.length + 1;
    };

    returnDestinationID(trips) {
        return trips.map(trip => {
            return trip.destinationID
        })
    }

    updateDestinationID(destinations, newTripData) {
        const destinationID = destinations.find(destination => {
            return destination.destination === newTripData.destinationName;
        });
        
        if (destinationID === undefined) {
            alert('Something went wrong, please try again later');
            return this.destinationID = null; 
        } else {
            return this.destinationID = destinationID.id;
        };
    };

    calculateCostsPerTrip(destinations, trip) {
        const destinationData = this.retrieveDestinationData(destinations, trip.destinationID);
       
        const lodgingPerDay = destinationData.estimatedLodgingCostPerDay;
        const flightPerPerson = destinationData.estimatedFlightCostPerPerson;

        const totalLodging = lodgingPerDay * trip.duration;
        const totalFlights = flightPerPerson * trip.travelers;

        const totalTrip = totalLodging + totalFlights;
        const agentFee = totalTrip * .10;
        
        return totalTrip + agentFee;
    };

    retrieveDestinationData(destinations, destinationID) {
        return destinations.find(destination => {
            return destination.id === destinationID;
        });
    };

    reformatDate(newTripData) {
        const reformattedDate = newTripData.date.split('-')
        .join('/')

        console.log('newDate', reformattedDate)

        return reformattedDate
    }
};

export default Traveler;