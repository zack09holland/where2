/// Javascript Code Below
var that = this;
var where2Application = {
    searchParams: {
        start : "",
        end : "",
        destination : "",
        radius : 0
    },
    // Zomato API
    zomatoApi : {
        searchParams : {
            url: "https://developers.zomato.com/api/v2.1/cities?",
            count: 10
        },
        queryZomato : function () {
            queryUrl = this.searchParams.url + "q=" + that.where2Application.searchParams.destination + "&count=" + this.searchParams.count
            $.ajax({
                headers: {
                    'user-key':'03136f6b258dbdebd5478a174180a71f'
                },
                url: queryUrl,
                method: "get"
            }).then(function(data){
                console.log(data)
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
    }
};
$('#submit').on("click", function(){
    that.where2Application.searchParams = {
        start :  $('#start').val().trim(),
        end: $('#end').val().trim(),
        destination: $('#destination').val().trim(),
        radius: $('#radius').val().trim()
    }
    that.where2Application.zomatoApi.queryZomato()
    that.where2Application.eventbriteAPI.queryEventbrite()


})
