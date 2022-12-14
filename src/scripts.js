//IMPORTS
import './css/styles.css';
import { fetchData, fetchPost } from './apiCalls.js';
import Traveler from './Traveler.js';

//IMAGES
import './images/man.jpg';
import './images/main-background-2.jpg';
import './images/button-image.jpg';

//QUERY SELECTORS
const login = document.getElementById('loginPage');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const travelerDashboard = document.getElementById('travelerDashboard');
const userName = document.getElementById('userName');
const pendingTripCount = document.getElementById('pendingTripCount');
const pluralTrip = document.getElementById('pluralTrip');
const previousTripsCardContainer = document.getElementById('previousTripsCardContainer');
const upcomingTripsCardContainer = document.getElementById('upcomingTripsCardContainer');
const pendingTripsCardContainer = document.getElementById('pendingTripsCardContainer');
const budgetCard = document.getElementById('budgetCardInformation');
const newTripForm = document.getElementById('newTripForm');
const formDestinations = document.getElementById('tripDestinations');
const formNumberOfTravelers = document.getElementById('tripTravelers')
const formDate = document.getElementById('tripDate');
const formDuration = document.getElementById('tripDuration');
const submitButton = document.getElementById('submitButton');
const inputErrorMessage = document.getElementById('inputErrorMessage');
const errorMessage = document.getElementById('errorMessage');
const confirmationMessage = document.getElementById('confirmationMessage');
const newTripCost = document.getElementById('newTripCost');

//GLOBAL VARIABLES
let userID;
let userData;
let allUsers;
let currentUser;
let allTrips;
let allDestinations;
let newTrip;
const loginInputs = [usernameInput, passwordInput];
const formInputs = [formDestinations, formNumberOfTravelers, formDate, formDuration];
const cardContainers = [previousTripsCardContainer, upcomingTripsCardContainer, pendingTripsCardContainer];

//EVENT LISTENERS
window.addEventListener('load', loadAllUsers);
loginInputs.forEach(input => {
    input.addEventListener('input', function() { validateLoginFields(); })
    });
loginButton.addEventListener('click', validateLoginEntries);
formInputs.forEach(input => {
    input.addEventListener('input', function() { validateNewTripEntries(); })
    });
submitButton.addEventListener('click', submitData);

//FETCH REQUESTS
function loadAllUsers() {
    fetchData('travelers') 
        .then((data => {
            allUsers = data;
    }));
};

function loadData() {
 Promise.all([fetchData(`travelers/${userID}`), fetchData('trips'), fetchData('destinations')])
    .then((dataSet => {
        userData = dataSet[0];
        allTrips = dataSet[1].trips;
        allDestinations = dataSet[2].destinations;
        populatePage();
    }));
};

function updateData() {
    fetchData('trips')
        .then((dataSet) => {
            allTrips = dataSet.trips;
            renderUpcomingTrips();
            renderPendingTripCount();
            renderNewPendingTrip();
            showMessage(confirmationMessage);
       });
   };

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
};

function submitData() {
    event.preventDefault();

    const newTripData = {
        destinationName: formDestinations.value,
        travelers: formNumberOfTravelers.value,
        date: formDate.value,
        duration: formDuration.value
    };

    console.log('date', formDate.value)
    newTrip = currentUser.createNewTrip(allTrips, allDestinations, newTripData);
    const total = newTrip.calculateCosts(allDestinations);

    fetchPost(newTrip);
    resetForm();
    showNewTripCost(total);
};

function validateLoginEntries() {
    event.preventDefault();

    userID = parseInt(usernameInput.value.slice(8));

    if (usernameInput.value.length < 8 || !usernameInput.value.includes('traveler') || 
    checkUserID(userID) === null) {
        showMessage(usernameError)
    } else if (passwordInput.value !== 'travel') {
        showMessage(passwordError);
    } else {
        login.classList.add('hidden');
        travelerDashboard.classList.remove('hidden');
        loadData();
    };
};

function validateLoginFields() {
    if (usernameInput.value && passwordInput.value) {
        enableButton(loginButton);
    }; 
};

function validateNewTripEntries() {
    if (formDestinations.value != 'Destination' && (formNumberOfTravelers.value && 
    !isNaN(formNumberOfTravelers.value) && formNumberOfTravelers.value != ' ') &&
    formDate.value && (formDuration.value && !isNaN(formDuration.value) && formDuration.value != ' ')) {
        enableButton(submitButton);
        } else if ((isNaN(formNumberOfTravelers.value) || formNumberOfTravelers.value === ' ') 
        || (isNaN(formDuration.value) || formDuration.value === ' ')) {
        inputErrorMessage.classList.remove('hidden');

        setTimeout(hide, 5000);
    };
};

