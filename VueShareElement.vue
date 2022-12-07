<template>
  <div class="vue-share-element" ref="elPraRef" @click="getShareElement">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
/**
 * 流程:
 * 1.A界面标记离开并全局生成共享dom，
 * 2.进入B界面判断是否处于共享状态，
 * 3.设置更新dom位置,清除共享dom，更新完成并标记共享状态结束（本界面就成A界面）
 */
import { onBeforeUnmount, onMounted, ref } from "vue";
import { setElementStyle } from "./uitls";
import type { WindowType, AttributesType, HooksType } from "./types.d";
// Action Element
interface PropsType {
  delay?: number;
  zIndex?: number;
}
const elPraRef = ref();
let $window: WindowType = window;
const props = withDefaults(defineProps<PropsType>(), {
  delay: 0.62,
  zIndex: 2001,
});
const $emit = defineEmits(["click"]);
let $shareElement: HTMLElement | null = null;
// hooks
let _$hooks: HooksType = {
  onEnd: () => {},
  onStart: () => {},
};
onBeforeUnmount(() => {
  let els = elPraRef.value.children;
  if (els && els.length > 0) {
    // By default,first element is selected the shared element and deeply cloned
    let el = $shareElement || els[0];
    let cloneElement: HTMLElement = el.cloneNode(true);
    // Get element screen information
    let boundingData = el.getBoundingClientRect();
    // mark as shareing state(set share element id)
    cloneElement.id = "_$shareElement";
    // initialize share element styles
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
    // When then number is greater than 1 record parent container scroll
    if (els.length > 1) {
      $window._$scrollTop = elPraRef.value.scrollTop;
      $window._$scrollLeft = elPraRef.value.scrollLeft;
    }
    // add on the body
    document.body.append(cloneElement);
  }
});
onMounted(() => {
  // judge the current state(get shre element id)
  let _$shareDoc = document.getElementById("_$shareElement");
  if (_$shareDoc) {
    // shareing and get children element
    let els: Array<HTMLElement> = Array.from(elPraRef.value.children);
    if (els && els.length > 0) {
      // Judge the many to one situation: find the share record dom
      if (els.length > 1) {
        let findShareElement = els.find((e: HTMLElement) => {
          let attributes: AttributesType = e.attributes;
          return $window._$share && attributes.share && attributes.share.value === $window._$share;
        });
        if (findShareElement) $shareElement = findShareElement;
        // Clear the last record after searching the record
        $window._$share = undefined;
      }
      let el: HTMLElement = $shareElement || els[0];
      let boundingData = el.getBoundingClientRect();
      setElementStyle(el, {
        opacity: 0,
      });
      //   perform share actions
      setElementStyle(_$shareDoc, {
        opacity: 1,
        top: `${els.length > 1 && $window._$scrollTop ? boundingData.top - $window._$scrollTop : boundingData.top}px`,
        left: `${els.length > 1 && $window._$scrollLeft ? boundingData.left - $window._$scrollLeft : boundingData.left}px`,
        width: `${boundingData.width}px`,
        height: `${boundingData.height}px`,
      });
      // Set to return recorded scroll
      elPraRef.value.scrollTop = $window._$scrollTop;
      //  clear
      let domTimeId = setTimeout(() => {
        if (_$shareDoc) {
          setElementStyle(_$shareDoc, {
            opacity: 0,
          });
          setElementStyle(el, {
            opacity: 1,
          });
          _$shareDoc?.remove();
        }
        // call hook share end
        _$hooks.onEnd && _$hooks.onEnd();
        clearTimeout(domTimeId);
      }, props.delay * 1000);
    }
  } else {
    console.warn("VueShareElement:Receiver not found!");
  }
});
function getShareElement(e: MouseEvent) {
  let el = e.target as HTMLElement;
  if (el) {
    $shareElement = el;
    // In the case of many to one: record the element triggered last time
    let attributes: AttributesType = el.attributes;
    if (!$window._$share && attributes && attributes.share) {
      $window._$share = attributes.share.value;
    }
  }
  // Because the click event is proxied, the parameter needs to be thrown
  $emit("click", Object.assign(el.dataset) || {});
}
/**
 * life cycle
 * @param end Called after sharing animation ends
 */
function setHooks(end: Function) {
  _$hooks.onEnd = end;
}
// Throw hooks
defineExpose({
  setHooks,
});
</script>
<style lang="scss" scoped></style>
