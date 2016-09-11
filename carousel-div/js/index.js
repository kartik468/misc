$(document).ready(function() {
    $('.content').each(function(index, element) {
        $(element).css('left', index * 100);
    })
    var noOfContents = $('.content').length;
    $('.temp-container').css('width', 100 * noOfContents);

    $('.button').on('click', function(event) {
        var $tempContainer = $('.temp-container');
        var left = $tempContainer.position().left;
        if ($(event.currentTarget).hasClass('next')) {
            console.log('next');
            $tempContainer.css('left', left - 100);
        } else {
            console.log('prev');
            $tempContainer.css('left', left + 100);
        }
        $('.button').show();
        left = $tempContainer.position().left;
        if (left === 0) {
            $('.prev').hide();
        } else if (left <= -200) {
            $('.next').hide();
        }
    })
})
