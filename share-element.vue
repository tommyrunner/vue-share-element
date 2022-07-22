<template>
  <transition :name="startTypes.includes(startType) ? startType : startTypes[0]">
    <!-- vue3.0:当使用 <transition> 作为根结点的组件从外部被切换时将不再触发过渡效果 -->
    <div v-if="isVue3">
      <slot />
    </div>
    <slot v-else />
  </transition>
</template>
<script>
export default {
  name: "ShareElement",
  props: {
    startType: {
      type: String,
      default: "start-def",
    },
  },
  computed: {
    isVue3() {
      return !!this.$ && !!this._;
    },
  },
  data() {
    return {
      startTypes: ["start-def", "start-top"],
    };
  },

  mounted() {},

  methods: {},
};
</script>
<style>
/* 默认router-view动画 */
.start-def-enter-active,
.start-def-leave-active,
.start-top-enter-active,
.start-top-leave-active {
  will-change: transform;
  transition: all 600ms;
  position: absolute;
}
/* start-def 进入前 */
.start-def-enter {
  opacity: 0;
}
/* start-def 进入后 */
.start-def-enter-to {
  opacity: 1;
}
/* start-def 离开前 */
.start-def-leave {
  opacity: 0;
}
/* start-def 离开后 */
.start-def-leave-to {
  opacity: 1;
}
/* start-top 进入前 */
.start-top-enter {
  opacity: 0;
  transform: translateY(50%);
}
/* start-top 进入后 */
.start-top-enter-to {
  opacity: 1;
  transform: translateY(0%);
}
/* start-top 离开前 */
.start-top-leave {
  opacity: 0;
  transform: translateY(50%);
}
/* start-top 离开后 */
.start-top-leave-to {
  opacity: 1;
  transform: translateY(0%);
}
</style>
