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
    }
};
$('#submit').on("click", function(){
    that.where2Application.searchParams.start = $('#start').val().trim(),
    that.where2Application.searchParams.end = $('#end').val().trim(),
    that.where2Application.searchParams.destination = $('#locationAutocomplete').val().trim(),
    that.where2Application.searchParams.radius = $('#radius').val().trim()
    console.log(that.where2Application.searchParams)
    that.where2Application.zomatoApi.queryZomato()
})


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