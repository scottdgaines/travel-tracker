class Trip {
    constructor(tripID, travelerID, newTripData) {
        this.id = tripID,
        this.userID = travelerID,
        this.destinationID = newTripData.destinationName,
        this.travelers = newTripData.travelers,
        this.date = newTripData.date,
        this.duration = newTripData.duration,
        this.status = 'pending',
        this.suggestedActivities = []
    };

    findDestinationID(destinations, destinationName) {
        const destinationID = destinations.find(destination => {
            return destination.destination === destinationName
        });
        
        if (destinationID === undefined) {
            this.destinationID = null;
            return 'Something went wrong, please try again later';
        } else 
            return this.destinationID = destinationID.id;
        };

    retrieveDestinationData(destinations) {
        this.findDestinationID(destinations, this.destinationID)

        return destinations.find(destination => {
            return destination.id === this.destinationID
        }) 
    }

    calculateCosts(destinations) {
        const destinationData = this.retrieveDestinationData(destinations)

        const lodgingPerDay = destinationData.estimatedLodgingCostPerDay;
        const flightPerPerson = destinationData.estimatedFlightCostPerPerson;

        const totalLodging = lodgingPerDay * this.duration
        const totalFlights = flightPerPerson * this.travelers

        const totalTrip = totalLodging + totalFlights

        const agentFee = totalTrip * .10

        return `$${totalTrip + agentFee}`

    }
        
}

export default Trip;
