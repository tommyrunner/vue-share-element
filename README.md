# vue-share-element（已兼容Vue3 + ts）

## 更新

+ 优化父容器滚动情况
+ 优化vue组件嵌套问题

## 简介

+ 实例

![VueShareElement](https://img-blog.csdnimg.cn/4cb09f56aec64fe78212b6aab07115aa.png#pic_center)

+ 效果

![csdn](https://img-blog.csdnimg.cn/direct/28784f4abf4749e3b8060bcc96a7822e.gif)

> + vue-share-element基于vue的单界面路由**动画跳转**插件。
>
> + 使用 **共享元素的方式** 给路由跳转增加动画。

## 安装

```shell
npm install vue-share-element
```

## 一对一情况

+ A页面 (pageA)

  ```vue
  <template>
    <VueShareElement>
      <button @click="$router.push('/home2')">pageA</button>
    </VueShareElement>
  </template>
  <script lang="ts" setup>
  import VueShareElement from "vue-share-element";
  </script>
  ```

+ B页面 (pageB)

  ```vue
  <template>
    <VueShareElement>
      <button @click="$router.go(-1)">pageB</button>
    </VueShareElement>
  </template>
  <script lang="ts" setup>
  import VueShareElement from "vue-share-element";
  </script>
  <style scoped>
  /* 为了显示动画效果 */
  button {
    position: absolute;
    bottom: 10px;
  }
  </style>
  ```

> 注意：
>
> 1. 一对一代表：push界面只包含**一个子元素**
>
> 2. **接收界面**的元素无论什么情况下，**只能含一个**

## 多对一情况

+ A页面 (pageA)

  ```vue
  <template>
    <VueShareElement class="list" ref="shareElementRef" @toPage="onToPage">
      <div v-for="item in 10" :key="item" :share="item" class="box">
        {{ item }}
      </div>
    </VueShareElement>
  </template>
  <script lang="ts" setup>
  import { useRouter } from "vue-router";
  import VueShareElement from "vue-share-element";
  const router = useRouter();
  function onToPage(el: HTMLElement) {
    console.log(el);
    router.push({ path: "/home2" });
  }
  </script>
  <style scoped>
  .list {
    display: flex;
    width: 800px;
    height: 200px;
    overflow: auto;
    margin: 24px;
  }
  .box {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    box-shadow: 1px 1px 5px rgba(128, 128, 128, 0.614);
    margin: 10px;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  </style>
  ```

+ B页面 (pageB)

  ```vue
  <template>
    <VueShareElement>
      <div class="box" @click="$router.go(-1)">返回</div>
    </VueShareElement>
  </template>
  <script lang="ts" setup>
  import VueShareElement from "vue-share-element";
  </script>
  <style scoped>
  .box {
    width: 60px;
    height: 60px;
    text-align: center;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 50%;
    left: 50%;
    border-radius: 12px;
    box-shadow: 1px 1px 5px rgba(128, 128, 128, 0.614);
    margin: 10px;
    cursor: pointer;
  }
  </style>
  
  ```

> 注意：
>
> 1. 接收界面是**异步渲染**的情况下，需要提前定型(**提前设置好元素宽高**)
> 2. 注意 **share** 是唯一的，相当于v-key，进行**记录触发共享元素key**
> 3. *如果在数据多出现**滚动条情况下**,滚动条一定在父容器上，如果是**body**或**更上级挤出来的滚动条**，位置会计算问题 (**解决**:限制**VueShareElementVue**的宽高，让滚动条在**VueShareElementVue**上，**VueShareElementVue**会**自动计算位置**)。
>
> ```css
> {
>     width: 100px;
>     height: 300px;
>     overflow: auto;
> }
> ```
>
> 4. 同一个界面中不能出现**多个共享元素组件**。
> 5. 暂时共享元素与目标元素只有**位置与宽高的过度**，其他动画还需开发。

## props属性

+ delay：设置动画延迟时间(默认:0.62秒)
+ zIndex: 设置动画层级(默认:2001)
+ 子元素属性:
  + share: 唯一标识


## emit函数

+ setHooks(end:Function):添加生命周期

## 附

+ 1.x.x:兼容vue2，文档根据版本README
+ 2.x.x:兼容vue3，文档根据版本README
+ 3.x.x:兼容vue3+ts
