"use strict";!function(){$.fn.webuploader=function(i){function e(){var i=u.getFiles("inited"),e=u.getFiles("error");i.length?(t.show(),a.show()):(t.hide(),a.hide()),e.length?l.show():l.hide()}function d(){return o.find(".file-item").length}var n=$('<div class="webuploaer"><div class="uploader-list"><div class="uploader-pick">+</div></div><div class="uploader-control"><div class="uploader-submit">上传</div><div class="uploader-clearlist">取消</div><div class="uploader-retry">重试</div></div></div>'),o=n.find(".uploader-list"),s=n.find(".uploader-pick"),r=n.find(".uploader-control"),t=r.find(".uploader-submit"),a=r.find(".uploader-clearlist"),l=r.find(".uploader-retry");$(this).append(n);var p={size:80,auto:!1,server:void 0,fileNumLimit:50,compress:{}};i=$.extend({},p,i),i.auto&&(t.remove(),a.remove()),s.css({width:i.size,height:i.size});var u=WebUploader.create({auto:i.auto,server:i.server,pick:s,fileNumLimit:i.fileNumLimit,compress:i.compress,accept:{title:"Images",extensions:"gif,jpg,jpeg,bmp,png",mimeTypes:"image/*"}});1===i.fileNumLimit&&setTimeout(function(){n.find("input[type=file]").removeAttr("multiple")}),u.on("fileQueued",function(n){var r=$('<div id="'+n.id+'" class="file-item thumbnail"><img><div class="info">'+n.name+"</div></div>"),t=r.find("img");r.css({width:i.size,height:i.size}),o.append(r).append(s),u.makeThumb(n,function(i,e){return i?void t.replaceWith("<span>不能预览</span>"):void t.attr("src",e)},i.size,i.size),d()>=i.fileNumLimit&&s.hide(),e()}),u.on("uploadProgress",function(i,e){var d=$("#"+i.id),n=d.find(".progress span");if(!n.length){n=$('<p class="progress"><span></span></p>').appendTo(d).find("span");var o=d.find(".info");o.hide()}var s=100*e+"%";n.css("width",s).text(s)}),u.on("uploadSuccess",function(i){var d=$("#"+i.id),n=d.find("div.success");d.addClass("upload-state-done"),n.length||(n=$('<div class="success"></div>').appendTo(d)),n.text("上传成功"),d.find(".error,.info").hide(),e()}),u.on("uploadError",function(i){var d=$("#"+i.id),n=d.find("div.error");n.length||(n=$('<div class="error"></div>').appendTo(d)),n.text("上传失败"),d.find(".info").hide(),e()}),u.on("uploadComplete",function(i){$("#"+i.id).find(".progress").remove()}),u.on("fileDequeued",function(i){$("#"+i.id).remove(),e()}),t.on("click",function(){u.upload()}),a.on("click",function(){for(var i=u.getFiles("inited","error"),e=0;e<i.length;e++)u.removeFile(i[e],!0);s.show()}),l.on("click",function(){for(var i=u.getFiles("error"),e=0;e<i.length;e++)u.upload(i[e]);l.hide()})}}();