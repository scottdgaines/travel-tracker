import { expect } from 'chai';
import Traveler from '../src/Traveler.js'

describe('Traveler', () => {
    //globals
    let traveler1;

    beforeEach(() => {
    //define globals 
    traveler1 = new Traveler({
        id: 1,
        name: 'John Doe',
        travelerType: 'Thrill-seeker'
    })
    })

    it('Should be a function', () => {
        expect(Traveler).to.be.a('function');
    });

    it('Should be an instance of Traveler', () => {
        expect(traveler1).to.be.an.instanceOf(Traveler);
    });

    it('Should have an id', () => {
        expect(traveler1.id).to.equal(1);
    });

    it('Should have a name', () => {
        expect(traveler1.name).to.equal('John Doe');
    });

    it('Should have a traveler type', () => {
        expect(traveler1.travelerType).to.equal('Thrill-seeker');
    });

    it('Should return a list of their previous trips', () => {

    });

    it('Should be able to instantiate a new trip', () => {

    });
})