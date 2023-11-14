$(window).on('load', function () {
    $('#header').vide('./video/cover', {
        bgColor: '#2e4133'
    });

});

let typed = new Typed('#typed', {
    stringsElement: '#typed-strings',
    typeSpeed: 80,
    startDelay: 500,
    backSpeed: 50,
    showCursor: true,
    showCursor: true,
    cursorChar: '|',
    autoInsertCss: true,
    loop: true,
    loopCount: false,

});