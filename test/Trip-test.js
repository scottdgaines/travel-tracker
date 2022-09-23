import { expect } from 'chai';
import Traveler from '../src/Traveler.js';
import Trip from '../src/Trip.js';


describe('Trip', () => {
    let traveler1;
    let newTripInputValues;
    let trips;
    let tripID;
    let newTrip;
    let trip1;
    let destinations;

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

        trips = ['sampleTrip1', 'sampleTrip2', 'sampleTrip3']

        tripID = trips.length + 1

        newTrip = new Trip(tripID, 5, newTripInputValues, 10);

        trip1 = {
            id: 4,
            userID: 5,
            destinationID: 10,
            travelers: 1,
            date: '2022/09/16',
            duration: 8,
            status: 'pending',
            suggestedActivities: [ ]
        };

        destinations = [{
            id: 10,
            destination: "Lima, Peru",
            estimatedLodgingCostPerDay: 70,
            estimatedFlightCostPerPerson: 400,
            image: "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80",
            alt: "overview of city buildings with a clear sky"
            },
            {
            id: 20,
            destination: "Stockholm, Sweden",
            estimatedLodgingCostPerDay: 100,
            estimatedFlightCostPerPerson: 780,
            image: "https://images.unsplash.com/photo-1560089168-6516081f5bf1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
            alt: "city with boats on the water during the day time"
        }];
    });

    it('Should be a function', () => {
        expect(Traveler).to.be.a('function');
    });

    it('Should be an instance of Trip', () => {
        expect(newTrip).to.be.an.instanceOf(Trip);
    });

    it('Should have a trip ID', () => {
        expect(newTrip.id).to.equal(4);
    });

    it('Should have a user ID', () => {
        expect(newTrip.userID).to.equal(5);
    });

    it('Should have a destination ID', () => {
        expect(newTrip.destinationID).to.equal(10);
    });

    it('Should have a number of travelers', () => {
        expect(newTrip.travelers).to.equal(1);
    });

    it('Should have an arrival date', () => {
        expect(newTrip.date).to.equal('2022/09/16');
    });

    it('Should list the duration of the trip', () => {
        expect(newTrip.duration).to.equal(8);
    });

    it('Should have a default status of "pending"', () => {
        expect(newTrip.status).to.equal('pending');
    });

    it('Should have a default of an empty array for suggested activities', () => {
        expect(newTrip.suggestedActivities).to.deep.equal([]);
    });

    it('Should be able to return total cost of the trip', () => {
        expect(newTrip.calculateCosts(destinations)).to.equal(1056);
    })

})

