import { expect } from 'chai';
import Traveler from '../src/Traveler.js'
import Trip from '../src/Trip.js'

describe('Traveler', () => {
    let traveler1;
    let newTripInputValues;
    let trip1;
    let trips;
    let traveler1PreviousTrips;
    let traveler1PendingTrips;
    let traveler1UpcomingTrips;

    beforeEach(() => {
        traveler1 = new Traveler({
            id: 5,
            name: 'John Doe',
            travelerType: 'Thrill-seeker'
        });

        newTripInputValues = {
            destinationName: 'Lima, Peru',
            travelers: 1,
            date: '2022/09/16',
            duration: 8
        };

        trip1 = {
            id: 6,
            userID: 5,
            destinationID: 'Lima, Peru',
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

    it('Should be able to instantiate a new trip', () => {
        expect(traveler1.createNewTrip(trips, newTripInputValues)).to.deep.equal(trip1);
    });
});