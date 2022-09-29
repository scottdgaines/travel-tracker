/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "updateData": () => (/* binding */ updateData),
/* harmony export */   "hide": () => (/* binding */ hide)
/* harmony export */ });
/* harmony import */ var _css_styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _apiCalls_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _Traveler_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9);
/* harmony import */ var _images_man_jpg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11);
/* harmony import */ var _images_main_background_2_jpg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7);
/* harmony import */ var _images_button_image_jpg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(12);
//IMPORTS




//IMAGES




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
    (0,_apiCalls_js__WEBPACK_IMPORTED_MODULE_1__.fetchData)('travelers') 
        .then((data => {
            allUsers = data;
    }));
};

function loadData() {
 Promise.all([(0,_apiCalls_js__WEBPACK_IMPORTED_MODULE_1__.fetchData)(`travelers/${userID}`), (0,_apiCalls_js__WEBPACK_IMPORTED_MODULE_1__.fetchData)('trips'), (0,_apiCalls_js__WEBPACK_IMPORTED_MODULE_1__.fetchData)('destinations')])
    .then((dataSet => {
        userData = dataSet[0];
        allTrips = dataSet[1].trips;
        allDestinations = dataSet[2].destinations;
        populatePage();
    }));
};

function updateData() {
    (0,_apiCalls_js__WEBPACK_IMPORTED_MODULE_1__.fetchData)('trips')
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

    (0,_apiCalls_js__WEBPACK_IMPORTED_MODULE_1__.fetchPost)(newTrip);
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
    currentUser = new _Traveler_js__WEBPACK_IMPORTED_MODULE_2__.default(userData);
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



/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 3 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _images_main_background_2_jpg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
// Imports




var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(_images_main_background_2_jpg__WEBPACK_IMPORTED_MODULE_3__.default);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* Styling index.html */\n/* General Properties, Arranged Alphabetically */\n.card-image {\n  border-radius: 10px;\n  height: 100px;\n  width: 200px;\n}\n\n.display {\n  background-color: white;\n  border: 2px solid grey;\n  border-radius: 25px;\n  box-shadow: 5px 5px 5px grey;\n  height: 300px;\n  margin: 0 auto;\n  margin-top: 20px;\n  width: 300px;\n}\n\n.display-header {\n  font-family: 'Irish Grover', cursive;\n  font-size: 30px;\n  text-align: center;\n  margin: 0 auto;\n  margin-top: 10px;\n}\n\n.trip-card {\n  border: 1px solid grey;\n  border-radius: 10px;\n  box-shadow: 2px 2px 2px grey;\n  height: 200px;\n  margin: 0 auto;\n  margin-top: 20px;\n  overflow-x: scroll;\n  width: 200px;\n}\n\n.trip-card-display-container {\n  height: 85%;\n  overflow-x: scroll;\n}\n\n.trip-card-info-container {\n  height: 100px;\n  width: fill\n}\n\n.trip-card-image-container {\n  height: 100px;\n  width: fill;\n}\n\n.trip-card-dates {\n  margin: 0 auto;\n  width: fit-content;\n}\n\n.trip-card-header {\n  font-size: 20px;\n  margin: 0 auto;\n  width: fit-content;\n}\n\n.trip-card-status {\n  font-size: 15px;\n  margin-left: 5px;\n  width: fit-content;\n}\n\n.text {\n  font-family: 'Noto Serif', serif;\n}\n\n/* Specific Properties, Arranged According to Appearance */\nbody {\n  margin: 0px;\n}\n\n.login-container-and-image {\n  margin-top: 30vh;\n}\n\n.login-container {\n  background-color: #3CC8BC;\n  border: 2px solid black;\n  border-radius: 25px;\n  box-shadow: 2px 2px 2px grey; \n  display: flex;\n  flex-direction: column;\n  height: fit-content;\n  margin: 0 auto;\n  width: 350px;\n}\n\n.login-header {\n  font-size: 45px;\n  margin-top: 10px;\n  text-align: center;\n}\n\n.login-form {\n  font-size: 20px;\n  margin: 0 auto;\n}\n\n.login-label {\n  font-size: 15px;\n}\n\n.login-input {\n  margin-top: 2px;\n  width: 200px;\n}\n\n.login-button {\n  background-color: #BBADD9;\n  cursor: pointer;\n  margin-top: 15px;\n  margin-bottom: 15px;\n  width: 100px;\n}\n\n.login-error {\n  font-size: 14px;\n  margin: 10px;\n}\n\n.login-image {\n  height: 210px;\n}\n\n.traveler-dashboard {\n  background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n  background-position: left;\n  background-size: cover;\n  height: 100vh;\n}\n\n.welcome-message-container {\n  display: flex;\n  flex-direction: column;\n  margin: 0 auto;\n  margin-top: 15px;\n  width: 50vw;\n}\n\n.username-header {\n  margin: 0 auto;\n  width: fit-content;\n}\n\n.pending-trip-message {\n  height: fit-content;\n  margin: 0 auto;\n  width: fit-content;\n}\n\n.display-area {\n  display: flex;\n  flex-direction: row;\n}\n\n.budget-text {\n  font-size: 15px;\n  text-align: center;\n  margin: 0 auto;\n  margin-top: 15px;\n}\n\n.budget-card {\n  font-size: 30px;\n  margin: 0 auto;\n  margin-top: 30px;\n  width: fit-content;\n}\n\n.create-new-trip-display {\n  background-color: white;\n  border: 1px solid grey;\n  border-radius: 25px;\n  box-shadow: 5px 5px 5px grey;\n  margin: 0 auto;\n  margin-top: 20px;\n  width: 95vw;\n}\n\n.new-trip-form-container {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-evenly;\n}\n\nform {\n  margin-bottom: 30px;\n  width: fit-content;\n}\n\nbutton {\n  background-color: #3CC8BC;\n  cursor: pointer;\n  margin-top: 5px;\n}\n\n.form-image {\n  height: 90px;\n  margin-top: 20px;\n}\n\n.new-trip-cost-display {\n  font-size: 15px;\n}\n\n.new-trip-cost-header {\n  font-size: 15px;\n  text-align: center;\n}\n\n.new-trip-cost {\n  font-size: 30px;\n  margin: 0 auto;\n}\n\n.agent-fee {\n  font-size: 15px;\n  margin: 0 auto;\n}\n\n.message {\n  font-size: 20px;\n  margin: 0 auto;\n  margin-bottom: 10px;\n  width: fit-content;\n}\n\n/* Elements added by Javascript */\n.disabled {\n  cursor: auto;\n}\n\n.hidden {\n  display: none;\n}", "",{"version":3,"sources":["webpack://./src/css/styles.css"],"names":[],"mappings":"AAAA,uBAAuB;AACvB,gDAAgD;AAChD;EACE,mBAAmB;EACnB,aAAa;EACb,YAAY;AACd;;AAEA;EACE,uBAAuB;EACvB,sBAAsB;EACtB,mBAAmB;EACnB,4BAA4B;EAC5B,aAAa;EACb,cAAc;EACd,gBAAgB;EAChB,YAAY;AACd;;AAEA;EACE,oCAAoC;EACpC,eAAe;EACf,kBAAkB;EAClB,cAAc;EACd,gBAAgB;AAClB;;AAEA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,4BAA4B;EAC5B,aAAa;EACb,cAAc;EACd,gBAAgB;EAChB,kBAAkB;EAClB,YAAY;AACd;;AAEA;EACE,WAAW;EACX,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb;AACF;;AAEA;EACE,aAAa;EACb,WAAW;AACb;;AAEA;EACE,cAAc;EACd,kBAAkB;AACpB;;AAEA;EACE,eAAe;EACf,cAAc;EACd,kBAAkB;AACpB;;AAEA;EACE,eAAe;EACf,gBAAgB;EAChB,kBAAkB;AACpB;;AAEA;EACE,gCAAgC;AAClC;;AAEA,0DAA0D;AAC1D;EACE,WAAW;AACb;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,yBAAyB;EACzB,uBAAuB;EACvB,mBAAmB;EACnB,4BAA4B;EAC5B,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,cAAc;EACd,YAAY;AACd;;AAEA;EACE,eAAe;EACf,gBAAgB;EAChB,kBAAkB;AACpB;;AAEA;EACE,eAAe;EACf,cAAc;AAChB;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,eAAe;EACf,YAAY;AACd;;AAEA;EACE,yBAAyB;EACzB,eAAe;EACf,gBAAgB;EAChB,mBAAmB;EACnB,YAAY;AACd;;AAEA;EACE,eAAe;EACf,YAAY;AACd;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,yDAAwD;EACxD,yBAAyB;EACzB,sBAAsB;EACtB,aAAa;AACf;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,cAAc;EACd,gBAAgB;EAChB,WAAW;AACb;;AAEA;EACE,cAAc;EACd,kBAAkB;AACpB;;AAEA;EACE,mBAAmB;EACnB,cAAc;EACd,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb,mBAAmB;AACrB;;AAEA;EACE,eAAe;EACf,kBAAkB;EAClB,cAAc;EACd,gBAAgB;AAClB;;AAEA;EACE,eAAe;EACf,cAAc;EACd,gBAAgB;EAChB,kBAAkB;AACpB;;AAEA;EACE,uBAAuB;EACvB,sBAAsB;EACtB,mBAAmB;EACnB,4BAA4B;EAC5B,cAAc;EACd,gBAAgB;EAChB,WAAW;AACb;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,6BAA6B;AAC/B;;AAEA;EACE,mBAAmB;EACnB,kBAAkB;AACpB;;AAEA;EACE,yBAAyB;EACzB,eAAe;EACf,eAAe;AACjB;;AAEA;EACE,YAAY;EACZ,gBAAgB;AAClB;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,eAAe;EACf,kBAAkB;AACpB;;AAEA;EACE,eAAe;EACf,cAAc;AAChB;;AAEA;EACE,eAAe;EACf,cAAc;AAChB;;AAEA;EACE,eAAe;EACf,cAAc;EACd,mBAAmB;EACnB,kBAAkB;AACpB;;AAEA,iCAAiC;AACjC;EACE,YAAY;AACd;;AAEA;EACE,aAAa;AACf","sourcesContent":["/* Styling index.html */\n/* General Properties, Arranged Alphabetically */\n.card-image {\n  border-radius: 10px;\n  height: 100px;\n  width: 200px;\n}\n\n.display {\n  background-color: white;\n  border: 2px solid grey;\n  border-radius: 25px;\n  box-shadow: 5px 5px 5px grey;\n  height: 300px;\n  margin: 0 auto;\n  margin-top: 20px;\n  width: 300px;\n}\n\n.display-header {\n  font-family: 'Irish Grover', cursive;\n  font-size: 30px;\n  text-align: center;\n  margin: 0 auto;\n  margin-top: 10px;\n}\n\n.trip-card {\n  border: 1px solid grey;\n  border-radius: 10px;\n  box-shadow: 2px 2px 2px grey;\n  height: 200px;\n  margin: 0 auto;\n  margin-top: 20px;\n  overflow-x: scroll;\n  width: 200px;\n}\n\n.trip-card-display-container {\n  height: 85%;\n  overflow-x: scroll;\n}\n\n.trip-card-info-container {\n  height: 100px;\n  width: fill\n}\n\n.trip-card-image-container {\n  height: 100px;\n  width: fill;\n}\n\n.trip-card-dates {\n  margin: 0 auto;\n  width: fit-content;\n}\n\n.trip-card-header {\n  font-size: 20px;\n  margin: 0 auto;\n  width: fit-content;\n}\n\n.trip-card-status {\n  font-size: 15px;\n  margin-left: 5px;\n  width: fit-content;\n}\n\n.text {\n  font-family: 'Noto Serif', serif;\n}\n\n/* Specific Properties, Arranged According to Appearance */\nbody {\n  margin: 0px;\n}\n\n.login-container-and-image {\n  margin-top: 30vh;\n}\n\n.login-container {\n  background-color: #3CC8BC;\n  border: 2px solid black;\n  border-radius: 25px;\n  box-shadow: 2px 2px 2px grey; \n  display: flex;\n  flex-direction: column;\n  height: fit-content;\n  margin: 0 auto;\n  width: 350px;\n}\n\n.login-header {\n  font-size: 45px;\n  margin-top: 10px;\n  text-align: center;\n}\n\n.login-form {\n  font-size: 20px;\n  margin: 0 auto;\n}\n\n.login-label {\n  font-size: 15px;\n}\n\n.login-input {\n  margin-top: 2px;\n  width: 200px;\n}\n\n.login-button {\n  background-color: #BBADD9;\n  cursor: pointer;\n  margin-top: 15px;\n  margin-bottom: 15px;\n  width: 100px;\n}\n\n.login-error {\n  font-size: 14px;\n  margin: 10px;\n}\n\n.login-image {\n  height: 210px;\n}\n\n.traveler-dashboard {\n  background-image: url('../images/main-background-2.jpg');\n  background-position: left;\n  background-size: cover;\n  height: 100vh;\n}\n\n.welcome-message-container {\n  display: flex;\n  flex-direction: column;\n  margin: 0 auto;\n  margin-top: 15px;\n  width: 50vw;\n}\n\n.username-header {\n  margin: 0 auto;\n  width: fit-content;\n}\n\n.pending-trip-message {\n  height: fit-content;\n  margin: 0 auto;\n  width: fit-content;\n}\n\n.display-area {\n  display: flex;\n  flex-direction: row;\n}\n\n.budget-text {\n  font-size: 15px;\n  text-align: center;\n  margin: 0 auto;\n  margin-top: 15px;\n}\n\n.budget-card {\n  font-size: 30px;\n  margin: 0 auto;\n  margin-top: 30px;\n  width: fit-content;\n}\n\n.create-new-trip-display {\n  background-color: white;\n  border: 1px solid grey;\n  border-radius: 25px;\n  box-shadow: 5px 5px 5px grey;\n  margin: 0 auto;\n  margin-top: 20px;\n  width: 95vw;\n}\n\n.new-trip-form-container {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-evenly;\n}\n\nform {\n  margin-bottom: 30px;\n  width: fit-content;\n}\n\nbutton {\n  background-color: #3CC8BC;\n  cursor: pointer;\n  margin-top: 5px;\n}\n\n.form-image {\n  height: 90px;\n  margin-top: 20px;\n}\n\n.new-trip-cost-display {\n  font-size: 15px;\n}\n\n.new-trip-cost-header {\n  font-size: 15px;\n  text-align: center;\n}\n\n.new-trip-cost {\n  font-size: 30px;\n  margin: 0 auto;\n}\n\n.agent-fee {\n  font-size: 15px;\n  margin: 0 auto;\n}\n\n.message {\n  font-size: 20px;\n  margin: 0 auto;\n  margin-bottom: 10px;\n  width: fit-content;\n}\n\n/* Elements added by Javascript */\n.disabled {\n  cursor: auto;\n}\n\n.hidden {\n  display: none;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 4 */
/***/ ((module) => {



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),
/* 5 */
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 6 */
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    // eslint-disable-next-line no-param-reassign
    options = {};
  } // eslint-disable-next-line no-underscore-dangle, no-param-reassign


  url = url && url.__esModule ? url.default : url;

  if (typeof url !== "string") {
    return url;
  } // If url is already wrapped in quotes, remove them


  if (/^['"].*['"]$/.test(url)) {
    // eslint-disable-next-line no-param-reassign
    url = url.slice(1, -1);
  }

  if (options.hash) {
    // eslint-disable-next-line no-param-reassign
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/main-background-2.jpg");

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchData": () => (/* binding */ fetchData),
/* harmony export */   "fetchPost": () => (/* binding */ fetchPost)
/* harmony export */ });
/* harmony import */ var _scripts_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


function fetchData(dataCategory) {
    return fetch(`http://localhost:3001/api/v1/${dataCategory}`)
        .then(response => response.json())
        .then(data => data);
};

function fetchPost(newTripData) {
    return fetch('http://localhost:3001/api/v1/trips', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newTripData)
    })
        .then(response => handleErrors(response))
        .then(response => response.json())
        .catch(err => showErrorMessage());
};

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    } else {
        (0,_scripts_js__WEBPACK_IMPORTED_MODULE_0__.updateData)();

        return response;
    };
 };

