import { expect } from 'chai';
import Traveler from '../src/Traveler.js'
import Trip from '../src/Trip.js'
import Destination from '../src/Destination.js'

describe('Trip', () => {
    let traveler1;
    let trip1;
    let newTripInputValues;

    beforeEach(() => {
        traveler1 = new Traveler({
            id: 1,
            name: 'John Doe',
            travelerType: 'Thrill-seeker'
        });

        trip1 = new Trip({
            id: 1,
            userID: 1,
            destinationID: 1,
            travelers: 1,
            date: '2022/09/16',
            duration: 8,
            status: 'pending',
            suggestedActivities: [ ]
        })

        newTripInputValues = {
            destinationID: 1,
            travelers: 1,
            date: '2022/09/16',
            duration: 8
        };
    })

    it.skip('Should be a function', () => {
        expect(Traveler).to.be.a('function');
    });

    it.skip('Should be an instance of Trip', () => {
        expect(trip1).to.be.an.instanceOf(Trip);
    });

    

    it.skip('Should have a user ID', () => {
        traveler1.createNewTrip(newTripInputValues)

        expect(trip1.userID).to.equal(1);
    })
})

