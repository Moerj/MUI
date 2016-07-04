# 微信前端框架

https://github.com/Moerj/WeUI
  
  
## 依赖
导入 jQuery 或者 Zepto
  
## 集成
- [WeUI](https://github.com/weui/weui/wiki)
- [jquery-weui](http://lihongxun945.github.io/jquery-weui)
- [swiper](http://www.swiper.com.cn/)
  
  
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
```
  
  
## 指令库
  
### jq-include
ajax 方式请求一个页面，并放入在该容器中
```html
<!-- somePage页面将会以 ajax 方式加进来 -->
<jq-include src="./somePage.html"></jq-include>
```
  
  
## 公共方法  

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
  
### loadFinish
目标容器使用 loadPage 或者指令方式加载完数据后的回调
```javascript
$('body').loadFinish(function () {
    // loadPage 完成，执行的代码
})
```
  
  
## 其他

### 点击事件优化
移动端请直接使用 click 事件，不需要用 touch 事件了
