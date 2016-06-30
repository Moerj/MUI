(function () {
    var container = $('#demoContainer')
    var list = $('#demoList')
    var home = $('#demoHome')

    list.find('.weui_cell').click(function () {
        container.show();
        $.ajax({
        	url: $(this).attr('load')
        })
        .done(function(data) {
        	container.empty().append(data);
            list.hide();
        })
    })

    home.click(function () {
        container.hide()
        list.show()
    })

})()
