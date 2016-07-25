(function () {
    var container = $('#welcomeRouter')
    var list = $('#demoList')
    var homeBtn = $('#demoHome')

    list.on('click','.weui_cell',function () {
        container.loadPage({
            url: $(this).attr('load')
        });
    })

    homeBtn.on('click',function () {
        container.empty();
    })
})()
