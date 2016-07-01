/**
 * 基础 js 方法
 */


(function($) {
    // 编译当前页面 html 标签上的 loadPage 指令
    function compile() {
        var loadContainer = $('*[loadPage]');
        for (var i = 0; i < loadContainer.length; i++) {
            $(loadContainer[i]).loadPage(loadContainer.attr('loadPage'),true);
        }
    }

    // 浏览器历史跳转
    window.addEventListener("popstate", function() {
        var container = history.state ;
        var url = document.location.search.substr(1);

        if (url) {
            $(container).load(url);
        }else{
            if (sessionStorage.getItem('loadPageFirst')) {
                container = sessionStorage.getItem('loadPageFirst');
            }
            $(container).empty();
        }
    });

    $.fn.loadPage = function(url,noHistory) {
        var container = $(this);

        if (!noHistory) {
            if (container[0].localName !== 'body') {
                if (!container.attr('id')) {
                    container.attr('id', url)
                }
                if (!sessionStorage.getItem('loadPageFirst')) {
                    sessionStorage.setItem('loadPageFirst','#'+container.attr('id'));
                }
                history.pushState('#' + container.attr('id'), '', '?'+url);
            }else{
                history.pushState('body', '', '');
            }
        }

        container.removeAttr('loadPage');

        $.showLoading("正在加载...");

        $.ajax({
        	url: url,
            type: 'GET',
        	dataType: 'html'
        })
        .done(function(data) {
            container.html(data);

            // 每次加载完执行编译
            compile();

            $.hideLoading();
        })
        .fail(function() {
        	$.toast("页面加载失败", "forbidden");
        });

        return container;
    }

    $(function() {
        // base.js 所在页面初始化加载完执行
        compile();
    })
})($)
