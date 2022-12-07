# vue-share-element（已兼容Vue3 + ts）

## 简介

+ 实例

![VueShareElement](https://img-blog.csdnimg.cn/4cb09f56aec64fe78212b6aab07115aa.png#pic_center)

+ 效果

![csdn](https://img-blog.csdnimg.cn/4f3944b991ea457aa95e487a7d90230a.gif#pic_center)

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
    <VueShareElementVue>
      <button @click="$router.push('/user')">pageA</button>
    </VueShareElementVue>
  </template>
  <script lang="ts" setup>
  import VueShareElementVue from "vue-share-element/VueShareElement.vue";
  </script>
  ```

+ B页面 (pageB)

  ```vue
  <template>
    <VueShareElementVue>
      <button @click="$router.go(-1)">pageB</button>
    </VueShareElementVue>
  </template>
  <script lang="ts" setup>
  import VueShareElementVue from "vue-share-element/VueShareElement.vue";
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
  <VueShareElementVue @click="toPage" class="list" ref="shareElementRef">
      <img v-for="item in list" :key="item" :share="item" :data-src="item" :src="item" />
      </VueShareElementVue>
  </template>
  <script lang="ts" setup>
      import { onMounted, ref } from "vue";
      import { useRouter } from "vue-router";
      import VueShareElementVue from "vue-share-element/VueShareElement.vue";
      const router = useRouter();
      const shareElementRef = ref<InstanceType<typeof VueShareElementVue>>();
      const list = [
          "https:xxxx",
          "https:xxxx",
          "https:xxxx",
          "https:xxxx",
          "https:xxxx",
      ];
      onMounted(() => {
          // 动画结束钩子
          shareElementRef.value?.setHooks(() => {
              console.log("结束");
          });
      });
      /*
      	为了更好记录共享元素，多对一情况下需要父容器代理事件
      	通过 子元素 data- 传递数据
      */
      function toPage(params: DOMStringMap) {
            if (params.src) 
              router.push({ path: "/pageB", query: { img: encodeURIComponent(params.src) } });
      }
  </script>
  <style scoped>
      .list {
          display: flex;
      }
      .list img {
          width: 100px;
          height: 50px;
          margin: 12px;
          cursor: pointer;
      }
  </style>
  
  ```

+ B页面 (pageB)

  ```vue
  <template>
    <div class="page-b">
      <VueShareElementVue>
        <img :src="src" @click="$router.go(-1)" />
      </VueShareElementVue>
      <span>图片信息</span>
    </div>
  </template>
  <script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import VueShareElementVue from "vue-share-element/VueShareElement.vue";
  let src = ref("");
  const route = useRoute();
  onMounted(() => {
    let url = route.query.img as string;
    src.value = decodeURIComponent(url);
  });
  </script>
  <style scoped>
  .page-b {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .page-b img {
    width: 300px;
    height: 200px;
  }
  </style>
  
  ```

> 注意：
>
> 1. 接收界面是**异步渲染**的情况下，需要提前定型(**提前设置好元素宽高**)
> 2. 注意 **share** 是唯一的，相当于v-key，进行**记录触发共享元素key**

## props属性

+ delay：设置动画延迟时间(默认:0.62秒)
+ zIndex: 设置动画层级(默认:2001)

## emit函数

+ setHooks(Function):添加生命周期

## 附

+ 1.x.x:兼容vue2，文档根据版本README
+ 2.x.x:兼容vue3，文档根据版本README
+ 3.x.x:兼容vue3+ts
