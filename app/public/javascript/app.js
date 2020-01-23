var database = firebase.database()
/// Javascript Code Below

var clockRunning = false;
function start() {
  if (!clockRunning) {
    intervalId = setInterval(count, 1000);
    clockRunning = true;
  }
}
function stop() {
  clearInterval(intervalId);
  clockRunning = false;
}
function count() {
    displayFixes();
  }

var that = this;
var where2Application = {
    searchParams: {
        start : "",
        end : "",
        destination : "",
        destinationArray : [],
        city : "",
        state : "",
        country : "",
        countryLongName : "",
        radius : 0,
        lat : 0,
        lng : 0,
        verified : false,
    },
    userDetails: {
        displayName : "",
        email : "",
        emailverified : "",
        photoURL : "",
        isAnonymous : "",
        uid : "",
        providerData : "",
        isAuthenticated : false
    },
    setDateValues: function(){
        var startDate = new Date();
        var dd = startDate.getDate();
        var mm = startDate.getMonth()+1; 
        var yyyy = startDate.getFullYear();
        var numberOfDaysToAdd = 7;
        var numberOfYearsToAdd = 1;
        if(dd<10){ dd='0'+dd; } 
        if(mm<10){ mm='0'+mm; }
        $("#start").attr("value",yyyy+ "-" + mm +"-" +dd)
        $("#start").attr("min",yyyy+ "-" + mm +"-" +dd)
        $("#start").attr("max",(yyyy + 1) + "-" + mm +"-" +dd)
        $("#end").attr("min",yyyy+ "-" + mm +"-" +dd)
        var endDate = new Date();
        endDate.setDate(endDate.getDate() + numberOfDaysToAdd);
        var dd = endDate.getDate();
        var mm = endDate.getMonth()+1; 
        var yyyy = endDate.getFullYear();
        if(dd<10){ dd='0'+dd; } 
        if(mm<10){ mm='0'+mm; }
        $("#end").attr("value",yyyy+ "-" + mm +"-" +dd)
        $("#end").attr("max",(yyyy + 1) + "-" + mm +"-" +dd)
    },
    searchResults: {
        eventbriteResults : false,
        eventbriteComplete : false,
        yelpResults : false,
        yelpComplete : false,
        zomatoResults : false,
        zomatoComplete: false,
        allResults: false
    },
    // Zomato API
    zomatoApis : {
        searchParams : {
            //API uses
            // q query by city name; lat query by latitude; lon query by longitude; count # of results to return; city_ids comma seperated city_id values
            citiesAPIurl: "https://developers.zomato.com/api/v2.1/cities?",
            //city_id using the city id from cities; lat query by latitude; lon query by longitude
            collectionsAPIurl: "https://developers.zomato.com/api/v2.1/collections?",
            //city_id using the city id from cities; lat query by latitude; lon query by longitude
            cuisinesAPIurl: "https://developers.zomato.com/api/v2.1/cuisines?",
            //city_id using the city id from cities; lat query by latitude; lon query by longitude
            establishmentsAPIurl: "https://developers.zomato.com/api/v2.1/establishments?",
            //Get Foodie and Nightlife Index, list of popular cuisines and nearby restaurants
            //lat query by latitude; lon query by longitude
            geocodeAPIurl: "https://developers.zomato.com/api/v2.1/geocode?",
            // query query by city name; lat query by latitude; lon query by longitude; count # of results to return; city_ids comma seperated city_id values
            locationAPIurl: "https://developers.zomato.com/api/v2.1/locations?",
            // using the location ID from above get information
            //
            locationDetailsAPIurl: "https://developers.zomato.com/api/v2.1/location_details?",
            count: 100,
            country_id : "",
            city_id : "",
            entity_id : "",
            entity_type : "",
        },
        queryZomatoCities : function () {
            queryUrl = this.searchParams.locationAPIurl + "query=" + that.where2Application.searchParams.destination + "&lat=" + that.where2Application.searchParams.lat + "&lon=" + that.where2Application.searchParams.lng + "&count=" + this.searchParams.count
            queryUrl = encodeURI(queryUrl)
            $.ajax({
                headers: {
                    'user-key':'03136f6b258dbdebd5478a174180a71f',
                    'Content-Type' : 'application/json'
                },
                url: queryUrl,
                method: "get"
            }).then(function(data){
                console.log(data)
                if(data["location_suggestions"].hasTotal > 0){
                    that.where2Application.zomatoApis.searchParams["entity_id"] = data["location_suggestions"][0]["entity_id"]
                    that.where2Application.zomatoApis.searchParams["entity_type"] = data["location_suggestions"][0]["entity_type"]
                    that.where2Application.zomatoApis.searchParams["country_id"] = data["location_suggestions"][0]["country_id"]
                    that.where2Application.zomatoApis.searchParams["city_id"] = data["location_suggestions"][0]["city_id"]
                    that.where2Application.zomatoApis.queryZomatoCollections();
                    that.where2Application.zomatoApis.queryZomatoGeocode();
                    that.where2Application.zomatoApis.queryZomatoLocationsDetails();
                }
                else {
                    that.where2Application.searchResults.zomatoComplete = true;
                }
            });
        },
        queryZomatoCollections : function () {
            queryUrl = this.searchParams.collectionsAPIurl + "city_id=" + this.searchParams.city_id
            queryUrl = encodeURI(queryUrl)
            $.ajax({
                headers: {
                    'user-key':'03136f6b258dbdebd5478a174180a71f',
                    'Content-Type' : 'application/json'
                },
                url: queryUrl,
                method: "get"
            }).then(function(data){
            });
        },
        queryZomatoGeocode : function () {
            queryUrl = this.searchParams.geocodeAPIurl + "lat=" + that.where2Application.searchParams.lat + "&lon=" + that.where2Application.searchParams.lng
            queryUrl = encodeURI(queryUrl)
            $.ajax({
                headers: {
                    'user-key':'03136f6b258dbdebd5478a174180a71f',
                    'Content-Type' : 'application/json'
                },
                url: queryUrl,
                method: "get"
            // Success callback function    
            }).then(function(data){
                that.where2Application.searchResults.zomatoResults = true;
                that.where2Application.searchResults.zomatoComplete = true;
                //removeErrorMsgIfResults();
                renderZomatoGeocode(data);
            // Error callback function    
            }, function() {
                that.where2Application.searchResults.zomatoResults = false;
                that.where2Application.searchResults.zomatoComplete = true;
            });
        },
        queryZomatoLocationsDetails : function () {
            queryUrl = this.searchParams.locationDetailsAPIurl + "entity_id=" + this.searchParams.entity_id + "&entity_type=" + this.searchParams.entity_type
            queryUrl = encodeURI(queryUrl)
            $.ajax({
                headers: {
                    'user-key':'03136f6b258dbdebd5478a174180a71f',
                    'Content-Type' : 'application/json'
                },
                url: queryUrl,
                method: "get"
            }).then(function(data){
            });
        }
    },
    // Eventbrite API
    eventbriteAPI : {
        eventObject : {
            eventImg : "",
            eventName : "",
            eventDate : "",
            eventTicketLink : ""
        },
        searchParams : {
            url: "https://app.ticketmaster.com/discovery/v2/events?"
        },
        searchResults :{
            count: 10,
            perPage: 0,
            pageNumber: 0,
            pageCount: 0,
            previousResult: ""
        },
        queryEventbrite : function() {
            if(this.searchResults.previousResult)
            {
              //console.log("EventContentExist")
            }
            var queryURL = this.searchParams.url +
                "apikey=XewKqGsweKUVu1zlnx5SxwWMAtmoWvfS"+
                "&radius="+that.where2Application.searchParams.radius+
                "&locale=*"+
                "&startDateTime="+moment(that.where2Application.searchParams.start).format('YYYY-MM-DD')+"T00:00:01Z"+
                "&endDateTime="+moment(that.where2Application.searchParams.end).format('YYYY-MM-DD')+"T00:00:01Z"+
                "&page="+(this.searchResults.pageNumber + 1) +
                "&city="+that.where2Application.searchParams.destination;
                        // "/?q=" + "&location.address="+that.where2Application.searchParams.destination +
                        // "&location.within="+that.where2Application.searchParams.radius+"mi"+"&expand=venue"+
                        // "&start_date.range_start="+ moment(that.where2Application.searchParams.start).format('YYYY-MM-DD')+"T00:00:01Z"+
                        // "&start_date.range_end="+moment(that.where2Application.searchParams.end).format('YYYY-MM-DD')+"T00:00:01Z"+
                        // "&page="+(this.searchResults.pageNumber + 1)
                        console.log(queryURL)
            $.ajax({
                url: queryURL,
                type: "get",
                async:true,
                dataType: "json",
            // Evenbrite query success  
            }).then(function(data){
                console.log(that.where2Application.searchParams.destination)
                console.log(data._embedded.events)
                that.where2Application.searchResults.eventbriteResults = true;
                that.where2Application.searchResults.eventbriteComplete = true;
                that.where2Application.eventbriteAPI.searchResults.previousResult = data
                that.where2Application.eventbriteAPI.searchResults.perPage = data.pagination["page_size"]
                that.where2Application.eventbriteAPI.searchResults.pageNumber = data.pagination["page_number"]
                that.where2Application.eventbriteAPI.searchResults.pageCount = data.pagination["page_count"]
                renderEvent(data.events)               
            },
            function(){
                that.where2Application.searchResults.eventbriteResults = false;
                that.where2Application.searchResults.eventbriteComplete = true;
            });
        }
        
    },
    yelpAPI : {
        searchParams : {
            url: "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?",
            count: 10
        },
        queryYelp : function(){
            queryUrl = this.searchParams.url+"location="+that.where2Application.searchParams.destination;
            $.ajax({
                headers: {
                    "Authorization": "Bearer nKNSGBXfE2merLDsLJybUbAq_v2hXvOPf2IIt23CaozaMvdZOUD06OHtvA5NAO2rgX7ryLGcd-m3jOPs7Xy_Y_wxcmJyPOws-kp4tOspc9yTvj_xt4yBtLjHxakmXXYx"
                },
                url: queryUrl,
                method: "get"
            // Yelp API success    
            }).then(function(data){
                that.where2Application.searchResults.yelpResults = true;
                var yelpBusinesses = data.businesses;
                //removeErrorMsgIfResults();
                $('#restaurants-results-card').removeClass('d-none');
                renderYelpData(yelpBusinesses);
                that.where2Application.searchResults.yelpComplete = true;
            // Yelp API fail    
            }, function() {
                that.where2Application.searchResults.yelpResults = false;
                that.where2Application.searchResults.yelpComplete = true;
            });
        }
    },
    printResultCard: function(location,cardImage,cardLineOne,cardLineTwo,cardLineThree,cardLineFour,cardLineFive,cardLineSix,externalLink,externalLinkName){
        var divContainerFluid = $("<div>")
        divContainerFluid.attr("class","container-fluid")
        var divContainerRow = $("<div>")
        divContainerRow.attr("class","row")
        var divContainerCol = $("<div>")
        divContainerCol.attr("class","col-12 mt-3")
        var divContainerCard = $("<div>")
        divContainerCard.attr("class","card shadow-lg")
        var divContainerCardRow = $("<div>")
        divContainerCardRow.attr("class","row m-0")
        var divContainerCardRowImgCol = $("<div>")
        divContainerCardRowImgCol.attr("class","col-6 col-md-4 m-auto")
        var divContainerCardRowActualImg = $("<img>")
        divContainerCardRowActualImg.attr("class","img-responsive m-auto")
        divContainerCardRowActualImg.attr("src",cardImage)
        var divContainerCardRowBodyCol = $("<div>")
        divContainerCardRowBodyCol.attr("class","col-6 col-md-8")
        var divContainerCardRowActualBody = $("<div>")
        divContainerCardRowActualBody.attr("class","card-body")
        var divContainerCardFooter = $("<div>")
        divContainerCardFooter.attr("class","card-footer")
        var divContainerCardFooterSpanOne = $("<span>")
        var divContainerCardFooterSpanTwo = $("<span>")
        divContainerCardFooterSpanTwo.attr("class","float-right")
        var divContainerCardFooterHeart = $("<i>")
        divContainerCardFooterHeart.attr("class","fas fa-heart")
        if(cardLineOne){
            var cardBodyLineOne = $("<p>")
            cardBodyLineOne.attr("class","card-text card-line")
            var cardBodyLineOneStrong = $("<strong>")
            cardBodyLineOneStrong.text(cardLineOne)
            cardBodyLineOne.append(cardBodyLineOneStrong)
            divContainerCardRowActualBody.append(cardBodyLineOne)
        }
        if(cardLineTwo){
            var cardBodyLineTwo = $("<p>")
            cardBodyLineTwo.attr("class","card-text card-line")
            var cardBodyLineTwoSmall = $("<small>")
            cardBodyLineTwoSmall.text(cardLineTwo)
            cardBodyLineTwo.append(cardBodyLineTwoSmall)
            divContainerCardRowActualBody.append(cardBodyLineTwo)
        }
        if(cardLineThree){
            var cardBodyLineThree = $("<p>")
            cardBodyLineThree.attr("class","card-text card-line")
            cardBodyLineThree.text(cardLineThree)
            divContainerCardRowActualBody.append(cardBodyLineThree)
        }
        if(cardLineFour){
            var cardBodyLineFour = $("<p>")
            cardBodyLineFour.attr("class","card-text card-line")
            cardBodyLineFour.text(cardLineFour)
            divContainerCardRowActualBody.append(cardBodyLineFour)
        }
        if(cardLineFive){
            var cardBodyLineFive = $("<p>")
            cardBodyLineFive.attr("class","card-text card-line")
            cardBodyLineFive.text(cardLineFive)
            divContainerCardRowActualBody.append(cardBodyLineFive)
        }
        if(cardLineSix){
            var cardBodyLineSix = $("<p>")
            cardBodyLineSix.attr("class","card-text card-line")
            cardBodyLineSix.text(cardLineSix)
            divContainerCardRowActualBody.append(cardBodyLineSix)
        }
        if(externalLink){
            var cardBodyExtURL = $("<a>")
            cardBodyExtURL.attr("class","card-text card-line")
            cardBodyExtURL.attr("href",externalLink)
            cardBodyExtURL.attr("target","_blank")
            cardBodyExtURL.text(externalLinkName)
            divContainerCardFooterSpanOne.append(cardBodyExtURL)
            
        }
        divContainerCardFooterSpanTwo.append(divContainerCardFooterHeart)
        divContainerCardRowBodyCol.append(divContainerCardRowActualBody)
        divContainerCardRowImgCol.append(divContainerCardRowActualImg)
        divContainerCardRow.append(divContainerCardRowImgCol)
        divContainerCardRow.append(divContainerCardRowBodyCol)
        divContainerCard.append(divContainerCardRow)
        divContainerCardFooter.append(divContainerCardFooterSpanOne)
        divContainerCardFooter.append(divContainerCardFooterSpanTwo)
        divContainerCard.append(divContainerCardFooter)
        divContainerCol.append(divContainerCard)
        divContainerRow.append(divContainerCol)
        divContainerFluid.append(divContainerRow)
        $("#"+location).append(divContainerFluid);
    }
};
$('#Search').on("click", function(){
    if(that.where2Application.searchParams.valid){
        $("#contentDetails").hide()
        that.where2Application.searchParams.start = $('#start').val().trim(),
        that.where2Application.searchParams.end = $('#end').val().trim(),
        that.where2Application.searchParams.radius = $('#radius').val().trim()
        
        that.where2Application.zomatoApis.queryZomatoCities()
        that.where2Application.eventbriteAPI.queryEventbrite()
        that.where2Application.yelpAPI.queryYelp()
        displayFixes()
        document.getElementById("filler").style.height = '200px';
        
    }
});
function renderEvent(queryData) {
    $("#collapseOne").empty();
    //$("#gifContainer").empty();

    // Check if queryData length is 0, or array is empty
    // then show error messages
    if(queryData.length === 0) {
        that.where2Application.searchResults.eventbriteResults = false;
         //$('#event-results-card').hide();
         if(!that.where2Application.searchResults.eventbriteResults && !that.where2Application.searchResults.yelpResults && !that.where2Application.searchResults.zomatoResults) {
            //noResultsErrorMsg();
        }
    }    
    else {
        //$('#event-results-card').show();
        //removeErrorMsgIfResults();
        for (var i = 0; i < queryData.length; i++) {
            if(queryData[i].venue.address.address_1 === null){
                var eventAddress = queryData[i].venue.address.localized_area_display;
            }else{
                var eventAddress = queryData[i].venue.address.address_1+", "+queryData[i].venue.address.localized_area_display;
            }
            var eventDate = queryData[i].start.local;
            var eventName = queryData[i].name.text;
            var eventImg = queryData[i].logo.url;
            if(!eventImg){eventImg = "assets/images/defaultEvent.jpg"}
            var eventURL = queryData[i].url;
            that.where2Application.printResultCard("collapseOne",eventImg,eventName,eventAddress,eventDate,null,null,null,eventURL,"Results from EventBrite")           
        }
        $("#errorNoScroll").attr("href","")
    }
}

