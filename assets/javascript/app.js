/// Javascript Code Below
var that = this;
var searchParams = {};
$('#submit').on("click", function(){
    that.searchParams = {
        start :  $('#start').val().trim(),
        end: $('#end').val().trim(),
        destination: $('#destination').val().trim(),
        radius: $('#radius').val().trim()
    }
    console.log(
        that.searchParams
    )
})