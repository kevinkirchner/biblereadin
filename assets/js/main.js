
(function($, window, undefined){
    $('#nav .top').on('mouseenter', function(){
        $(this).addClass('hover');
    }).on('mouseleave', function(){
        $(this).removeClass('hover');
    });
    
    var lastClass = 'light';
    $('.theme-link').on('click', function(){
        var themeColor = $(this).data('theme-color');
        $('body').removeClass(lastClass).addClass( themeColor );
        lastClass = themeColor;
    })
})(jQuery, this);