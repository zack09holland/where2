/// Javascript Code Below

// If no Eventbrite results, no Yelp results, or 
// no Zomato results
// then show error message
function noResultsErrorMsg() {
    $('#form-error-msgs').removeClass('d-none');
    // Remove data from Eventbrite, Yelp, Zomato
    // containers if error msg
    $('#collapseOne').empty();
    $('#yelp-data-wrapper').empty();
    $('#geocode-location-details').empty();
}

// If APIs do show results (Eventbrite, Yelp, Zomato)
// then remove form error message
function removeErrorMsgIfResults() {
    $('#form-error-msgs').addClass('d-none');
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
                if(data["location_suggestions"].length === 1){
                    that.where2Application.zomatoApis.searchParams["entity_id"] = data["location_suggestions"][0]["entity_id"]
                    that.where2Application.zomatoApis.searchParams["entity_type"] = data["location_suggestions"][0]["entity_type"]
                    that.where2Application.zomatoApis.searchParams["country_id"] = data["location_suggestions"][0]["country_id"]
                    that.where2Application.zomatoApis.searchParams["city_id"] = data["location_suggestions"][0]["city_id"]
                    that.where2Application.zomatoApis.queryZomatoCollections();
                    that.where2Application.zomatoApis.queryZomatoGeocode();
                    that.where2Application.zomatoApis.queryZomatoLocationsDetails();
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
                console.log("zomatoCollections: ")
                console.log(data)
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
                console.log("zomatoGeocode: ")
                console.log(data.nearby_restaurants);
                removeErrorMsgIfResults();
                renderZomatoGeocode(data);
            // Error callback function    
            }, function() {
                noResultsErrorMsg();
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
                console.log("zomatoLocationDetails")
                console.log(data)
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
            url: "https://www.eventbriteapi.com/v3/events/search"
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
              console.log("EventContentExist")
            }
            var queryURL = this.searchParams.url + 
                        "/?q=" + "&location.address="+that.where2Application.searchParams.destination +
                        "&location.within="+that.where2Application.searchParams.radius+"mi"+"&expand=venue"+
                        "&start_date.range_start="+ moment(that.where2Application.searchParams.start).format('YYYY-MM-DD')+"T00:00:01Z"+
                        "&start_date.range_end="+moment(that.where2Application.searchParams.end).format('YYYY-MM-DD')+"T00:00:01Z"+
                        "&page="+(this.searchResults.pageNumber + 1)
            console.log(queryURL)
            $.ajax({
                headers: {
                    "Authorization": "Bearer 66AKEOSDCRZBQ2RSCGXN",
                },
                url: queryURL,
                method: "get"
            // Evenbrite query success  
            }).then(function(data){
                that.where2Application.eventbriteAPI.searchResults.previousResult = data
                that.where2Application.eventbriteAPI.searchResults.perPage = data.pagination["page_size"]
                that.where2Application.eventbriteAPI.searchResults.pageNumber = data.pagination["page_number"]
                that.where2Application.eventbriteAPI.searchResults.pageCount = data.pagination["page_count"]
                renderEvent(data.events)               
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
                console.log("Yelp API data: ");
                var yelpBusinesses = data.businesses;
                removeErrorMsgIfResults();
                renderYelpData(yelpBusinesses);
            // Yelp API fail    
            }, function() {
                noResultsErrorMsg();
            });
        }
    }
};
$('#submit').on("click", function(){
    if(that.where2Application.searchParams.valid){
        that.where2Application.searchParams.start = $('#start').val().trim(),
        that.where2Application.searchParams.end = $('#end').val().trim(),
        that.where2Application.searchParams.radius = $('#radius').val().trim()
        
        that.where2Application.zomatoApis.queryZomatoCities()
        that.where2Application.eventbriteAPI.queryEventbrite()
        that.where2Application.yelpAPI.queryYelp()
        $("#contentDetails").show()
        document.getElementById("filler").style.height = '400px';

    }
});
function renderEvent(queryData) {
    $("#collapseOne").empty();
    //$("#gifContainer").empty();

    // Check if queryData length is 0, or array is empty
    // then show error messages
    if(queryData.length === 0) {
        noResultsErrorMsg();
    }    
    else {
        removeErrorMsgIfResults();
        for (var i = 0; i < queryData.length; i++) {
            if(queryData[i].venue.address.address_1 === null){
                var eventAddress = queryData[i].venue.address.localized_area_display;
            }else{
                var eventAddress = queryData[i].venue.address.address_1+", "+queryData[i].venue.address.localized_area_display;
            }
            
            var eventDate = queryData[i].start.local;
            var eventName = queryData[i].name.text;
            var eventImg = queryData[i].logo.url;
            var eventURL = queryData[i].url;
    
            var eventCard =
                "<div class='container-fluid'>"+
                    "<div class='row'>"+
                        "<div class='col-12 mt-3'>"+
                            "<div class='card shadow-lg'>"+
                                "<div class='row m-0'>"+
                                    "<div class='col-6 col-md-4 m-auto'>"+
                                        "<img class='img-responsive m-auto' src= " + eventImg + " alt='Card image cap'>"+
                                    "</div>"+
                                    "<div class='col-6 col-md-8'>"+
                                        "<div class='card-body'>"+
                                            "<p class='card-text card-line'>"+"<strong>"+eventName+"</strong></p>"+
                                            "<p class='card-text card-line'>"+"<small>"+eventAddress+"</small></p>"+
                                            "<p class='card-text card-line'>"+moment(eventDate).format("LLL")+"</p>"+
                                            "<a class='card-text card-line' href="+eventURL+" target='_blank'>Tickets</a>"+
                                        "</div>"+
                                    "</div>"+
                                "</div>"+
                                "<div class='card-footer'>"+
                                    "<small class='text-muted'>Last updated 3 mins ago</small>"
                                "</div>"+
                            "</div>"+
                        "</div>"+
                    "</div>"+
                "</div>"       
            $("#collapseOne").append(eventCard);
        }

    }
}

