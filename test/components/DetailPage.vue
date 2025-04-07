<template>
  <div class="detail-container">
    <VueShareElement ref="shareElementRef">
      <div class="detail-card">
        <h2>{{ currentItem ? currentItem.title : "加载中..." }}</h2>
        <p>{{ currentItem ? currentItem.description : "" }}</p>
        <div class="item-content">
          <p>这是详情页的内容，展示从列表页共享元素动画过渡的效果。</p>
          <p>您可以添加更多内容在这里。</p>
        </div>
        <button class="btn" @click="goBack">返回列表</button>
      </div>
    </VueShareElement>
  </div>
</template>

<script lang="ts" setup>
/**
 * 详情页组件
 * @description 使用VueShareElement接收共享元素并显示详情
 */
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import VueShareElement from "../../src/index";

// 路由信息
const route = useRoute();
const router = useRouter();

// 共享元素引用
const shareElementRef = ref<InstanceType<typeof VueShareElement>>();

// 模拟数据
const items = [
  {
    id: 1,
    title: "项目1",
    description: "这是项目1的详细信息",
  },
  {
    id: 2,
    title: "项目2",
    description: "这是项目2的详细信息",
  },
  {
    id: 3,
    title: "项目3",
    description: "这是项目3的详细信息",
  },
  {
    id: 4,
    title: "项目4",
    description: "这是项目4的详细信息",
  },
];

// 获取当前项ID
const currentId = computed(() => Number(route.params.id));

// 获取当前项数据
const currentItem = computed(() => items.find((item) => item.id === currentId.value));

// 添加生命周期钩子
onMounted(() => {
  // 设置动画结束回调
  shareElementRef.value?.setHooks(() => {
    console.log("动画结束");
  });
});

/**
 * 返回列表页
 */
function goBack() {
  router.back();
}
</script>

<style scoped>
.item-content {
  margin: 20px 0;
  text-align: left;
}
.btn {
  margin-top: 16px;
}
</style>
