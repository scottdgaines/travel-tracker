class Trip {
    constructor(tripID, travelerID, newTripData, destinationID, date) {
        this.id = tripID,
        this.userID = travelerID,
        this.destinationID = destinationID,
        this.travelers = newTripData.travelers,
        this.date = date,
        this.duration = newTripData.duration,
        this.status = 'pending',
        this.suggestedActivities = []
    };

    calculateCosts(destinations) {
        const destinationData = this.retrieveDestinationData(destinations);

        const lodgingPerDay = destinationData.estimatedLodgingCostPerDay;
        const flightPerPerson = destinationData.estimatedFlightCostPerPerson;

        const totalLodging = lodgingPerDay * this.duration;
        const totalFlights = flightPerPerson * this.travelers;

        const totalTrip = totalLodging + totalFlights;

        const agentFee = totalTrip * .10;

        return totalTrip + agentFee;
    }

    retrieveDestinationData(destinations) {
        return destinations.find(destination => {
            return destination.id === this.destinationID;
        });
    };
};

export default Trip;
