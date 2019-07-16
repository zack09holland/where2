/// Javascript Code Below
var that = this;
var where2Application = {
    searchParams: {
        start : "",
        end : "",
        destination : "",
        city : "",
        state : "",
        country : "",
        radius : 0,
        lat : 0,
        lng : 0
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
    zomatoApi : {
        searchParams : {
            url: "https://developers.zomato.com/api/v2.1/cities?",
            count: 10
        },
        queryZomato : function () {
            queryUrl = this.searchParams.url + "q=" + that.where2Application.searchParams.destination + "&lat=" + that.where2Application.searchParams.lat + "&lng=" + that.where2Application.searchParams.lng + "&count=" + this.searchParams.count
            queryUrl = encodeURI(queryUrl)
            $.ajax({
                headers: {
                    'user-key':'03136f6b258dbdebd5478a174180a71f'
                },
                url: queryUrl,
                method: "get"
            }).then(function(data){
                console.log(data)
                console.log(queryUrl)
            });
        }
    },
    // Eventbrite API
    eventbriteAPI : {
        searchParams : {
            url: "https://www.eventbriteapi.com/v3/events/search",
            count: 10
        },
        queryEventbrite : function() {

            var queryURL = this.searchParams.url + 
                        "/?q=" + "&location.address="+that.where2Application.searchParams.destination +
                        "&location.within="+that.where2Application.searchParams.radius+"mi"+"&expand=venue"+
                        "&start_date.range_start="+ moment(that.where2Application.searchParams.start).format('YYYY-MM-DD')+"T00:00:01Z"+
                        "&start_date.range_end="+moment(that.where2Application.searchParams.end).format('YYYY-MM-DD')+"T00:00:01Z";
            
            console.log(moment(that.where2Application.searchParams.end).format('YYYY-MM-DDThh:mm:ssZ'));
            console.log(queryURL)
            $.ajax({
                headers: {
                    "Authorization": "Bearer 66AKEOSDCRZBQ2RSCGXN",
                },
                url: queryURL,
                method: "get"
                
            }).then(function(data){
                console.log(data.events);
                // eventObject = {
                //     eventImg : "",
                //     eventName : "",
                //     eventDate : "",
                //     eventTicketLink : ""
                // }
                // for(var i=0; data.events[i]<1; i++){
                //     eventObject.eventImg = data.events[i].logo.url;
                //     console.log(data.events[i].logo.url);
                //     eventObject.eventName = data.events[i].name.text;
                //     eventObject.eventDate = data.events[i].start.local;
                //     eventObject.eventTicketLink = data.events[i].start.url;
                // }
                // console.log(eventObject);
                console.table(data)
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
            }).then(function(data){
                console.log(data)
                console.log(queryUrl)
            });
        }
        
    }
};
$('#submit').on("click", function(){
    that.where2Application.searchParams.start = $('#start').val().trim(),
    that.where2Application.searchParams.end = $('#end').val().trim(),
    that.where2Application.searchParams.destination = $('#locationAutocomplete').val().trim(),
    that.where2Application.searchParams.radius = $('#radius').val().trim()
    console.log(that.where2Application.searchParams)
    that.where2Application.zomatoApi.queryZomato()
    that.where2Application.eventbriteAPI.queryEventbrite()
    that.where2Application.yelpAPI.queryYelp()
});


var input = document.getElementById('locationAutocomplete');
var autocomplete = new google.maps.places.Autocomplete(input,{types: ['(cities)']});
google.maps.event.addListener(autocomplete, 'place_changed', function(){
   var place = autocomplete.getPlace();
   console.log(place);
   that.where2Application.searchParams.destination = place["formatted_address"]
   console.log(place["formatted_address"]);
   that.where2Application.searchParams.lat = Number.parseFloat(place.geometry.location.lat()).toFixed(4)
   that.where2Application.searchParams.lng = Number.parseFloat(place.geometry.location.lng()).toFixed(4)
   console.log(that.where2Application.searchParams)
   console.log("Location: " + that.where2Application.searchParams.destination + "\n Lat: " + that.where2Application.searchParams.lat + "\n Lng: " + that.where2Application.searchParams.lng)
})


$(function(){
    that.where2Application.setDateValues();
});