/**
 * jQloader v0.0.1
 * @license: MIT
 * Designed and built by Moer
 * github   ...
 */

(($) => {
    'use strict';

    // 加载时页面顶部进度条
    class ProgressBar {
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
                transition: 'none',
                height: '2px',
                width: 0,
                position: 'fixed',
                left: 0,
                top: 0,
                boxShadow: '1px 1px 2px 0 ' + this.color
            });
        }
        max() {
            return document.body.clientWidth
        }
        setColor(color) {
            if (typeof color === 'string') {
                this.color = color;
            }
        }
        start() {
            this.reset();
            this.$progress.css({
                width: this.max(),
                transition: this.transition
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
                width: this.max(),
                transition: '0.5s width'
            });
            if (!this.timer) {
                this.timer = setTimeout(() => {
                    this.timer = null;
                    this.reset();
                }, 700)
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
            dom._jQloader = {}; //dom 上存放jQloader数据的命名空间
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
        let $loaders = $('jq-include');

        for (let i = 0; i < $loaders.length; i++) {
            let $loader = $($loaders[i]);
            let url = $loader.attr('src')
            let $container = $('<div></div>')
            $loader.replaceWith($container);
            $container.loadPage({
                url: url,
                history: false,
                progress: false
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
    // loadPage 加载完后的回调
    $.fn.loadFinish = function(call_back) {
        let container = $(this);
        container[0]._jQloader.loadFinishEvents.push(call_back);
        return container
    }

    // 加载一个页面
    $.fn.loadPage = function(OPTS, call_back) {
        let container = $(this);
        let DEFAULT = {
            history: true,
            progress: true,
            cache: true,
            async: true
        }

        OPTS = $.extend({}, DEFAULT, OPTS);

        // 初始化配置容器命名空间
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

        // 开启 loading 进度条
        if (OPTS.progress) $.progressBar.start();

        // 请求页面
        $.ajax({
            dataType: 'html',
            url: OPTS.url,
            cache: OPTS.cache,
            async: OPTS.async,
            timeout: 10000,
            success: (data) => {

                // 写入页面
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

                // 编译新页面上的指令
                _compile();

                // 运行容器上的回调方法组
                container[0]._jQloader.loadFinish();
            },
            error: () => {
                console.warn('页面载入失败！');
            },
            complete: () => {
                // 进度条结束
                if (OPTS.progress) $.progressBar.finish();
                if (call_back) call_back();
            }
        })

        return container;
    }

    // 创建进度条
    if (!$.progressBar) {
        $.progressBar = new ProgressBar();
    }

    // 初始化调用
    $(() => {
        _compile();
    })
})($)
