'use strict';

/**
 * 挂载初始资源 css、js
 */

(function () {
    var head = document.getElementsByTagName('head')[0];

    function createStyle(url) {
        var tag = document.createElement('link');
        tag.setAttribute('rel', 'stylesheet');
        tag.setAttribute('href', url);

        // 插入节点到 head 顶端
        head.insertBefore(tag, head.children[0]);
    }

    function loadScript(url) {
        $.ajax({
            url: url,
            dataType: 'script',
            sync: false,
            cache: true
        });
    }

    // 创建公共样式 注意insertBefore插入到 head 中的是倒序
    createStyle('lib/jquery-weui/jquery-weui.min.css'); //2
    createStyle('//res.wx.qq.com/open/libs/weui/0.4.2/weui.css'); //优先1

    if (!window.$) {
        console.error('init.js load failed, you need insert jQuery or Zepto first!');
    } else {
        // 公共脚本
        loadScript('lib/jquery-weui/jquery-weui.min.js');
        loadScript('//cdn.bootcss.com/Swiper/3.3.1/js/swiper.min.js');
        loadScript('lib/jquery-weui/city-picker.min.js');
        loadScript('js/bese.js');
    }
})();