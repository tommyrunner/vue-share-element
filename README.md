# vue-share-element

## 安装
```shell
npm install vue-share-element
```

## 引用

```js
import shareElement from "vue-share-element";
Vue.use(shareElement);
// 自定义参数 Vue.use(shareElement,{ duration: 600, zIndex: 20001 });
```

> + duration：过渡动画时间，默认600
> + zIndex：共享元素层级，默认20001

## 使用

+ router-view

```vue
<share-element startType="start-def">
    <router-view></router-view>
</share-element>
```

> + 包裹 **router-view** 使 路由跳转 增加动画。
>
> + **startType** 是 **router-view** 跳转动画类型:
>   + start-def：淡入淡出(默认)
>   + start-top：上下浮动

## 设置共享元素

+ 页面1  元素设置 

  ```vue
  <tag  share-key="home" ref="share"/>
  // $router.push('/page2')
  ```

+ 页面2  元素设置 

  ```vue
  <tag  share-key="home" ref="share"/>
  // $router.push('/page1')||$router.go(-1)
  ```

## 附

+ tag元素建议设置 宽高，例如img。
