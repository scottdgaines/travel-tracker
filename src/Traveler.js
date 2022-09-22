import Trip from '../src/Trip.js'

class Traveler {
    constructor(travelerData) {
        this.id = travelerData.id,
        this.name = travelerData.name,
        this.travelerType = travelerData.travelerType
    }

    returnPreviousTrips(pastTripsData) {
        return pastTripsData.filter(trip => {
            return trip.userID === this.id
        })
    }

    createNewTrip(newTripData) {
        const newTrip = new Trip(this.id, newTripData)
        return newTrip
    }
}

export default Traveler;