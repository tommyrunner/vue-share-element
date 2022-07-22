import ShareElement from "./share-element.vue";
let shareElement = {
  /**
   * 入口
   * @param {Object} Vue Vue对象
   * @param {Object} options
   *  duration：动画过渡时间
   *  zIndex：共享元素层级
   */
  install: function (Vue, options) {
    // 全局引用界面动画组件
    Vue.component('ShareElement',ShareElement)
    // 配置参数 duration：动画时间，zIndex共享元素：层级,shareRefName：自定义共享元素ref名，sharesRefName：自定义共享元素集合ref名
    let _options = Object.assign({ duration: 600, zIndex: 20001, shareRefName: "share", sharesRefName: "shares" }, options);
    // el：当前元素,_shareType:share类型，_hooks:钩子，_$HooksName钩子抛变量，shareEl：共享元素,mulClick：防抖
    let el = null,
      shareEl = null,
      shareElConfig = null,
      _shareType,
      _hooks = {},
      _$HooksName = "$shareHooks",
      mulClick = null;
    /**
     * 共享元素动画生成器
     * @param {HTMLElement} shareEl 共享元素
     * @param {HTMLElement} el 当前元素
     * @returns
     */
    function* _updateShareView(shareEl, el) {
      if (!shareEl || !el) return;
      callHooks("beforeStart");
      /**
       * share共享元素使用窗口定位
       * shareElConfig 兼容vue3.0
       *  vue3.0中获取getBoundingClientRect有延迟，需要再添加时保存getBoundingClientRect值
       */
      let shareElRect = shareElConfig || shareEl.getBoundingClientRect();
      // let elRect = el.getBoundingClientRect();
      // 初始化shareEl
      yield () => {
        callHooks("start");
        // 集中修改防止多次重排
        shareEl.style.cssText = `
       position: fixed;
       zIndex: _options.zIndex;
       top: ${shareElRect.top}px;
       left: ${shareElRect.left}px;
       width: ${(shareElConfig && shareElConfig.offsetWidth) || shareEl.offsetWidth}px;
       height: ${(shareElConfig && shareElConfig.offsetHeight) || shareEl.offsetHeight}px;
       transition:${_options.duration / 1000}s;
       overflow: hidden;
       margin: 0;
       padding: 0;
       `;
        document.body.appendChild(shareEl);
      };
      // 过渡1-隐藏当前元素
      yield () => {
        // 当前元素不能有过渡效果
        el.style.transition = "none";
        el.style.opacity = "0";
      };
      // 过渡2-异步移动共享元素
      yield new Promise((res) => {
        setTimeout(() => {
          // 替换新的改变值
          let cssTexts = shareEl.style.cssText.split(";");
          cssTexts = cssTexts.map((c) => {
            if (c.indexOf("top:") > -1) {
              return `top: ${el.offsetTop - ((_shareType === _options.sharesRefName && Vue.$sharesScrollTop) || 0)}px`;
            }
            if (c.indexOf("left:") > -1) {
              return `left:${el.offsetLeft - ((_shareType === _options.sharesRefName && Vue.$sharesScrollLeft) || 0)}px`;
            }
            if (c.indexOf("width:") > -1) {
              return `width:${el.offsetWidth}px`;
            }
            if (c.indexOf("height:") > -1) {
              return `height:${el.offsetHeight}px`;
            }
            return c;
          });
          shareEl.style.cssText = cssTexts.join(";");
          res();
        }, 1);
        callHooks("beforeEnd");
      });
      // 过渡3-最后显示当前元素，并清空共享元素
      yield new Promise((res) => {
        setTimeout(() => {
          el.style.opacity = "1";
          let shareKey = el.getAttribute("share-key");
          // 清空配置
          Vue.$shareElementObj && (Vue.$shareElementObj[shareKey] = null);
          Vue.$shareElementConfig && (Vue.$shareElementConfig[shareKey] = null);
          shareElConfig = null;
          if (shareEl.parentNode && shareEl.parentNode === document.body) document.body.removeChild(shareEl);
          res();
        }, _options.duration);
      });
    }
    Vue.mixin({
      // beforeDestroy 保存共享组件
      beforeDestroy() {
        _$beforeDestroy(this);
      },
      // 兼容vue3重命名beforeDestroy
      beforeUnmount() {
        _$beforeDestroy(this);
      },
      beforeCreate() {
        // hook 事件接收
        initShareHooks(this);
      },
      mounted() {
        this.$nextTick(() => {
          addShareHooks(this);
          mulClick = null;
          this._$shareElementCall();
        });
      },
      methods: {
        // 动画 call
        _$shareElementCall() {
          // 兼容多对一
          let $refs = _$getRefs(this);
          if ($refs[_options.sharesRefName]) {
            _$returnSharesPoinit(this);
            _shareType = _options.sharesRefName;
            $refs[_options.sharesRefName].addEventListener("scroll", _$saveSharesScroll);
          } else {
            _shareType = _options.shareRefName;
            // 当前界面元素
            el = $refs[_options.shareRefName] instanceof Array ? $refs[_options.shareRefName][0] : $refs[_options.shareRefName];
            // 共享元素
            shareEl = _$getShareNowElement(el);
            this._$updateShareViewCall();
          }
        },
        async _$updateShareViewCall() {
          if (!shareEl || !el) return;
          // 参数校验
          let isMessage = isOptions(_options);
          if (isMessage) {
            console.warn(isMessage);
            return;
          }
          let _$updateShareView = _updateShareView(shareEl, el);
          // 1.初始化
          _$updateShareView.next().value();
          _$updateShareView.next().value();
          await _$updateShareView.next().value;
          await _$updateShareView.next().value;
          callHooks("end");
        },
      },
    });
    // 校验参数
    function isOptions(options) {
      if (!options.duration || typeof options.duration !== "number" || options.duration < 1) return "duration is error,duration >= 1";
      if (!options.zIndex || typeof options.duration !== "number") return "zIndex is error";
      return false;
    }
    function _$saveShareNowElement(el) {
      if (!el) return;
      let shareKey = el.getAttribute("share-key");
      // 处理保存样式
      Vue.$shareElementObj = { [shareKey]: el };
      /**
       * 兼容vue3.0
       * 获取getBoundingClientRect有延迟，需要离开界面时就保存对应值
       */
      Vue.$shareElementConfig = { [shareKey]: Object.assign(el.getBoundingClientRect(), { offsetWidth: el.offsetWidth, offsetHeight: el.offsetHeight }) };
    }

    function _$getShareNowElement(el) {
      if (!el) return;
      let shareKey = el.getAttribute("share-key");
      let shareEl = Vue.$shareElementObj && Vue.$shareElementObj[shareKey];
      shareElConfig = Vue.$shareElementConfig && Vue.$shareElementConfig[shareKey];
      Vue.$shareElRefIndex = (shareEl && shareEl.getAttribute("ref-index")) || -1;
      return shareEl;
    }

    function _$beforeDestroy($vue) {
      // 防止多次调用
      if (!mulClick) {
        let shareEl = $vue.$refs[_options.shareRefName] instanceof Array ? $vue.$refs[_options.shareRefName][0] : $vue.$refs[_options.shareRefName];
        if (!shareEl) Vue.$shareElementObj = null;
        else shareEl.getAttribute("share-key") && _$saveShareNowElement(shareEl);
        mulClick = new Date().getTime();
        // 清理事件
        let $refs = _$getRefs($vue);
        $refs && $refs[_options.sharesRefName] && $refs[_options.sharesRefName].removeEventListener("scroll", _$saveSharesScroll);
      }
    }
    /**
     * 如果有父容器，并是多对一模式,重新定位
     */
    function _$returnSharesPoinit($vue) {
      let $refs = _$getRefs($vue);
      if ($refs[_options.sharesRefName] && Vue.$shareElRefIndex && Vue.$shareElRefIndex !== -1) {
        $refs[_options.shareRefName] = $refs[_options.sharesRefName].children[Vue.$shareElRefIndex];
        // 滚动定位
        $refs[_options.sharesRefName].scrollTop = Vue.$sharesScrollTop;
        $refs[_options.sharesRefName].scrollLeft = Vue.$sharesScrollLeft;
        // 当前界面元素
        el = $refs[_options.shareRefName] instanceof Array ? $refs[_options.shareRefName][0] : $refs[_options.shareRefName];
        // 共享元素
        shareEl = _$getShareNowElement(el);
        $vue._$updateShareViewCall();
        Vue.$shareElRefIndex = -1;
      }
    }
    function _$saveSharesScroll() {
      Vue.$sharesScrollTop = this.scrollTop;
      Vue.$sharesScrollLeft = this.scrollLeft;
    }
    function _$getRefs($vue) {
      /**
       * 兼容vue3.0
       *  vue3.0不能直接获取this.$refs，但可以this.$.refs获取
       */
      return !$vue.$ ? $vue.$refs : $vue.$.refs;
    }
    // ---- hooks
    function initShareHooks($vue) {
      if (!$vue[_$HooksName]) _hooks = $vue[_$HooksName] = { beforeStart: () => {}, start: () => {}, beforeEnd: () => {}, end: () => {} };
    }
    function addShareHooks($vue) {
      if (getDataType($vue[_$HooksName]) === "object") {
        Object.keys($vue[_$HooksName]).forEach((key) => {
          if (getDataType($vue[_$HooksName][key]) === "function") {
            _hooks[key] = $vue[_$HooksName][key];
          }
        });
      }
    }
    function callHooks(event) {
      _hooks[event] && _hooks[event]();
    }
    // ---- utils
    function getDataType(data) {
      return String(Object.prototype.toString.call(data).split(" ")[1].split("]")[0]).toLowerCase();
    }
  },
};
export default shareElement;
