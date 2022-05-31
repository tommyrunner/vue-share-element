# vue-share-element

## 简介

![csdn](https://img-blog.csdnimg.cn/4f3944b991ea457aa95e487a7d90230a.gif#pic_center)

> + vue-share-element基于vue的单界面路由**动画跳转**插件。
>
> + 使用 **共享元素的方式** 给路由跳转增加动画。

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

## 设置共享元素（一对一）

+ 页面1  元素设置 

  ```vue
  <tag  share-key="share-tag" ref="share"/>
  // $router.push('/page2')
  ```

+ 页面2  元素设置 

  ```vue
  <tag  share-key="share-tag" ref="share"/>
  // $router.push('/page1')||$router.go(-1)
  ```

> + share-key：**共享元素key**与**当前元素key**一致（必须）
> + ref：必须为share，便 vue-share-element 查找（必须）

## 设置共享元素（多对一）

+ 页面1  元素设置 

  ```vue
  <template>
  <!-- 事件代理 shares标记多对一-->
  <div  @click="toPage" ref="shares">
      <tag v-for="(item, index) in shareList" :key="index" :ref-index="index" share-key="share-tag"/>
      </div>
  </template>
  <script>
      export default {
          data() {
              return {
                  shareList: [],
              };
          },
          methods: {
              // 事件代理 将点击的element 动态设置share
              toPage(e) {
                  if (el.nodeName.toUpperCase() === "TAG") {
                      this.$refs["share"] = e.target;
                      // $router.push('/page2')
                  }
              },
          },
      };
  ```

+ 页面2  元素设置 

  ```vue
  <tag  share-key="share-tag" ref="share"/>
  // $router.push('/page1')||$router.go(-1)
  ```

> + shares：标记列表中多个share。（必须）
> + :ref-index="index"  ：该属性用于 vue-share-element 找到触发定位（必须并固定是下标index）
> + share-key：**共享元素key**与**当前元素key**一致（必须）
> + 注意跳转界面前主动将 this.$refs["share"] **动态设置**触发的元素

## 附

+ tag 元素建议设置 宽高，例如img。
+ 如果父容器加了Padding有动画闪动，父容器需加上 box-sizing: border-box;
+ 共享元素的tag标签不能是vue的根元素，需要包裹。
