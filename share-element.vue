<template>
  <transition name="start">
    <slot />
  </transition>
</template>
<script>
export default {
  name: "ShareElement",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>
<style lang="scss">
// 默认router-view动画(默认淡出)
.start-enter-active,
.start-leave-active {
  will-change: transform;
  transition: all 600ms;
  position: absolute;
}
.start-enter {
  opacity: 0;
}
.start-leave-active {
  opacity: 0;
}
</style>
