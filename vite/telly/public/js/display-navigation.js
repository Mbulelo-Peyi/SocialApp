$(function () {
    var timer;
    var fadeInBuffer = false;
    $(document).mousemove(function () {
        if ($("#slide-container") != null){
            if (!fadeInBuffer) {
                if (timer) {
                    clearTimeout(timer);
                    timer = 0;
                }
                $("#navigation-icons").css({display:"flex"});
                $("#position-icons").css({display:"block"});
                $('html').css({cursor: ''});
            } else {
                fadeInBuffer = false;
            }
            timer = setTimeout(function () {
                $("#navigation-icons").css({display:"none"});
                $("#position-icons").css({display:"none"});
                $('html').css({cursor: 'none'});
                fadeInBuffer = true;
            }, 5000)
        }

    });
});