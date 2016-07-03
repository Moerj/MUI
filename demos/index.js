(function () {
    var container = $('#demoContainer')
    var list = $('#demoList')
    var homeBtn = $('#demoHome')

    list.find('.weui_cell').on('click',function () {
        container.loadPage({
            url: $(this).attr('load')
        });
    })

    homeBtn.on('click',function () {
        container.empty();
    })
})()
