/**
 * webuploaer.extend v0.0.6
 * webuploaer百度上传组件 UI 交互封装
 * @license: MIT
 * Designed and built by Moer
 * github   ...
 */

(function() {
    'use strict';

    $.fn.webuploader = function(OPTS) {
        // 创建 dom 结构
        let $contanier = $('<div class="webuploaer">' +
                                '<div class="uploader-list">' +
                                    '<div class="uploader-pick">+</div>' +
                                '</div>' +
                                '<div class="uploader-control">' +
                                    '<div class="uploader-submit">上传</div>' +
                                    '<div class="uploader-clearlist">取消</div>' +
                                    '<div class="uploader-retry">重试</div>' +
                                '</div>' +
                            '</div>')

        // 上传图片回显容器
        let $list = $contanier.find('.uploader-list')
        let $pick = $contanier.find('.uploader-pick')
        let $ctrl = $contanier.find('.uploader-control')
        let $submit = $ctrl.find('.uploader-submit')
        let $clearlist = $ctrl.find('.uploader-clearlist')
        let $retry = $ctrl.find('.uploader-retry')

        // 重置控制区域的按钮状态
        function _resetCtrlButton() {
            let initedFiles = uploader.getFiles('inited');
            let errorFiles = uploader.getFiles('error');

            if (initedFiles.length) {
                $submit.show()
                $clearlist.show()
            }else{
                $submit.hide()
                $clearlist.hide()
            }

            if (errorFiles.length) {
                $retry.show()
            }else{
                $retry.hide()
            }
        }

        // 检查 dom 来获取已存在的上传文件
        function _getFilesNum() {
            return $list.find('.file-item').length;
        }

        $(this).append($contanier);

        let DEFAULT = {
            size: 80,
            auto: false,
            server: undefined,
            fileNumLimit: 50,
            compress: {},
        }

        OPTS = $.extend({}, DEFAULT, OPTS);


        // 自动上传时隐藏控制按钮
        if (OPTS.auto) {
            $submit.remove();
            $clearlist.remove();
        }

        // 设置pick尺寸
        $pick.css({
            width: OPTS.size,
            height: OPTS.size
        })


        // 初始化Web Uploader
        let uploader = WebUploader.create({

            // 选完文件后，是否自动上传。
            auto: OPTS.auto,

            // 文件接收服务端。
            // server: 'http://webuploader.duapp.com/server/fileupload.php',
            server: OPTS.server,

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: $pick,

            // 文件个数限制
            fileNumLimit: OPTS.fileNumLimit,

            // 压缩配置
            compress: OPTS.compress,

            // 只允许选择图片文件。
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            }
        });

        // 当最大文件数限制为1时，将上传按钮改为单选
        if (OPTS.fileNumLimit===1) {
            setTimeout(function () {
                $contanier.find('input[type=file]').removeAttr('multiple')
            })
        }


        // 当有文件添加进来的时候
        uploader.on('fileQueued', function(file) {
            let $li = $(
                    '<div id="' + file.id + '" class="file-item thumbnail">' +
                    '<img>' +
                    '<div class="info">' + file.name + '</div>' +
                    '<i class="file-remove"></i>' +
                    '</div>'
                ),
                $img = $li.find('img'),
                $remove = $li.find('.file-remove');

            // 设置尺寸
            $li.css({
                width: OPTS.size,
                height: OPTS.size
            })


            // $list为容器jQuery实例
            $list.append($li).append($pick);


            // 创建缩略图
            // 如果为非图片文件，可以不用调用此方法。
            // thumbnailWidth x thumbnailHeight 为 100 x 100
            uploader.makeThumb(file, function(error, src) {
                if (error) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }

                $img.attr('src', src);
            }, OPTS.size, OPTS.size);

            // 当上传文件数超过限制，隐藏添加按钮
            if (_getFilesNum() >= OPTS.fileNumLimit) {
                $pick.hide()
            }

            // 删除图片按钮事件
            $remove.on('click',function (e) {
                e.stopPropagation();
                uploader.removeFile( file, true );
                _resetCtrlButton();
            })

            _resetCtrlButton();
        });


        // 文件上传过程中创建进度条实时显示。
        uploader.on('uploadProgress', function(file, percentage) {
            let $li = $('#' + file.id),
                $percent = $li.find('.progress span');

            // 避免重复创建
            if (!$percent.length) {
                // 创建进度条
                $percent = $('<p class="progress"><span></span></p>')
                    .appendTo($li)
                    .find('span');

                // 隐藏文件信息
                let $info = $li.find('.info');
                $info.hide();
            }

            let num = percentage * 100 + '%';
            $percent.css('width', num).text(num);
        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.on('uploadSuccess', function(file, response) {
            let $li = $('#' + file.id),
                $success = $li.find('div.success');

            $li.addClass('upload-state-done');

            // 避免重复创建
            if (!$success.length) {
                $success = $('<div class="success"></div>').appendTo($li);
            }

            $success.text('上传成功');

            $li.find('.error,.info,.file-remove').remove();

            _resetCtrlButton();

            // 运行封装回调
            if (OPTS.uploadSuccess) {
                OPTS.uploadSuccess(file, response);
            }
        });

        // 文件上传失败，显示上传出错。
        uploader.on('uploadError', function(file, reason) {
            let $li = $('#' + file.id),
                $error = $li.find('div.error');

            // 避免重复创建
            if (!$error.length) {
                $error = $('<div class="error"></div>').appendTo($li);
            }

            $error.text('上传失败');

            // 隐藏文件名信息
            $li.find('.info').hide();

            _resetCtrlButton();

            // 运行封装回调
            if (OPTS.uploadError) {
                OPTS.uploadError(file, reason);
            }
        });

        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.on('uploadComplete', function(file) {
            $('#' + file.id).find('.progress').remove();
        });



        // 文件被移除队列
        uploader.on('fileDequeued',function (file) {
            // 销毁 dom
            $('#'+ file.id).remove();

            _resetCtrlButton();
        })


        // 文件上传按钮
        $submit.on('click',function () {
            uploader.upload();
        })

        // 清空正常状态的文件队列
        $clearlist.on('click',function () {
            let files = uploader.getFiles('inited','error');
            for (var i = 0; i < files.length; i++) {
                uploader.removeFile( files[i], true )
            }

            // 上传文件数未超过限制，显示添加按钮
            $pick.show();
        })

        // 重试上传失败的文件
        $retry.on('click',function () {
            let errorFiles = uploader.getFiles('error');
            for (var i = 0; i < errorFiles.length; i++) {
                uploader.upload(errorFiles[i]);
            }
            $retry.hide();
        })

        // PC端缩略图上的删除按钮显示/隐藏
        if ('ontouchend' in document.body == false) {
            $list.on('mouseenter','.file-item',function () {
                var $remove = $(this).find('.file-remove');
                $remove.show()
            }).on('mouseleave','.file-item',function () {
                var $remove = $(this).find('.file-remove');
                $remove.hide()
            })
        }
    }

})()