function renderYelpData(queryData) {
    $("#yelp-data-wrapper").empty();

    for(var i = 0; i < queryData.length; i++) {
        var yelpImg = queryData[i].image_url;
        var yelpBusinessName = queryData[i].name;
        var yelpAddress = queryData[i].location.address1 + ' ' + queryData[i].location.address2 + ' ' + queryData[i].location.address3;
        var yelpCityStateCountryZip = queryData[i].location.city + ', ' + queryData[i].location.state + ', ' + queryData[i].location.country + ', ' + queryData[i].location.zip_code;
        var displayPhone = queryData[i].display_phone;
        var price = 'Price: ' + queryData[i].price;
        var rating = 'Rating: ' + queryData[i].rating;
        var reviewCount = 'Review Count: ' + queryData[i].review_count;
        var yelpPage = queryData[i].url;
    
        var yelpCard =
        "<div class='container-fluid'>"+
            "<div class='row'>"+
                "<div class='col-12 mt-3'>"+
                    "<div class='card shadow-lg'>"+
                        "<div class='row m-0'>"+
                            "<div class='col-6 col-md-4 m-auto'>"+
                                "<img class='img-responsive m-auto' src= " + yelpImg + " alt='Card image cap'>"+
                            "</div>"+
                            "<div class='col-6 col-md-8'>"+
                                "<div class='card-body'>"+
                                    "<p class='card-text card-line'>"+"<strong>"+yelpBusinessName+"</strong></p>"+
                                    "<p class='card-text card-line'>"+yelpAddress+"<br />" + yelpCityStateCountryZip + "</p>" +
                                    "<p class='card-text card-line'>" + displayPhone + "</p>" +
                                    "<p class='card-text card-line'>" + price + "</p>" +
                                    "<p class='card-text card-line'>" + rating + "</p>" +
                                    "<p class='card-text card-line'>" + reviewCount + "</p>" +
                                    "<a class='card-text card-line' href="+yelpPage+" target='_blank'>Yelp Page</a>"+
                                "</div>"+
                            "</div>"+
                        "</div>"+
                        "<div class='card-footer'>"+
                            "<small class='text-muted'>Last updated 3 mins ago</small>"
                        "</div>"+
                    "</div>"+
                "</div>"+
            "</div>"+
        "</div>"      
    $("#yelp-data-wrapper").append(yelpCard);    

    }

}
function renderZomatoGeocode(queryData) {
    $("#geocode-location-details").empty();

    var zomatoRestaurants = queryData.nearby_restaurants;

    for (var i = 0; i < zomatoRestaurants.length; i++) {

        var name = zomatoRestaurants[i].restaurant.name;
        var imageUrl = zomatoRestaurants[i].restaurant.featured_image; 
        var address = zomatoRestaurants[i].restaurant.location.address;
        var cuisines = 'Cuisines: ' + zomatoRestaurants[i].restaurant.cuisines;
        var rating = 'Rating: ' +zomatoRestaurants[i].restaurant.user_rating.aggregate_rating;
        var restaurantLink = zomatoRestaurants[i].restaurant.url;

        var ZomatoGeocodeLocationCard =
        "<div class='container-fluid'>"+
            "<div class='row'>"+
                "<div class='col-12 mt-3'>"+
                    "<div class='card shadow-lg'>"+
                        "<div class='row m-0'>"+
                            "<div class='col-6 col-md-4 m-auto'>"+
                                "<img class='img-responsive m-auto' src='" + imageUrl + "' alt='" + name.replace(/[^a-zA-Z0-9]/g, "") + "'>"+
                            "</div>"+
                            "<div class='col-6 col-md-8'>"+
                                "<div class='card-body'>"+
                                    "<p class='card-text card-line'>"+"<strong>"+name+"</strong></p>"+
                                    "<p class='card-text card-line'>"+address+"</p>" +
                                    "<p class='card-text card-line'>" + cuisines + "</p>" +
                                    "<p class='card-text card-line'>" + rating + "</p>" +
                                    "<a class='card-text card-line' href="+restaurantLink+" target='_blank'>Zomato Page</a>"+
                                "</div>"+
                            "</div>"+
                        "</div>"+
                        "<div class='card-footer'>"+
                            "<small class='text-muted'>Last updated 3 mins ago</small>"
                        "</div>"+
                    "</div>"+
                "</div>"+
            "</div>"+
        "</div>"     
    $("#geocode-location-details").append(ZomatoGeocodeLocationCard);    

    


        

    }
}
//      Location Auto Complete Code
var input = document.getElementById('locationAutocomplete');
var autocomplete = new google.maps.places.Autocomplete(input,{types: ['(cities)']});
google.maps.event.addListener(autocomplete, 'place_changed', function(){
   var place = autocomplete.getPlace()
   console.log(place)
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
        console.log("Location: " + that.where2Application.searchParams.destination + "\n Lat: " + that.where2Application.searchParams.lat + "\n Lng: " + that.where2Application.searchParams.lng)
   } else {
    that.where2Application.searchParams.valid = false;
   }
   
})

$(document).on("click", "#login", function(){
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
});

$(document).on("click", "#signOut", function(){
    // The start method will wait until the DOM is loaded.
    firebase.auth().signOut().then(function() {
        console.log('Signed Out');
      }, function(error) {
        console.error('Sign Out Error', error);
      });
});


$(function(){
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


console.log(firebaseConfig)

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