function showErrorMessage() {
    errorMessage.classList.remove('hidden');

    setTimeout(_scripts_js__WEBPACK_IMPORTED_MODULE_0__.hide, 5000);
};



/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _src_Trip_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);


class Traveler {
    constructor(travelerData) {
        this.id = travelerData.id,
        this.name = travelerData.name,
        this.travelerType = travelerData.travelerType
    };

    returnPreviousTrips(tripsData) {
        let currentDate = this.returnCurrentDate();
 
        return tripsData.filter(trip => {
            return trip.userID === this.id && trip.date < currentDate;
        });
    };

    returnPendingTrips(tripsData) {
        return tripsData.filter(trip => {
            return trip.userID === this.id && trip.status === 'pending';
        });
    };

    returnUpcomingTrips(tripsData) {
        let currentDate = this.returnCurrentDate();

        return tripsData.filter(trip => {
            return trip.userID === this.id && trip.date >= currentDate;
        });
    };

    returnTripsPerYear(tripsData) {
        let currentYear = String(new Date().getFullYear());

        return tripsData.filter(trip => {
            return trip.date.slice(0, 4) === currentYear && trip.userID === this.id;
        });
    };

    createNewTrip(trips, destinations, newTripData) {
        const reformattedDate = this.reformatDate(newTripData);
        const tripID = this.generateTripID(trips);
        const destinationID = this.updateDestinationID(destinations, newTripData);
        const newTrip = new _src_Trip_js__WEBPACK_IMPORTED_MODULE_0__.default(tripID, this.id, newTripData, destinationID, reformattedDate);

        return newTrip;
    };

