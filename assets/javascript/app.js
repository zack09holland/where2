/// Javascript Code Below

$('#submit').on("click", function(){
    var searchParams = {
        start :  $('#start').val().trim(),
        end: $('#end').val().trim(),
        destination: $('#destination').val().trim(),
        radius: $('#radius').val().trim()
    }
    console.log(
        searchParams
    )
})