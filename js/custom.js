$(document).ready(function () {
    $('.chat-par-box').css('display', "none");
    $('.chat-par-box').addClass('hide-box');
    $('.soap-par-box').css('display', "none");
    $('.soap-par-box').addClass('hide-box');

    $('.close-chat').click(function () {
        $('.chat-par-box').css('display', 'none');
        $('.video-side').css('display', 'table-cell');
    });

    $('.close-soap').click(function () {
        $('.soap-par-box').css('display', 'none');
        $('.video-side').css('display', 'table-cell');
    });

});