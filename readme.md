# 微信前端框架

https://github.com/Moerj/WeUI
  
  
## 依赖
导入 jQuery 或者 Zepto
  
## 集成
- [WeUI 微信UI](https://github.com/weui/weui/wiki)
- [jquery-weui 微信UI的封装组件库](http://lihongxun945.github.io/jquery-weui)
- [swiper 幻灯片组件](http://www.swiper.com.cn/)
- 其他组件会在这里更新地址
  
  
## 工程目录
用于存放开发时的代码
```javascript
./src/
    js/     //支持 es6语法
    less/   //存放 less
```
  
  
## 运行目录
部署项目所需的代码部分
```javascript
./dist/
    css/    //编译后的 css
    js/     //编译、压缩后的 js 文件会自动生成在这里
    lib/    //存放第三方依赖文件
    pages/  //存放 html 页面
    images/ //存放图片
```
  
  
## 指令库
  
### jq-include 引入页面
ajax 方式请求一个页面，并放入在该容器中
```html
<!-- somePage页面将会以 ajax 方式加进来 -->
<jq-include src="./somePage.html"></jq-include>
```

### jq-router 路由容器
用于存放 ajax 页面的路由容器，整个浏览器窗口只能有一个jq-router，多余的将会被忽略。  
  
__用途：__  
呈现ajax页面的容器，主要用于首次载入页面用于显示地址栏#xxx.html部分的数据，如果页面上没有路由容器，则首次加载忽略路由地址。

```html
<!-- 把 loadPage 方法请求的数据塞入这里 -->
<jq-router></jq-router>
```
__提示：__  
如果你需要出示加载一个页面时有多个容器呈现其他 ajax 页面数据时，请使用 jq-include 指令。  
jq-router 指令仅仅是用来首次加载时呈现 loadPage 方式请求的页面数据。
  
  
## 公共方法  

### loadPage 加载页面
ajax 方式加载页面到容器中
```javascript
// 在一个 div 容器中加载页面
$('div').loadPage({
    url: 'url string',  //请求地址，必须
    history: true,  //是否写入浏览器历史，默认 true
    progress: true,    //是否加载时显示进度条，默认 true
    cache: true,    //是否开启缓存，默认 true
    async: true     //是否异步，默认 true
})
```
  
### loadFinish 加载页面后的回调
目标容器使用 loadPage 或者指令方式加载完数据后的回调
```javascript
$('div').loadFinish(function () {
    // loadPage 完成，执行的代码
})
```
  
### $.progressBar 操作进度条
顶部的进度条，页面加载时会自动执行。(注意：除非你有其他用途，通常进度条并不需要你去手动操作)
```javascript
$.progressBar
.star()             //进度条开始
.stop()             //暂停
.reset()            //重置进度条 0%
.finish()           //走完进度条 100%
.setColor('color')  //设置进度条颜色
```
  
## 其他

### 点击事件优化
移动端也请直接使用 click 事件，不需要用 touch 事件了

### 支持 ajax 载入页面的 js 运行
用过淘宝SUI Mobile的同学应该知道，他们也提供了前端静态路由功能，但是不能运行 ajxa 页面上的 js  
本框架的 jQloader 库提供这项功能。并随着版本更新，会逐渐完善。  
关于 jQloader 库，我会另开一个项目，感兴趣的同学请关注我的 github