    returnDestinationData(trips, destinations) {
        const destinationIDs = this.returnDestinationID(trips);
        let destinationDataSets = [];
    
        const destinationData =  destinationIDs.forEach(id => {
            let data = this.retrieveDestinationData(destinations, id);

            destinationDataSets.push(data);
            });
    
        return destinationDataSets;
    };

    calculateTotalSpent(trips, destinations) {
        const yearsTrips = this.returnTripsPerYear(trips);

        const tripTotals = yearsTrips.map(trip => {
            return this.calculateCostsPerTrip(destinations, trip);
        });

        return tripTotals.reduce((acc, total) => {
            return acc += total;
        }, 0);
    };

    //Helper Functions
    returnCurrentDate() {
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');       
        const yyyy = today.getFullYear();

        today = yyyy + '/' + mm + '/' + dd;

        return today;
    };

    generateTripID(trips) {
        return trips.length + 1;
    };

    returnDestinationID(trips) {
        return trips.map(trip => {
            return trip.destinationID;
        });
    };

    updateDestinationID(destinations, newTripData) {
        const destinationID = destinations.find(destination => {
            return destination.destination === newTripData.destinationName;
        });
        
        if (destinationID === undefined) {
            alert('Something went wrong, please try again later');
            return this.destinationID = null; 
        } else {
            return this.destinationID = destinationID.id;
        };
    };

