$(document).ready(function(){
    $('.header__burger').click(function(event){
        $('.header__burger,.header__menu').toggleClass('active')
        $('.body').toggleClass('lock')
    });
});

const owl = $('.owl-carousel');

owl.owlCarousel({
	center:true,
	loop: true,
	
	margin: 40,
	startPosition: 1,
	items: 3,
});

$('.slider__btn--prev').click(function () {
	owl.trigger('next.owl.carousel');
});


$('.slider__btn--next').click(function () {
	owl.trigger('perv.owl.carousel');
});