//DOM MANIPULATION
function enableButton(button) {
    button.disabled = false;
    button.classList.remove('disabled');
};

function hide() {
    confirmationMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');
    inputErrorMessage.classList.add('hidden');
};

function populateFormDestinations() {
    allDestinations.forEach(destination => {
        formDestinations.innerHTML +=  `<option>${destination.destination}</option>`;
    });
};

function renderCard(cardCategory, tripData) {
    let destinationDataSets = retrieveDestinationData(tripData);
    let index = -1;
    
    destinationDataSets.forEach(destination => { 
        index++;

        cardContainers.forEach(cardContainer => {
            if (cardContainer.id === cardCategory) {
                cardContainer.innerHTML += `
                    <article tabindex="0" class="trip-card text" id="${cardCategory}${index}">
                        <div class="trip-card-image-container">
                            <img class="card-image" src="${destination.image}" alt="${destination.alt}" />
                        </div>
                        <div class="trip-card-info-container">
                            <p class="trip-card-header" id="cardDestination">${destination.destination}</p>
                            <p class="trip-card-dates" id="cardDates">${tripData[index].date}</p>
                            <p class="trip-card-status" id="cardTripStatus">${tripData[index].status}</p>
                        </div>
                    </article> `
            };
        });
    });
};

function renderNewPendingTrip() {
    let destinationDataSet = retrieveDestinationData([newTrip]);

    pendingTripsCardContainer.innerHTML += `
        <div class="trip-card text" id="upcomingTripCard">
            <div class="trip-card-image-container">
                <img class="card-image" src="${destinationDataSet[0].image}" alt="${destinationDataSet[0].alt}" />
            </div>
            <div class="trip-card-info-container">
                <h2 class="trip-card-header" id="cardDestination">${destinationDataSet[0].destination}</h2>
                <h3 class="trip-card-dates" id="cardDates">${newTrip.date}</h3>
                <h3 class="trip-card-status" id="cardTripStatus">${newTrip.status}</h3>
            </div>
        </div> `
};

function renderPendingTrips() {
    let pendingTrips = currentUser.returnPendingTrips(allTrips);
    
    if (pendingTrips.length >= 1) {
        renderCard('pendingTripsCardContainer', pendingTrips);
    };
};

function renderPendingTripCount() {
    let pendingTrips = currentUser.returnPendingTrips(allTrips);

    pendingTripCount.innerText = pendingTrips.length;

    if (pendingTrips.length === 1) {
        pluralTrip.innerText = 'trip';
    };
};

function renderPreviousTrips() {
    let previousTrips = currentUser.returnPreviousTrips(allTrips);
    
    if (previousTrips.length >= 1) {
        renderCard('previousTripsCardContainer', previousTrips);
    };
};

function renderUpcomingTrips() {
    let upcomingTrips = currentUser.returnUpcomingTrips(allTrips);
    
    if (upcomingTrips.length >= 1) {
        renderCard('upcomingTripsCardContainer', upcomingTrips);
    };
};

function renderYearlySpending() {
    const totalSpent = currentUser.calculateTotalSpent(allTrips,allDestinations);

    budgetCard.innerText = `$${totalSpent}`;
};

function renderWelcomeMessage() {
    userName.innerText = currentUser.name;
};

function resetForm() {
    newTripForm.reset();
    submitButton.disabled = true;
    submitButton.classList.add('disabled');
};

function showMessage(message) {
    message.classList.remove('hidden');

    setTimeout(hide, 6000);
};

function showNewTripCost(total) {
    newTripCost.innerText = `$${total}`;
};

//HELPER FUNCTIONS
function checkUserID(id) {
    const validUser = allUsers.travelers.find(user => {
        return user.id === id});

    if (validUser) {
        return true;
    } else {
        return null;
    };
};

function instantiateNewUser() {
    currentUser = new Traveler(userData);
};

function retrieveDestinationData(trips) {
    const destinationIDs = returnDestinationID(trips);
    let destinationDataSets = [];

    const destinationData =  destinationIDs.forEach(id => {
        let data = currentUser.retrieveDestinationData(allDestinations, id);
        
        destinationDataSets.push(data);
        });

    return destinationDataSets;
};
        
function returnDestinationID(trips) {
    return trips.map(trip => {
        return trip.destinationID;
    });
};

export { updateData, hide };