function renderYelpData(queryData) {
    $("#yelp-data-wrapper").empty();
    for(var i = 0; i < queryData.length; i++) {
        var yelpImg = queryData[i].image_url;
        if(!yelpImg){yelpImg = "assets/images/defaultFood.jpg"}
        var yelpBusinessName = queryData[i].name;
        var yelpAddress = queryData[i].location.address1 + ' ' + queryData[i].location.address2 + ' ' + queryData[i].location.address3;
        var yelpCityStateCountryZip = queryData[i].location.city + ', ' + queryData[i].location.state + ', ' + queryData[i].location.country + ', ' + queryData[i].location.zip_code;
        var yelpCleanAddress = yelpAddress + "; " + yelpCityStateCountryZip
        var displayPhone = queryData[i].display_phone;
        var price = 'Price: ' + queryData[i].price;
        var rating = 'Rating: ' + queryData[i].rating;
        var reviewCount = 'Review Count: ' + queryData[i].review_count;
        var yelpPage = queryData[i].url;
        that.where2Application.printResultCard("yelp-data-wrapper",yelpImg,yelpBusinessName,yelpCleanAddress,displayPhone,price,rating,reviewCount,yelpPage,"Results from Yelp")
    }

}
function renderZomatoGeocode(queryData) {
    $("#geocode-location-details").empty();
    var zomatoRestaurants = queryData.nearby_restaurants;
    for (var i = 0; i < zomatoRestaurants.length; i++) {
        var name = zomatoRestaurants[i].restaurant.name;
        var imageUrl = zomatoRestaurants[i].restaurant.featured_image; 
        if(!imageUrl){imageUrl = "assets/images/defaultFood.jpg"}
        var address = zomatoRestaurants[i].restaurant.location.address;
        var cuisines = 'Cuisines: ' + zomatoRestaurants[i].restaurant.cuisines;
        var rating = 'Rating: ' +zomatoRestaurants[i].restaurant.user_rating.aggregate_rating;
        var restaurantLink = zomatoRestaurants[i].restaurant.url;
        that.where2Application.printResultCard("geocode-location-details",imageUrl,name,address,cuisines,rating,null,null,restaurantLink,"Results from Zomato")
    }
}
//      Location Auto Complete Code
var input = document.getElementById('locationAutocomplete');
var autocomplete = new google.maps.places.Autocomplete(input,{types: ['(cities)']});
google.maps.event.addListener(autocomplete, 'place_changed', function(){
   var place = autocomplete.getPlace()
   if(place["place_id"]){
        that.where2Application.searchParams.valid = true;
        that.where2Application.searchParams.destination = place["formatted_address"]
        that.where2Application.searchParams.destinationArray = that.where2Application.searchParams.destination.split(", ")
        if(that.where2Application.searchParams.destinationArray.length == 2){
                that.where2Application.searchParams.city = that.where2Application.searchParams.destinationArray[0]
                that.where2Application.searchParams.country = that.where2Application.searchParams.destinationArray[1]
            } else {
                that.where2Application.searchParams.city = that.where2Application.searchParams.destinationArray[0]
                that.where2Application.searchParams.region = that.where2Application.searchParams.destinationArray[1]
                that.where2Application.searchParams.country = that.where2Application.searchParams.destinationArray[2]
            }
        that.where2Application.searchParams.lat = Number.parseFloat(place.geometry.location.lat()).toFixed(4)
        that.where2Application.searchParams.lng = Number.parseFloat(place.geometry.location.lng()).toFixed(4)
   } else {
    that.where2Application.searchParams.valid = false;
   }
   
})

