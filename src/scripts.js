//IMPORTS
import './css/styles.css';
import fetchData from './apiCalls.js'
import Traveler from './Traveler.js'

//IMAGES
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/man.jpg'
import './images/main-background-2.jpg'
import './images/button-image.jpg'

//QUERY SELECTORS
const userName = document.getElementById('userName');
const pendingTripCount = document.getElementById('pendingTripCount');
const pluralTrip = document.getElementById('pluralTrip');
const upcomingTripCardContainer = document.getElementById('upcomingTripCardContainer');

//GLOBAL VARIABLES
let allUsers;
let userData;
let currentUser
let allTrips;
let allDestinations;
let randomUserID;


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

//EVENT HANDLERS
function populatePage() {
    instantiateNewUser();
    renderWelcomeMessage();
    renderPendingTripCount();
    renderUpcomingTrips();
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

function renderUpcomingTrips() {
    const upcomingTrips = currentUser.returnUpcomingTrips(allTrips)
    console.log('upcoming', upcomingTrips)
    
    if (upcomingTrips.length >= 1) {
        const destinationDataSets = retrieveDestinationData(upcomingTrips);
        console.log('destData', destinationDataSets)
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




//HELPER FUNCTIONS
function generateRandomUserID() {
    randomUserID = Math.floor(Math.random() * (50 - 1) + 1);
}




