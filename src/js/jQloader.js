/**
 * jQloader v0.0.1
 * @license: MIT
 * Designed and built by Moer
 * github   ...
 */

(($) => {
    'use strict';

    // 加载时页面顶部进度条
    class _Loading {
        constructor() {
            this.color = '#58a2d1';
            this.transition = '10s width';
            this.timer = null;
            this.$progress = $('<span></span>');
            this.reset();
            $('html').append(this.$progress);
        }
        reset() {
            this.$progress.css({
                backgroundColor: this.color,
                transition: this.transition,
                height: '2px',
                width: 0,
                position: 'fixed',
                left: 0,
                top: 0,
                boxShadow: '1px 1px 2px 0 ' + this.color
            });
        }
        getMax() {
            return document.body.clientWidth
        }
        getProgress() {
            return this.$progress
        }
        setColor(color) {
            if (typeof color === 'string') {
                this.color = color;
            }
        }
        start() {
            this.reset();
            this.$progress.css({
                width: this.getMax()
            });
        }
        stop() {
            this.$progress.css({
                width: this.$progress.width()
            });
        }
        finish() {
            this.stop();
            this.$progress.css({
                width: this.getMax(),
                transition: '0.5s width'
            });
            if (!this.timer) {
                this.timer = setTimeout(() => {
                    this.timer = null;
                    this.$progress.css({
                        transition: '0s',
                        width: 0
                    });
                }, 1000)
            }
        }
        destroy() {
            this.$progress.remove();
            this.$progress = null;
        }
    }


    // 初始化 dom 对象下的命名空间，用于存放数据
    function _initNamespace(dom) {
        if (dom._jQloader === undefined) {
            dom._jQloader = {}
        }
        if (dom._jQloader.loadFinishEvents === undefined) {
            dom._jQloader.loadFinishEvents = []
        }
        if (dom._jQloader.loadFinish === undefined) {
            dom._jQloader.loadFinish = () => {
                let events = dom._jQloader.loadFinishEvents;
                for (let i = 0; i < events.length; i++) {
                    events[i]();
                }
            }
        }
    }

    // 编译当前页面 html 标签上的 loadPage 指令
    function _compile() {
        let include = $('jq-include');

        for (let i = 0; i < include.length; i++) {
            let $include = $(include[i]);
            let url = $include.attr('src')
            let $container = $('<div></div>')
            $include.replaceWith($container);
            $container.loadPage({
                url: url,
                history: false
            }, () => {
                $container.children().eq(0).unwrap();
            })
        }

    }


    // 浏览器历史跳转
    window.addEventListener("popstate", () => {
        let container = history.state;
        let url = document.location.hash.substr(1);

        if (url) {
            $(container).load(url);
        } else {
            container = sessionStorage.getItem('loadPageFirst') || 'body';
            $(container).empty();
        }
    });


    // 暴露的公共方法 ==============================
    // dom使用 loadPage 加载完后的回调
    $.fn.loadFinish = function(call_back) {
        let container = $(this);
        container[0]._jQloader.loadFinishEvents.push(call_back);
        return container
    }

    $.fn.loadPage = function(OPTS, call_back) {
        let container = $(this);
        let DEFAULT = {
            history: true,
            loadingEffect: true,
            cache: true,
            async: true
        }

        OPTS = $.extend({}, DEFAULT, OPTS);


        _initNamespace(container[0]);

        if (OPTS.history) {
            if (container[0].localName !== 'body') {
                if (!container.attr('id')) {
                    container.attr('id', OPTS.url)
                }
                if (!sessionStorage.getItem('loadPageFirst')) {
                    sessionStorage.setItem('loadPageFirst', '#' + container.attr('id'));
                }
                history.pushState('#' + container.attr('id'), '', '#' + OPTS.url);
            } else {
                history.pushState('body', '', '#' + OPTS.url);
            }
        }

        // 开启 loading
        if (OPTS.loadingEffect) {
            $.loading.start()
        }

        $.ajax({
            dataType: 'html',
            url: OPTS.url,
            cache: OPTS.cache,
            async: OPTS.async,
            timeout: 10000,
            success: (data) => {

                container.html(data);

                // 解决Zepto ajxa 请求到的页面 script 标签执行问题
                if (typeof Zepto != 'undefined' && typeof jQuery == 'undefined') {
                    let script = container.find('script');
                    for (let i = 0; i < script.length; i++) {
                        let src = script[i].src;
                        if (src) {
                            // Zepto不会运行外联script
                            $.get(src)
                        } else {
                            // Zepto会执行两次页面的内联script
                            $(script[i]).remove()
                        }
                    }
                }

                // 每次加载完执行编译
                _compile();

                // 关闭 loading
                if (OPTS.loadingEffect) {
                    $.loading.finish();
                }

                // 运行绑定在元素上的回调
                container[0]._jQloader.loadFinish();
            },
            error: () => {
                console.warn('页面载入失败！');
            },
            complete: () => {
                if (call_back) {
                    call_back();
                }
            }
        })

        return container;
    }

    // 初始化调用
    $(() => {

        if (!$.loading) {
            $.loading = new _Loading();
        }

        _compile();
    })
})($)
