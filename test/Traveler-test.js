import { expect } from 'chai';
import Traveler from '../src/Traveler.js'

describe('Traveler', () => {
    let traveler1;
    let newTripInputValues1;
    let newTripInputValues2;
    let trip1;
    let trips;
    let traveler1PreviousTrips;
    let traveler1PendingTrips;
    let traveler1UpcomingTrips;
    let destinations;

    beforeEach(() => {
        traveler1 = new Traveler({
            id: 5,
            name: 'John Doe',
            travelerType: 'Thrill-seeker'
        });

        newTripInputValues1 = {
            destinationName: 'Lima, Peru',
            travelers: 1,
            date: '2022-09-16',
            duration: 8
        };

        newTripInputValues2 = {
            destinationName: 'Stockholm, Sweden',
            travelers: 1,
            date: '2022/09/16',
            duration: 8
        };

        trip1 = {
            id: 6,
            userID: 5,
            destinationID: 10,
            travelers: 1,
            date: '2022/09/16',
            duration: 8,
            status: 'pending',
            suggestedActivities: []
        }

        trips = [{
            id: 1,
            userID: 5,
            destinationID: 25,
            travelers: 5,
            date: "2023/10/04",
            duration: 18,
            status: "pending",
            suggestedActivities: [ ]
        },
        {   id: 2,
            userID: 5,
            destinationID: 49,
            travelers: 1,
            date: "2022/09/16",
            duration: 8,
            status: "approved",
            suggestedActivities: [ ]
        },
        {
            id: 3,
            userID: 3,
            destinationID: 22,
            travelers: 4,
            date: "2022/05/22",
            duration: 17,
            status: "approved",
            suggestedActivities: [ ]
        },
        {   id: 4,
            userID: 5,
            destinationID: 14,
            travelers: 2,
            date: "2022/02/25",
            duration: 10,
            status: "approved",
            suggestedActivities: [ ]
        },
        {
            id: 5,
            userID: 5,
            destinationID: 29,
            travelers: 3,
            date: "2023/04/30",
            duration: 18,
            status: "approved",
            suggestedActivities: [ ]
            }];

        traveler1PreviousTrips = [{   
            id: 2,
            userID: 5,
            destinationID: 49,
            travelers: 1,
            date: "2022/09/16",
            duration: 8,
            status: "approved",
            suggestedActivities: [ ]
        },
        {   id: 4,
            userID: 5,
            destinationID: 14,
            travelers: 2,
            date: "2022/02/25",
            duration: 10,
            status: "approved",
            suggestedActivities: [ ]
        }];

        traveler1PendingTrips = [{
            id: 1,
            userID: 5,
            destinationID: 25,
            travelers: 5,
            date: "2023/10/04",
            duration: 18,
            status: "pending",
            suggestedActivities: [ ]
        }];

        traveler1UpcomingTrips = [{
            id: 1,
            userID: 5,
            destinationID: 25,
            travelers: 5,
            date: "2023/10/04",
            duration: 18,
            status: "pending",
            suggestedActivities: [ ]
        },
        {   id: 5,
            userID: 5,
            destinationID: 29,
            travelers: 3,
            date: "2023/04/30",
            duration: 18,
            status: "approved",
            suggestedActivities: [ ]
        }];

        destinations = [{
            id: 10,
            destination: "Lima, Peru",
            estimatedLodgingCostPerDay: 70,
            estimatedFlightCostPerPerson: 400
            },
            {
            id: 20,
            destination: "Stockholm, Sweden",
            estimatedLodgingCostPerDay: 100,
            estimatedFlightCostPerPerson: 780
        },
        {
            id: 49,
            destination: "Sydney, Austrailia",
            estimatedLodgingCostPerDay: 130,
            estimatedFlightCostPerPerson: 950
        },
        {
            id: 14,
            destination: "Cartagena, Colombia",
            estimatedLodgingCostPerDay: 65,
            estimatedFlightCostPerPerson: 350
        }]; 
    });

    it('Should be a function', () => {
        expect(Traveler).to.be.a('function');
    });

    it('Should be an instance of Traveler', () => {
        expect(traveler1).to.be.an.instanceOf(Traveler);
    });

    it('Should have an id', () => {
        expect(traveler1.id).to.equal(5);
    });

    it('Should have a name', () => {
        expect(traveler1.name).to.equal('John Doe');
    });

    it('Should have a traveler type', () => {
        expect(traveler1.travelerType).to.equal('Thrill-seeker');
    });

    it('Should return a list of their previous trips', () => {
        expect(traveler1.returnPreviousTrips(trips)).to.deep.equal(traveler1PreviousTrips);
    });

    it('Should return a list of all pending trips', () => {
        expect(traveler1.returnPendingTrips(trips)).to.deep.equal(traveler1PendingTrips);
    });

    it('Should return a list of all upcoming trips', () => {
        expect(traveler1.returnUpcomingTrips(trips)).to.deep.equal(traveler1UpcomingTrips);
    });

    it('Should return a list of all the trips taken in the current year', () => {
        expect(traveler1.returnTripsPerYear(trips)).to.deep.equal(traveler1PreviousTrips);
    });

    it('Should be able to instantiate a new trip', () => {
        expect(traveler1.createNewTrip(trips, destinations, newTripInputValues1)).to.deep.equal(trip1);
    });

    it('Should update the destination city to the destination ID', () => {
        let trip2 = traveler1.createNewTrip(trips, destinations, newTripInputValues1);
        expect(trip2.destinationID).to.equal(10);

        let trip3 = traveler1.createNewTrip(trips, destinations, newTripInputValues2);
        expect(trip3.destinationID).to.equal(20);
    });

    it('Should be able to calculate the total amount a user has spent on all trips', () => {
        expect(traveler1.calculateTotalSpent(trips, destinations)).to.equal(3674);
    });
    
    it('Should be able to generate a unique trip ID', () => {
        let tripID = traveler1.generateTripID(trips);
        expect(tripID).to.equal(6);
    });

    it('Should be able to retrieve a destination\'s data based on destination id', () => {
        expect(traveler1.retrieveDestinationData(destinations, 10)).to.equal(destinations[0]);
    });

    it('Should be able to return a date in the format YYYY/MM/DD', () => {
        let reformattedDate = traveler1.reformatDate(newTripInputValues1)
        expect(reformattedDate).to.equal('2022/09/16');
    });
});
