$(window).on('load', function(){
    $('#header').vide('./video/cover', {
        bgColor: '#2e4133'
    });

});

let typed = new Typed('#typed', { // Тут id того блока, в которм будет анимация
    stringsElement: '#typed-strings', // Тут id блока из которого берем строки для анимации
    typeSpeed: 80, // Скорость печати
    startDelay: 500, // Задержка перед стартом анимации
    backSpeed: 50, // Скорость удаления
    showCursor: true,
    showCursor: true,
    cursorChar: '|',
    autoInsertCss: true,
    loop: true, // Указываем, повторять ли анимацию
    loopCount: false,
    
});