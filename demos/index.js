(function () {
    var container = $('#demoContainer')
    var list = $('#demoList')
    var homeBtn = $('#demoHome')

    list.find('.weui_cell').click(function () {
        container.loadPage({
            url: $(this).attr('load')
        });
    })

    homeBtn.click(function () {
        container.empty();
    })

})()
