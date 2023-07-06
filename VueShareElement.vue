<template>
  <div class="vue-share-element" ref="elPraRef" @click="getShareElement">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
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
const CLONE_ID = "_$shareElement";
onBeforeUnmount(() => {
  let els = elPraRef.value.children;
  if (els && els.length > 0) {
    // By default,first element is selected the shared element and deeply cloned
    let el = $shareElement || els[0];
    let cloneElement: HTMLElement = el.cloneNode(true);
    // Get element screen information
    let boundingData = el.getBoundingClientRect();
    // mark as shareing state(set share element id)
    cloneElement.id = CLONE_ID;
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
    // Record the elements that need to be shared first
    $window._$clone = cloneElement;
  }
});
onMounted(() => {
  // Mark clone elements to prevent duplicate animations on the current page
  if ($window._$flag === $window.location.href) {
    return;
  }
  $window._$flag = $window.location.href;
  // Created only when there is a real shareElement element present
  const cloneElement = $window._$clone;
  if (cloneElement) {
    document.body.append(cloneElement);
  }
  // judge the current state(get shre element id)
  let _$shareDoc = document.getElementById(CLONE_ID);
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
          _$shareDoc.remove();
        }
        // call hook share end
        _$hooks.onEnd && _$hooks.onEnd();
        clearTimeout(domTimeId);
      }, props.delay * 1000);
    }
  } else {
    // Delete elements that have already been created
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