    calculateCostsPerTrip(destinations, trip) {
        const destinationData = this.retrieveDestinationData(destinations, trip.destinationID);
       
        const lodgingPerDay = destinationData.estimatedLodgingCostPerDay;
        const flightPerPerson = destinationData.estimatedFlightCostPerPerson;

        const totalLodging = lodgingPerDay * trip.duration;
        const totalFlights = flightPerPerson * trip.travelers;

        const totalTrip = totalLodging + totalFlights;
        const agentFee = totalTrip * .10;
        
        return totalTrip + agentFee;
    };

    retrieveDestinationData(destinations, destinationID) {
        return destinations.find(destination => {
            return destination.id === destinationID;
        });
    };

    reformatDate(newTripData) {
        const reformattedDate = newTripData.date.split('-')
        .join('/');

        return reformattedDate;
    };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Traveler);

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Trip {
    constructor(tripID, travelerID, newTripData, destinationID, date) {
        this.id = tripID,
        this.userID = travelerID,
        this.destinationID = destinationID,
        this.travelers = newTripData.travelers,
        this.date = date,
        this.duration = newTripData.duration,
        this.status = 'pending',
        this.suggestedActivities = []
    };

    calculateCosts(destinations) {
        const destinationData = this.retrieveDestinationData(destinations);

        const lodgingPerDay = destinationData.estimatedLodgingCostPerDay;
        const flightPerPerson = destinationData.estimatedFlightCostPerPerson;

        const totalLodging = lodgingPerDay * this.duration;
        const totalFlights = flightPerPerson * this.travelers;

        const totalTrip = totalLodging + totalFlights;

        const agentFee = totalTrip * .10;

        return totalTrip + agentFee;
    };

    retrieveDestinationData(destinations) {
        return destinations.find(destination => {
            return destination.id === this.destinationID;
        });
    };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Trip);


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/man.jpg");

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("images/button-image.jpg");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map