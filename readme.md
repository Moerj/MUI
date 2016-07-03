# 微信前端框架

https://github.com/Moerj/WeUI
  
  
## 集成
- [WeUI](https://github.com/weui/weui/wiki)
- [jquery-weui](http://lihongxun945.github.io/jquery-weui)
- [swiper](http://www.swiper.com.cn/)
  
  
## 工程目录
用于存放开发时的代码
```javascript
./src/
    js/     //存放压缩前的 js
    less/   //存放 less
```
  
  
## 运行目录
部署项目所需的代码部分
```javascript
./dist/
    css/    //编译后的 css
    js/     //压缩后的 js 文件会自动生成在这里
    lib/    //存放第三方依赖文件
    pages/  //存放 html 页面
```
  
  
## bigOrder 指令库
  
### do-load
ajax 方式请求一个页面，并放入在该容器中
```html
<body do-load="./somePage.html">
    <!-- somePage页面将会以 ajax 方式加进来 -->
</body>
```
  
  
## jQuery 对象方法  

### loadPage
ajax 方式加载页面到容器中
```javascript
$('body').loadPage({
    url: 'string',  //请求地址
    history: true,  //是否写入浏览器历史，默认 true
    progress: true,    //是否加载时显示进度条，默认 true
    cache: true,    //是否开启缓存，默认 true
    async: true     //是否异步，默认 true
})
```
  
### loadFinished
目标容器使用 loadPage 或者指令方式加载完数据后的回调
```javascript
$('body').loadFinished(function () {
    // 执行你的代码
})
```
