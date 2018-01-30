jQuery.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});


$("#run-search").on("click", function () {
    event.preventDefault();

    $("#beer-body").empty();
    clearMarkers();
    deleteMarkers();
    beerList = [];
    latArr = [];

    var beer = $("#beer-style").val().trim();

    var queryURL = "https://api.brewerydb.com/v2/search?q=" + beer +
        "&withBreweries=Y&type=beer&key=3be3e987ffecfe82a589838b384c138f&format=json";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function (response) {
        console.log(response);
        var beers = response.data;



        console.log(beers[0].breweries[0].name);

        var count = 0;

        for (var i = 0; i < beers.length; i++) {
            var glass;
            if (beers[i].breweries[0].hasOwnProperty('locations')) {
                if (typeof beers[i].glass == "undefined") {
                    glass = "N/A";
                } else {
                    glass = beers[i].glass.name
                }
                $("#beer-table > tbody").append("<tr id='" + count + "'><td>" + beers[i].name + "</td><td>" + beers[i].breweries[0].name + "</td><td>" +
                    beers[i].abv + "%</td><td>" + beers[i].style.name +
                    "</td><td>" + glass + "</td></tr>");

                beerList.push(beers[i]);
                createMarker(beers[i]);
                count++;


            }
        }
    });
    $("#beer-style").val("");
    initMap();

});





//Code for the Google Map is below, used brwery location information from
//the BreweryDB

var map;
var markers = [];

var infowindow;
var service;
var geocoder;
var placeID;
var beerList = [];
var latArr = [];



function createMarker(beer) {
    var lat = beer.breweries[0].locations[0].latitude;
    var lng = beer.breweries[0].locations[0].longitude;
    var place = new google.maps.LatLng(lat, lng);
    latArr.push(place);

    var streetAddress = beer.breweries[0].locations[0].streetAddress;
    var website = beer.breweries[0].locations[0].website;
    var name = beer.breweries[0].name;
    var city = beer.breweries[0].locations[0].locality;
    var state = beer.breweries[0].locations[0].region;

    var formatted_address = streetAddress + ", " + city + ", " + state;

    if (typeof website == "undefined") {
        website = "";
    }

    var marker = new google.maps.Marker({
        map: map,
        position: place
    });

    markers.push(marker);

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent('<div><strong>' + name + '</strong><br>' +
            formatted_address + '<br>' + "<a href='" + website + "' >" + website + "</a>" + '</div>');
        infowindow.open(map, this);
    });

}

function callback(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        createMarker(place);
    }
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function clearMarkers() {
    setMapOnAll(null);
}

function showMarkers() {
    setMapOnAll(map);
}

function deleteMarkers() {
    clearMarkers();
    markers = [];
}

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: new google.maps.LatLng(37.09024, -95.712891),
        mapTypeId: 'terrain'
    });
    infowindow = new google.maps.InfoWindow();

    geocoder = new google.maps.Geocoder;

};

//Zoom in on clicked beer in results table
$(document).on("mouseover", "tr", function () {

    var id = $(this).attr('id');
    console.log(id);
    var place = latArr[id];
    map.setCenter(place);
    map.setZoom(10);


});

$(document).on("click", "tr", function () {
    $("#beer-info").empty();
    var id = $(this).attr('id');
    var beer = beerList[id];
    console.log(beer.name);

    var beerName = $("<h2>");
    beerName.text(beer.name);
    $('#beer-info').append(beerName);

    if (typeof beer.labels != 'undefined') {
        var beerImg = $("<img>");
        beerImg.attr('src', beer.labels.medium);
        $('#beer-info').append(beerImg);
    }

    var beerDsc = $("<p>");
    beerDsc.text(beer.description);
    $('#beer-info').append(beerDsc);


    document.getElementById('beer-popup').style.display = 'block';




});

$(document).on("click", "#beer-close", function () {
    document.getElementById('beer-popup').style.display = 'none'
});

// Get the user login modal
var modal = document.getElementById('id01');
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAm_nwrEHI-HAzrUa-YiRCMbcuoA24x7vA",
    authDomain: "breweryproject-223c8.firebaseapp.com",
    databaseURL: "https://breweryproject-223c8.firebaseio.com",
    projectId: "breweryproject-223c8",
    storageBucket: "breweryproject-223c8.appspot.com",
    messagingSenderId: "675321245147"
};
firebase.initializeApp(config);

const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById('btnSignUp');
const btnLogout = document.getElementById('btnLogout');

btnLogin.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
});


btnSignUp.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
});


btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
});

firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        console.log(firebaseUser);
        btnLogout.classList.remove('hide');
    } else {
        console.log('not logged in');
        btnLogout.classList.add('hide');
    }
});

// Create a variable to reference the database.
var database = firebase.database();

// --------------------------------------------------------------
// Whenever a user clicks the click `
$("#add-beer").on("click", function (event) {
    event.preventDefault();

    // Get the input values

    var beerName = $("#beer-name").val().trim();
    var location = $("#location").val().trim();
    var thoughts = $("#your-thoughts").val().trim();


    database.ref().push({
        beerName: beerName,
        location: location,
        thoughts: thoughts,
    });
});

var placeSearch, autocomplete;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('autocomplete')), {
            types: ['geocode']
        });

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    for (var component in componentForm) {
        document.getElementById(component).value = '';
        document.getElementById(component).disabled = false;
        console.log(component)
    }

    console.log(place)
    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
        }
    }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}

database.ref().on("child_added", function (childSnapshot) {

    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val());

    $("#beer-table2 > tbody").append("<tr><td>" + childSnapshot.val().beerName + "</td><td>" + childSnapshot.val().location + "</td><td>" + childSnapshot.val().thoughts + "</td></tr>");

}, function (errorObject) {});
