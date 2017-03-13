$("#scrolltogames").click(function() {
    $('html, body').animate({
        scrollTop: $("#gameslist").offset().top - 80
    }, 2000);
});

$("#backtotop").click(function() {
    $('html, body').animate({
        scrollTop: $("body").offset().top
    }, 2000);
});