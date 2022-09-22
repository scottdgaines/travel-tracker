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
        
}

export default Trip;
