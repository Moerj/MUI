(function () {
    var container = $('#demoContainer')
    var list = $('#demoList')
    var home = $('#demoHome')

    list.find('.weui_cell').click(function () {
        var url = $(this).attr('load');
        /* container.show();
        $.ajax({
        	url: url
        })
        .done(function(data) {
        	container.empty().append(data);
            list.hide();
        }) */

        container.loadPage(url);
    })

    /* home.click(function () {
        container.hide()
        list.show()
    }) */




})()
