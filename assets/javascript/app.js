/// Javascript Code Below
var that = this;
var where2Application = {
    searchParams: {
        start : "",
        end : "",
        destination : "",
        radius : 0
    },
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


})