$(document).on("click", "#login", function(){
    ui.start('#firebaseui-auth-container', uiConfig);
});

$(document).on("click", "#signOut", function(){
    firebase.auth().signOut().then(function() {
      }, function(error) {
        console.error('Sign Out Error', error);
      });
});


$(document).on("click", ".fa-heart", function(){   
    //console.log(this)
});

function displayFixes(){
    if(that.where2Application.searchResults.zomatoComplete && that.where2Application.searchResults.yelpComplete && that.where2Application.searchResults.eventbriteComplete){
        stop()
        if((that.where2Application.searchResults.zomatoResults && that.where2Application.searchResults.yelpResults) || (that.where2Application.searchResults.zomatoResults || that.where2Application.searchResults.yelpResults)){
            $("#restaurants-results-card").show()
            that.where2Application.searchResults.allResults = true;
            
        } else {
            $("#restaurants-results-card").hide()
        }
        if(that.where2Application.searchResults.eventbriteResults){
            $("#event-results-card").show()
            that.where2Application.searchResults.allResults = true;
        } else {
            $("#event-results-card").hide()
        }
        if(that.where2Application.searchResults.allResults){
            $("#contentDetails").show()
        }
    } else {
        setTimeout(start(),1000)
    }
}

function ComeONMan(){
    if(!that.where2Application.searchResults.zomatoComplete && !that.where2Application.searchResults.yelpComplete && !that.where2Application.searchResults.eventbriteComplete){
        setTimeout(displayFixes(),1000)
    }
}


