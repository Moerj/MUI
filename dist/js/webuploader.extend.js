'use strict';

/**
 * webuploaer.extend v0.0.1
 * webuploaer百度上传组件 UI 交互封装
 * @license: MIT
 * Designed and built by Moer
 * github   ...
 */

(function () {
    'use strict';

    $.fn.webuploader = function (OPTS) {
        // 创建 dom 结构
        var $contanier = $('<div class="webuploaer">' + '<div class="uploader-list">' + '<div class="uploader-pick"></div>' + '</div>' + '<div class="uploader-control">' + '<div class="uploader-submit">上传</div>' + '<div class="uploader-clearlist">清空</div>' + '<div class="uploader-retry">重试</div>' + '</div>' + '</div>');

        // 上传图片回显容器
        var $list = $contanier.find('.uploader-list');
        var $pick = $contanier.find('.uploader-pick');
        var $ctrl = $contanier.find('.uploader-control');
        var $submit = $ctrl.find('.uploader-submit');
        var $clearlist = $ctrl.find('.uploader-clearlist');
        var $retry = $ctrl.find('.uploader-retry');

        $(this).append($contanier);

        var DEFAULT = {
            size: 80,
            auto: false,
            server: undefined
        };

        OPTS = $.extend({}, DEFAULT, OPTS);

        // 自动上传时隐藏控制按钮
        if (OPTS.auto) {
            $submit.remove();
            $clearlist.remove();
        }

        // 初始化Web Uploader
        var uploader = WebUploader.create({

            // 选完文件后，是否自动上传。
            auto: OPTS.auto,

            // 文件接收服务端。
            // server: 'http://webuploader.duapp.com/server/fileupload.php',
            server: OPTS.server,

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: $pick,

            // 只允许选择图片文件。
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            }
        });

        // 当有文件添加进来的时候
        uploader.on('fileQueued', function (file) {
            var $li = $('<div id="' + file.id + '" class="file-item thumbnail">' + '<img>' + '<div class="info">' + file.name + '</div>' + '</div>'),
                $img = $li.find('img');

            // $list为容器jQuery实例
            $list.prepend($li);

            // 创建缩略图
            // 如果为非图片文件，可以不用调用此方法。
            // thumbnailWidth x thumbnailHeight 为 100 x 100
            uploader.makeThumb(file, function (error, src) {
                if (error) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }

                $img.attr('src', src);
            }, OPTS.size, OPTS.size);

            _resetCtrlButton();
        });

        // 文件上传过程中创建进度条实时显示。
        uploader.on('uploadProgress', function (file, percentage) {
            var $li = $('#' + file.id),
                $percent = $li.find('.progress span');

            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<p class="progress"><span></span></p>').appendTo($li).find('span');
            }

            $percent.css('width', percentage * 100 + '%');
        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.on('uploadSuccess', function (file) {
            var $li = $('#' + file.id),
                $error = $li.find('div.error');

            $li.addClass('upload-state-done');

            // 避免重复创建
            if (!$error.length) {
                $error = $('<div class="success"></div>').appendTo($li);
            }

            $error.text('上传成功');
            $li.find('.error,.info').hide();
        });

        // 文件上传失败，显示上传出错。
        uploader.on('uploadError', function (file) {
            var $li = $('#' + file.id),
                $error = $li.find('div.error');

            // 避免重复创建
            if (!$error.length) {
                $error = $('<div class="error"></div>').appendTo($li);
            }

            $error.text('上传失败');

            // 隐藏文件名信息
            $li.find('.info').hide();

            _resetCtrlButton();
        });

        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.on('uploadComplete', function (file) {
            $('#' + file.id).find('.progress').remove();
        });

        // 文件被移除队列
        uploader.on('fileDequeued', function (file) {
            // 销毁 dom
            $('#' + file.id).remove();

            _resetCtrlButton();
        });

        // 重置控制区域的按钮状态
        function _resetCtrlButton() {
            var initedFiles = uploader.getFiles('inited');
            var errorFiles = uploader.getFiles('error');

            if (initedFiles.length) {
                $submit.show();
                $clearlist.show();
            } else {
                $submit.hide();
                $clearlist.hide();
            }

            if (errorFiles.length) {
                $retry.show();
            } else {
                $retry.hide();
            }
        }

        // 文件上传按钮
        $submit.on('click', function () {
            uploader.upload();
        });

        // 清空正常状态的文件队列
        $clearlist.on('click', function () {
            var files = uploader.getFiles('inited');
            for (var i = 0; i < files.length; i++) {
                uploader.removeFile(files[i], true);
            }
        });

        // 重试上传失败的文件
        $retry.on('click', function () {
            uploader.retry();
            $retry.hide();
        });
    };
})();