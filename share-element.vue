<template>
  <transition :name="startTypes.includes(startType) ? startType : startTypes[0]">
    <slot />
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
  data() {
    return {
      startTypes: ["start-def", "start-top"],
    };
  },

  mounted() {},

  methods: {},
};
</script>
<style lang="scss">
// 默认router-view动画(默认淡出)
.start-def-enter-active,
.start-def-leave-active,
.start-top-enter-active,
.start-top-leave-active {
  will-change: transform;
  transition: all 600ms;
  position: absolute;
}
.start-def-enter {
  opacity: 0;
}
.start-def-leave-active {
  opacity: 0;
}
.start-top-enter {
  opacity: 0;
  transform: translateY(50%);
}
.start-top-leave-active {
  opacity: 0;
  transform: translateY(50%);
}
</style>