$(function(){
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    $("#contentDetails").hide()
    that.where2Application.setDateValues();
});

function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}
  
/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}
// To top of page functionality
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Firebase UI variable being created with specific configuration
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return false;
        },
        uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    tosUrl: 'tos.html',
    // Privacy policy url.
    privacyPolicyUrl: 'privacy.html'
  };

// Used to set Auth to Local Storage so Persistent on machine


//function Monitors for Auth Change via FirebaseAUth
firebase.auth().onAuthStateChanged(function(user) {
    $("#insertButton").empty()
    var mainButtonCode = $("<btn>")
    mainButtonCode.attr("class","btn btn-secondary")
    var buttonMsg = $("<span>")
    if (user) {
      // User is signed in.
      // User info if we need it
      that.where2Application.userDetails = {
          displayName : user.displayName,
          email : user.email,
          emailverified : user.emailVerified,
          photoURL : user.photoURL,
          isAnonymous : user.isAnonymous,
          uid : user.uid,
          providerData : user.providerData,
          isAuthenticated : true
      }
      addUsertoDatabase(that.where2Application.userDetails.uid)
      $("#firebaseAuthModal").modal('hide')
      mainButtonCode.attr("id","signOut")
      buttonMsg.text("Sign Out...")
      // ...
  
    } else {
      that.where2Application.userDetails = {
          displayName : "",
          email : "",
          emailverified : "",
          photoURL : "",
          isAnonymous : "",
          uid : "",
          providerData : "",
          isAuthenticated : false
      }
      mainButtonCode.attr("id","login")
      mainButtonCode.attr("data-toggle","modal")
      mainButtonCode.attr("data-target","#firebaseAuthModal")
      buttonMsg.text("Login...")
    }
    mainButtonCode.append(buttonMsg)
    $("#insertButton").append(mainButtonCode)
  });
  
  
  
    
  function addUsertoDatabase(userId,name,email){
      firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        var username = (snapshot.val() && snapshot.val().username)
        //If user is not in DB we add them.
        if(!username){
            firebase.database().ref('users/' + userId).set({
                username: that.where2Application.userDetails.displayName,
                email: that.where2Application.userDetails.email
            });
        } else {
        }
      });
  }
  
  function writeUserData(userId, name, email) {
      firebase.database().ref('users/' + userId).set({
        username: name,
        email: email
      });
    }
  