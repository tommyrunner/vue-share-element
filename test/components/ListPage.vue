<template>
  <div class="card">
    <h2>列表页</h2>
    <VueShareElement class="list-container" ref="shareElementRef" @toPage="onToPage">
      <div v-for="item in items" :key="item.id" :share="item.id" class="list-item">
        <h3>{{ item.title }}</h3>
      </div>
    </VueShareElement>
  </div>
</template>

<script lang="ts" setup>
/**
 * 列表页组件
 * @description 使用VueShareElement展示列表，点击后共享元素动画过渡到详情页
 */
import { ref } from "vue";
import { useRouter } from "vue-router";
import VueShareElement from "../../src/index";

// 路由
const router = useRouter();

// 共享元素引用
const shareElementRef = ref<InstanceType<typeof VueShareElement>>();

// 列表数据
const items = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `项目${i + 1}`,
    description: `这是项目${i + 1}的描述信息`,
  }))
);

/**
 * 处理页面跳转
 * @param el 点击的元素
 */
function onToPage(el: HTMLElement) {
  // 获取当前项ID
  const item = items.value.find((item) => {
    const parentEl = el.closest(`[share="${item.id}"]`);
    return parentEl !== null;
  });

  if (item) {
    // 跳转到详情页
    router.push(`/detail/${item.id}`);
  }
}
</script>
<style scoped>
.list-container {
  display: flex;
  flex-wrap: nowrap;
  overflow: auto;
  gap: 12px;
  padding: 12px;
}
.list-item {
  flex: 0 0 auto;
  width: 100px;
  background-color: #f0f0f0;
}
</style>
