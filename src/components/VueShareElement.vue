<template>
  <div class="vue-share-element" ref="elPraRef" @click="getShareElement">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup name="VueShareElement">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { setElementStyle } from "../utils";
import type { WindowType, AttributesType, HooksType, EmitType, PropsType } from "../types";

const elPraRef = ref<HTMLDivElement>();
let $window: WindowType = window;
const props = withDefaults(defineProps<PropsType>(), {
  delay: 0.62,
  zIndex: 2001,
});
const $emit = defineEmits<EmitType>();
let $shareElement: HTMLElement | null = null;

/**
 * 钩子函数
 */
let _$hooks: HooksType = {
  onEnd: () => {},
  onStart: () => {},
};

// 克隆元素ID
const CLONE_ID = "_$shareElement";

onBeforeUnmount(() => {
  let els = elPraRef.value?.children;
  if (els && els.length > 0) {
    // 默认选择第一个元素作为共享元素，或使用已选中的元素
    let el = $shareElement || els[0];
    let cloneElement: HTMLElement = el.cloneNode(true) as HTMLElement;
    // 获取元素屏幕信息
    let boundingData = el.getBoundingClientRect();
    // 标记为共享状态（设置共享元素ID）
    cloneElement.id = CLONE_ID;
    // 初始化共享元素样式
    setElementStyle(cloneElement, {
      position: "fixed",
      overflow: "hidden",
      margin: "0px",
      zIndex: props.zIndex,
      top: `${boundingData.top}px`,
      left: `${boundingData.left}px`,
      width: `${boundingData.width}px`,
      height: `${boundingData.height}px`,
      transition: `${props.delay}s`,
    });
    // 当子元素数量大于1时，记录父容器滚动状态
    if (els.length > 1) {
      $window._$scrollTop = elPraRef.value?.scrollTop;
      $window._$scrollLeft = elPraRef.value?.scrollLeft;
    }
    // 记录需要共享的元素
    $window._$clone = cloneElement;
  }
});
onMounted(() => {
  // 标记克隆元素以防止当前页面上的重复动画
  if ($window._$flag === $window.location.href) {
    return;
  }
  $window._$flag = $window.location.href;
  // 仅在存在实际的shareElement元素时创建
  const cloneElement = $window._$clone;
  if (cloneElement) {
    document.body.append(cloneElement);
  }
  // 判断当前状态（获取共享元素ID）
  let _$shareDoc = document.getElementById(CLONE_ID);
  if (_$shareDoc) {
    // 共享并获取子元素
    let els = [...(elPraRef.value?.children || [])] as HTMLElement[];
    if (els && els.length > 0) {
      // 判断多对一的情况：查找共享记录的DOM
      if (els.length > 1) {
        let findShareElement = els.find((e: HTMLElement) => {
          let attributes: AttributesType = e.attributes;
          return $window._$share && attributes.share && attributes.share.value === $window._$share;
        });
        if (findShareElement) $shareElement = findShareElement;
        // 搜索记录后清除上次的记录
        $window._$share = undefined;
      }
      let el = $shareElement || els[0];
      let boundingData = el.getBoundingClientRect();
      setElementStyle(el, {
        opacity: 0,
      });
      // 执行共享操作
      console.log($window._$scrollLeft, boundingData.left, els.length);
      setElementStyle(_$shareDoc, {
        opacity: 1,
        top: `${els.length > 1 && $window._$scrollTop ? boundingData.top - $window._$scrollTop : boundingData.top}px`,
        left: `${els.length > 1 && $window._$scrollLeft ? boundingData.left - $window._$scrollLeft : boundingData.left}px`,
        width: `${boundingData.width}px`,
        height: `${boundingData.height}px`,
      });
      // 设置返回记录的滚动位置
      if (elPraRef.value) {
        elPraRef.value.scrollTop = $window._$scrollTop || 0;
        // 异步处理滚动问题
        setTimeout(() => {
          if (elPraRef.value) {
            elPraRef.value.scrollBy({
              top: $window._$scrollTop || 0,
              left: $window._$scrollLeft || 0,
              behavior: "smooth",
            });
          }
        });
      }
      // 清理
      let domTimeId = setTimeout(() => {
        if (_$shareDoc) {
          setElementStyle(_$shareDoc, {
            opacity: 0,
          });
          setElementStyle(el, {
            opacity: 1,
          });
          _$shareDoc.remove();
        }
        // 调用钩子：共享结束
        _$hooks.onEnd && _$hooks.onEnd();
        clearTimeout(domTimeId);
      }, props.delay * 1000);
    }
  } else {
    // 删除已创建的元素
    console.warn("VueShareElement:接收器未找到！");
  }
});
function getShareElement(e: MouseEvent) {
  let el = e.target as HTMLElement;
  if (el) {
    $shareElement = el;
    // 多对一的情况：记录上次触发的元素
    let elPra: HTMLElement | null | ParentNode = el;
    while (elPra !== null && elPra.parentNode !== elPraRef.value) {
      elPra = elPra.parentNode;
    }
    /**
     * 通过点击元素获取顶层子元素中的share属性
     * （解决嵌套子组件无法获取share属性的问题）
     */
    let attributes: AttributesType = (elPra as HTMLElement).attributes;
    if (!$window._$share && attributes && attributes.share) {
      $window._$share = attributes.share.value;
    }
  }
  // 由于点击事件被代理，需要抛出参数
  $emit("toPage", el);
}
/**
 * 生命周期
 * @param end 共享动画结束后调用
 */
function setHooks(end: Function) {
  _$hooks.onEnd = end;
}
// 暴露钩子
defineExpose({
  setHooks,
});
</script>
<style lang="scss" scoped></style>
