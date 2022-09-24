//IMPORTS
import './css/styles.css';
import { fetchData, fetchPost } from './apiCalls.js'
import Traveler from './Traveler.js'

//IMAGES
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/man.jpg'
import './images/main-background-2.jpg'
import './images/button-image.jpg'
import Trip from './Trip';

//QUERY SELECTORS
const userName = document.getElementById('userName');
const pendingTripCount = document.getElementById('pendingTripCount');
const pluralTrip = document.getElementById('pluralTrip');
const previousTripCardContainer = document.getElementById('previousTripCardContainer');
const upcomingTripCardContainer = document.getElementById('upcomingTripCardContainer');
const pendingTripCardContainer = document.getElementById('pendingTripCardContainer');
const budgetCard = document.getElementById('budgetCardInformation');
const formDestinations = document.getElementById('formDestinations');
const formNumberOfTravelers = document.getElementById('formNumberOfTravelers')
const formDate = document.getElementById('formDate');
const formDuration = document.getElementById('formDuration');
const submitButton = document.getElementById('submitButton');
const errorMessage = document.getElementById('errorMessage');

//GLOBAL VARIABLES
let allUsers;
let userData;
let currentUser
let allTrips;
let allDestinations;
let randomUserID;
let newTrip;
const inputs = [formDestinations, formNumberOfTravelers, formDate, formDuration];


//FETCH REQUESTS
function loadData() {
 Promise.all([fetchData('travelers', 'travelerData'), fetchData(`travelers/${randomUserID}`, 'singleTravelerData'), fetchData('trips', 'tripsData'), fetchData('destinations', 'destinationData')])
    .then((dataSet => {
        allUsers = dataSet[0].travelers;
        userData = dataSet[1];
        allTrips = dataSet[2].trips;
        allDestinations = dataSet[3].destinations;
        populatePage()
    }));
};

//EVENT LISTENERS
window.addEventListener('load', generateRandomUserID)
window.addEventListener('load', loadData);
inputs.forEach(input => {
    input.addEventListener('input', function() { enableButton() })
    })
submitButton.addEventListener('click', submitData)


//EVENT HANDLERS
function populatePage() {
    instantiateNewUser();
    renderWelcomeMessage();
    renderPendingTripCount();
    renderPreviousTrips();
    renderUpcomingTrips();
    renderPendingTrips();
    renderYearlySpending();
    populateFormDestinations();
}

function instantiateNewUser() {
    currentUser = new Traveler(userData)
}

function renderWelcomeMessage() {
    userName.innerText = currentUser.name
}

function renderPendingTripCount() {
    const pendingTrips = currentUser.returnPendingTrips(allTrips);
    pendingTripCount.innerText = pendingTrips.length;

    if (pendingTrips.length === 1) {
        pluralTrip.innerText = 'trip'
    }
}

function renderPreviousTrips() {
    const previousTrips = currentUser.returnPreviousTrips(allTrips)
        .sort((trip1, trip2) => {
            return trip2.date - trip1.date
        })
    
    if (previousTrips.length >= 1) {
        const destinationDataSets = retrieveDestinationData(previousTrips);
        let index = -1;
       
        destinationDataSets.forEach(destination => { 
            index++;
   
            previousTripCardContainer.innerHTML += `
            <div class="trip-card text" id="upcomingTripCard">
                <div class="trip-card-image-container">
                    <img class="card-image" src="${destination.image}" alt="${destination.alt}" />
                </div>
                <div class="trip-card-info-container">
                    <h2 class="trip-card-header" id="cardDestination">${destination.destination}</h2>
                    <h3 class="trip-card-dates" id="cardDates">${previousTrips[index].date}</h3>
                    <h3 class="trip-card-status" id="cardTripStatus">${previousTrips[index].status}</h3>
                </div>
            </div> `
        });
    };
}

function renderUpcomingTrips() {
    const upcomingTrips = currentUser.returnUpcomingTrips(allTrips)
        .sort((trip1, trip2) => {
            return trip2.date - trip1.date
        })
    
    if (upcomingTrips.length >= 1) {
        const destinationDataSets = retrieveDestinationData(upcomingTrips);
        let index = -1;
       
        destinationDataSets.forEach(destination => { 
            index++;
   
            upcomingTripCardContainer.innerHTML += `
            <div class="trip-card text" id="upcomingTripCard">
                <div class="trip-card-image-container">
                    <img class="card-image" src="${destination.image}" alt="${destination.alt}" />
                </div>
                <div class="trip-card-info-container">
                    <h2 class="trip-card-header" id="cardDestination">${destination.destination}</h2>
                    <h3 class="trip-card-dates" id="cardDates">${upcomingTrips[index].date}</h3>
                    <h3 class="trip-card-status" id="cardTripStatus">${upcomingTrips[index].status}</h3>
                </div>
            </div> `
        })
    }
}

function renderPendingTrips() {
    const pendingTrips = currentUser.returnPendingTrips(allTrips)
        .sort((trip1, trip2) => {
            return trip2.date - trip1.date
        })
    
    if (pendingTrips.length >= 1) {
        const destinationDataSets = retrieveDestinationData(pendingTrips);
        let index = -1;
       
        destinationDataSets.forEach(destination => { 
            index++;
   
            pendingTripCardContainer.innerHTML += `
            <div class="trip-card text" id="upcomingTripCard">
                <div class="trip-card-image-container">
                    <img class="card-image" src="${destination.image}" alt="${destination.alt}" />
                </div>
                <div class="trip-card-info-container">
                    <h2 class="trip-card-header" id="cardDestination">${destination.destination}</h2>
                    <h3 class="trip-card-dates" id="cardDates">${pendingTrips[index].date}</h3>
                    <h3 class="trip-card-status" id="cardTripStatus">${pendingTrips[index].status}</h3>
                </div>
            </div> `
        });
    };
}

function renderYearlySpending() {
    const totalSpent = currentUser.calculateTotalSpent(allTrips,allDestinations)

    budgetCard.innerText = `$${totalSpent}`
}

function populateFormDestinations() {
    allDestinations.forEach(destination => {
        formDestinations.innerHTML +=  `<option>${destination.destination}</option>`
    });
}

function enableButton() {
    if (formDestinations.value != 'Choose your destination!' && formNumberOfTravelers.value != ''
        && formDate.value != '' && formDuration.value != '') {
        submitButton.disabled = false;
        submitButton.classList.remove('disabled');
    }
}

function submitData() {
    event.preventDefault();

    const newTripData = {
        destinationName: formDestinations.value,
        travelers: formNumberOfTravelers.value,
        date: formDate.value,
        duration: formDuration.value
    }

    newTrip = currentUser.createNewTrip(allTrips, allDestinations, newTripData)
    console.log(newTrip)
    fetchPost(newTrip)
}

//HELPER FUNCTIONS
function generateRandomUserID() {
    randomUserID = Math.floor(Math.random() * (50 - 1) + 1);
}

function retrieveDestinationData(trips) {
    const destinationIDs = returnDestinationID(trips)
    let destinationDataSets = []

    const destinationData =  destinationIDs.forEach(id => {
        let data = currentUser.retrieveDestinationData(allDestinations, id)
        destinationDataSets.push(data)
        })

    return destinationDataSets
}
        
function returnDestinationID(trips) {
    return trips.map(trip => {
        return trip.destinationID
    })
}




