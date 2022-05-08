let shareElement = {
  /**
   * 入口
   * @param {Object} Vue Vue对象
   * @param {Object} options
   *  duration：动画过渡时间
   *  zIndex：共享元素层级
   */
  install: function (Vue, options) {
    // 配置参数
    let _options = Object.assign({ duration: 600, zIndex: 20001 }, options);
    // el：当前元素,shareEl：共享元素,mulClick：防抖
    let el = null,
      shareEl = null,
      mulClick = null;
    /**
     * 共享元素动画生成器
     * @param {HTMLElement} shareEl 共享元素
     * @param {HTMLElement} el 当前元素
     * @returns
     */
    function* _updateShareView(shareEl, el) {
      if (!shareEl || !el) return;
      // 初始化shareEl
      yield () => {
        shareEl.style.position = "fixed";
        shareEl.style.zIndex = _options.zIndex;
        shareEl.style.top = `${shareEl.offsetTop}px`;
        shareEl.style.left = `${shareEl.offsetLeft}px`;
        shareEl.style.width = `${shareEl.offsetWidth}px`;
        shareEl.style.height = `${shareEl.offsetHeight}px`;
        shareEl.style.transition = `${_options.duration / 1000}s`;
        shareEl.style.transition = `${_options.duration / 1000}s`;
        shareEl.style.margin = 0;
        shareEl.style.padding = 0;
        document.body.appendChild(shareEl);
      };
      // 过渡1-隐藏当前元素
      yield () => {
        el.style.opacity = "0";
      };
      // 过渡2-异步移动共享元素
      yield new Promise((res) => {
        setTimeout(() => {
          shareEl.style.width = `${el.offsetWidth}px`;
          shareEl.style.height = `${el.offsetHeight}px`;
          shareEl.style.top = `${el.offsetTop}px`;
          shareEl.style.left = `${el.offsetLeft}px`;
          res();
        }, 1);
      });
      // 过渡3-最后显示当前元素，并清空共享元素
      yield new Promise((res) => {
        setTimeout(() => {
          el.style.opacity = "1";
          shareKey = el.getAttribute("share-key");
          Vue.$shareElementObj[shareKey] = null;
          document.body.removeChild(shareEl);
          res();
        }, _options.duration);
      });
    }
    // 校验参数
    function isOptions(options) {
      if (!options.duration || typeof options.duration !== "number" || options.duration < 1) return "duration is error,duration >= 1";
      if (!options.zIndex || typeof options.duration !== "number") return "zIndex is error";
      return false;
    }
    Vue.mixin({
      // router-view 动画
      components: {
        shareElement: () => import("./share-element.vue"),
      },
      // beforeDestroy 保存共享组件
      beforeDestroy() {
        // 防止多次调用
        if (!mulClick) {
          let shareEl = this.$refs.share instanceof Array ? this.$refs.share[0] : this.$refs.share;
          if (!shareEl) Vue.$shareElementObj = null;
          else shareEl.getAttribute("share-key") && this._$saveShareNowElement(shareEl);
          mulClick = new Date().getTime();
        }
      },
      mounted() {
        mulClick = null;
        this._$shareElementCall();
      },
      methods: {
        // 动画 call
        _$shareElementCall() {
          // 兼容多对一
          if (this.$refs["shares"]) {
            this._$returnSharesPoinit();
            return;
          } else {
            // 当前界面元素
            el = this.$refs.share instanceof Array ? this.$refs.share[0] : this.$refs.share;
            // 共享元素
            shareEl = this._$getShareNowElement(el);
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
        },
        _$saveShareNowElement(el) {
          if (!el) return;
          let shareKey = el.getAttribute("share-key");
          // 处理保存样式
          Vue.$shareElementObj = { [shareKey]: el };
        },
        _$getShareNowElement(el) {
          if (!el) return;
          let shareKey = el.getAttribute("share-key");
          let shareEl = Vue.$shareElementObj && Vue.$shareElementObj[shareKey];
          Vue.$shareElRefIndex = (shareEl && shareEl.getAttribute("ref-index")) || -1;
          return shareEl;
        },
        _$returnSharesPoinit() {
          // 如果有父容器，并是多对一模式,重新定位
          if (this.$refs["shares"] && Vue.$shareElRefIndex && Vue.$shareElRefIndex !== -1) {
            this.$refs["share"] = this.$refs["shares"].children[Vue.$shareElRefIndex];
            // 当前界面元素
            el = this.$refs.share instanceof Array ? this.$refs.share[0] : this.$refs.share;
            // 共享元素
            shareEl = this._$getShareNowElement(el);
            this._$updateShareViewCall();
            Vue.$shareElRefIndex = -1;
          }
        },
      },
    });
  },
};
module.exports = shareElement;
