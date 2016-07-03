'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * jQloader v0.0.1
 * @license: MIT
 * Designed and built by Moer
 * github   ...
 */

(function ($) {
    'use strict';

    // 加载时页面顶部进度条

    var _Loading = function () {
        function _Loading() {
            _classCallCheck(this, _Loading);

            this.color = '#58a2d1';
            this.transition = '10s width';
            this.timer = null;
            this.$progress = $('<span></span>');
            this.reset();
            $('html').append(this.$progress);
        }

        _createClass(_Loading, [{
            key: 'reset',
            value: function reset() {
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
        }, {
            key: 'getMax',
            value: function getMax() {
                return document.body.clientWidth;
            }
        }, {
            key: 'getProgress',
            value: function getProgress() {
                return this.$progress;
            }
        }, {
            key: 'setColor',
            value: function setColor(color) {
                if (typeof color === 'string') {
                    this.color = color;
                }
            }
        }, {
            key: 'start',
            value: function start() {
                this.reset();
                this.$progress.css({
                    width: this.getMax()
                });
            }
        }, {
            key: 'stop',
            value: function stop() {
                this.$progress.css({
                    width: this.$progress.width()
                });
            }
        }, {
            key: 'finish',
            value: function finish() {
                var _this = this;

                this.stop();
                this.$progress.css({
                    width: this.getMax(),
                    transition: '0.5s width'
                });
                if (!this.timer) {
                    this.timer = setTimeout(function () {
                        _this.timer = null;
                        _this.$progress.css({
                            transition: '0s',
                            width: 0
                        });
                    }, 1000);
                }
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.$progress.remove();
                this.$progress = null;
            }
        }]);

        return _Loading;
    }();

    // 初始化 dom 对象下的命名空间，用于存放数据


    function _initNamespace(dom) {
        if (dom._jQloader === undefined) {
            dom._jQloader = {};
        }
        if (dom._jQloader.loadFinishEvents === undefined) {
            dom._jQloader.loadFinishEvents = [];
        }
        if (dom._jQloader.loadFinish === undefined) {
            dom._jQloader.loadFinish = function () {
                var events = dom._jQloader.loadFinishEvents;
                for (var i = 0; i < events.length; i++) {
                    events[i]();
                }
            };
        }
    }

    // 编译当前页面 html 标签上的 loadPage 指令
    function _compile() {
        var include = $('jq-include');

        var _loop = function _loop(i) {
            var $include = $(include[i]);
            var url = $include.attr('src');
            var $container = $('<div></div>');
            $include.replaceWith($container);
            $container.loadPage({
                url: url,
                history: false
            }, function () {
                $container.children().eq(0).unwrap();
            });
        };

        for (var i = 0; i < include.length; i++) {
            _loop(i);
        }
    }

    // 浏览器历史跳转
    window.addEventListener("popstate", function () {
        var container = history.state;
        var url = document.location.hash.substr(1);

        if (url) {
            $(container).load(url);
        } else {
            container = sessionStorage.getItem('loadPageFirst') || 'body';
            $(container).empty();
        }
    });

    // 暴露的公共方法 ==============================
    // dom使用 loadPage 加载完后的回调
    $.fn.loadFinish = function (call_back) {
        var container = $(this);
        container[0]._jQloader.loadFinishEvents.push(call_back);
        return container;
    };

    $.fn.loadPage = function (OPTS, call_back) {
        var container = $(this);
        var DEFAULT = {
            history: true,
            loadingEffect: true,
            cache: true,
            async: true
        };

        OPTS = $.extend({}, DEFAULT, OPTS);

        _initNamespace(container[0]);

        if (OPTS.history) {
            if (container[0].localName !== 'body') {
                if (!container.attr('id')) {
                    container.attr('id', OPTS.url);
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
            $.loading.start();
        }

        $.ajax({
            dataType: 'html',
            url: OPTS.url,
            cache: OPTS.cache,
            async: OPTS.async,
            timeout: 10000,
            success: function success(data) {

                container.html(data);

                // 解决Zepto ajxa 请求到的页面 script 标签执行问题
                if (typeof Zepto != 'undefined' && typeof jQuery == 'undefined') {
                    var script = container.find('script');
                    for (var i = 0; i < script.length; i++) {
                        var src = script[i].src;
                        if (src) {
                            // Zepto不会运行外联script
                            $.get(src);
                        } else {
                            // Zepto会执行两次页面的内联script
                            $(script[i]).remove();
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
            error: function error() {
                console.warn('页面载入失败！');
            },
            complete: function complete() {
                if (call_back) {
                    call_back();
                }
            }
        });

        return container;
    };

    // 初始化调用
    $(function () {

        if (!$.loading) {
            $.loading = new _Loading();
        }

        _compile();
    });
})($);