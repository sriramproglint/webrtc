$(document).ready(function () {
    $('.chat-par-box').css('display', "none");
    $('.chat-par-box').addClass('hide-box');

    $('.show-chat').click(function () {
        if ($(window).width() < 767) {
            $('.video-side').css('display', 'none');
            $('.chat-par-box').css('display', 'table-cell');
        } else {
            if ($('.chat-par-box').hasClass('hide-box')) {
                $('.chat-par-box').css({
                    "display": "table-cell",
                    "width": "30%"
                });
                $('.chat-par-box').removeClass('hide-box');
            } else {
                $('.chat-par-box').css({
                    "display": "none"
                });
                $('.chat-par-box').addClass('hide-box');
            }
        }
    });
    $('.close-chat').click(function () {
        $('.chat-par-box').css('display', 'none');
        $('.video-side').css('display', 'table-cell');
    });
    // toggle for SOAP mobile hamburger menu
    $("div.encounter-tabs>.hamburger-soap>span>i.fa-bars").click(function () {
        $(".encounter-tabs>ul.nav.nav-tabs.accordingBlock").css('display', 'block');
        $("div.encounter-tabs>.hamburger-soap>span>i.fa-bars").css('display', 'none');
        $("div.encounter-tabs>.hamburger-soap>span>i.fa-times").css('display', 'block');
    });
    //close soap tab
    $("div.encounter-tabs>.hamburger-soap>span>i.fa-times").click(function () {
        $(".encounter-tabs>ul.nav.nav-tabs.accordingBlock").css('display', 'none');
        $("div.encounter-tabs>.hamburger-soap>span>i.fa-bars").css('display', 'block');
        $("div.encounter-tabs>.hamburger-soap>span>i.fa-times").css('display', 'none');
    });

});