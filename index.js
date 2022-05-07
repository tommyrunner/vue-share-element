let shareElement = {
  /**
   * 入口
   * @param {Object} Vue Vue对象
   * @param {Object} options
   *  duration：动画过渡时间
   *  zIndex：共享元素层级
   */
  install: function (Vue, options) {
    let _options = Object.assign({ duration: 600, zIndex: 20001 }, options);
    let el = null,
      shareEl = null;
    function* _updateShareView(shareEl, el) {
      if (!shareEl || !el) return;
      // 初始化
      yield () => {
        shareEl.style.position = "fixed";
        shareEl.style.zIndex = _options.zIndex;
        shareEl.style.top = `${shareEl.offsetTop}px`;
        shareEl.style.left = `${shareEl.offsetLeft}px`;
        shareEl.style.width = `${shareEl.offsetWidth}px`;
        shareEl.style.height = `${shareEl.offsetHeight}px`;
        shareEl.style.transition = `${_options.duration / 1000}s`;
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
          window.shareElementObj[shareKey] = null;
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
        let shareEl = this.$refs.share;
        shareEl && shareEl.getAttribute("share-key") && this._saveShareNowElement(shareEl);
      },
      mounted() {
        this._$shareElementCall();
      },
      methods: {
        async _$shareElementCall() {
          // 当前界面元素
          el = this.$refs.share;
          // 共享元素
          shareEl = this._getShareNowElement(el);
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
        _saveShareNowElement(el) {
          if (!el) return;
          let shareKey = el.getAttribute("share-key");
          // 处理保存样式
          window.shareElementObj = { [shareKey]: el };
        },
        _getShareNowElement(el) {
          if (!el) return;
          let shareKey = el.getAttribute("share-key");
          let shareEl = window.shareElementObj && window.shareElementObj[shareKey];
          return shareEl;
        },
      },
    });
  },
};
module.exports = shareElement;
