/**
 * bigOrder v0.0.1
 * @license: MIT
 * Designed and built by Moer
 * github   ...
 */


(function($) {
    'use strict';
    var $body = $('body');

    function _initBigOrder(dom) {
        if (dom._bigOrder  === undefined) {
            dom._bigOrder = {}
        }
        if (dom._bigOrder.uncompiled === undefined) {
            dom._bigOrder.uncompiled = true
        }
        if (dom._bigOrder.loadFinishedEvents  === undefined) {
            dom._bigOrder.loadFinishedEvents = []
        }
        if (dom._bigOrder.loadFinished  === undefined) {
            dom._bigOrder.loadFinished = function () {
                var events = dom._bigOrder.loadFinishedEvents;
                for (var i = 0; i < events.length; i++) {
                    events[i]();
                }
            }
        }
    }

    // 编译当前页面 html 标签上的 loadPage 指令
    function _compile() {
        var loadContainer = $('*[big-loadPage]');
        var currentContainer, $current;

        for (var i = 0; i < loadContainer.length; i++) {
            currentContainer = loadContainer[i];
            $current = $(currentContainer);

            _initBigOrder(currentContainer);

            // 开始编译
            if (currentContainer._bigOrder.uncompiled) {
                currentContainer._bigOrder.uncompiled = false;
                $current.loadPage({
                    url: $current.attr('big-loadPage'),
                    history: false
                },function () {
                    currentContainer._bigOrder.loadFinished();
                });

            }


        }
    }

    function _Loading() {
        var $progress;
        var proTransition = '10s width';
        var timer = null;

        // 创建进度条
        $progress = $('<span></span>')
        $progress.css({
            backgroundColor: '#58a2d1',
            transition: proTransition,
            height: '2px',
            width: 0,
            position: 'absolute',
            left: 0,
            top: 0,
            boxShadow: '1px 1px 5px 0 #72b7e4'
        })
        $body.append($progress)

        _Loading.prototype.getProgress = function () {
            return $progress
        }
        _Loading.prototype.start = function () {
            _Loading.prototype.reset();
            $progress.show().css({
                width: $(window).width()
            });
        }
        _Loading.prototype.reset = function () {
            $progress.css({
                transition: proTransition,
                width: 0
            })
        }
        _Loading.prototype.stop = function () {
            $progress.css({
                transition: '1s width',
                width: $progress.width()
            });
        }
        _Loading.prototype.finish = function () {
            _Loading.prototype.stop();
            $progress.css('width',$(window).width());
            if (!timer) {
                timer = setTimeout(function () {
                    timer = null;
                    $progress.css({
                        transition: '0s',
                        width: 0
                    });
                },1000)
            }
        }
        _Loading.prototype.destroy = function () {
            $progress.remove();
            $progress = null;
        }

    }

    // 浏览器历史跳转
    window.addEventListener("popstate", function() {
        var container = history.state ;
        var url = document.location.hash.substr(1);

        if (url) {
            $(container).load(url);
        }else{
            if (sessionStorage.getItem('loadPageFirst')) {
                container = sessionStorage.getItem('loadPageFirst');
            }else{
                container = 'body'
            }
            $(container).empty();
        }
    });


    // 暴露的公共方法
    $.fn.loadFinished = function (call_back) {
        var thisDom = $(this)[0];
        _initBigOrder(thisDom);
        thisDom._bigOrder.loadFinishedEvents.push(call_back);
    }

    $.fn.loadPage = function(OPTS, call_back) {
        var container = $(this);
        var DEFAULT = {
            history: true,
            loadingEffect: true,
            cache: true
        }

        OPTS = $.extend({},DEFAULT,OPTS);


        _initBigOrder(container[0]);

        if (OPTS.history) {
            if (container[0].localName !== 'body') {
                if (!container.attr('id')) {
                    container.attr('id',  OPTS.url)
                }
                if (!sessionStorage.getItem('loadPageFirst')) {
                    sessionStorage.setItem('loadPageFirst','#'+container.attr('id'));
                }
                history.pushState('#' + container.attr('id'), '', '#'+ OPTS.url);
            }else{
                history.pushState('body', '', '#'+ OPTS.url);
            }
        }

        // 开启 loading
        if (OPTS.loadingEffect) {
            $.loading.start()
        }

        $.ajax({
        	url: OPTS.url,
            type: 'GET',
        	dataType: 'html',
            cache: OPTS.cache
        })
        .done(function(data) {
            if (container[0].localName === 'body') {
                container.children().not($.loading.getProgress()).remove();
                container.prepend(data)
            }else{
                container.html(data);
            }

            // 每次加载完执行编译
            _compile();

            // 关闭 loading
            if (OPTS.loadingEffect) {
                $.loading.finish();
            }

            if (typeof call_back === 'function') {
                call_back();
            }

            // 运行绑定在元素上的回调
            container[0]._bigOrder.loadFinished();
        })
        .fail(function() {
            console.warn('页面载入失败！');
        });

        return container;
    }

    $(function() {

        if (!$.loading) {
            $.loading = new _Loading();
        }

        _compile();
    })
})($)
