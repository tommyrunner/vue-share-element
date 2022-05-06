let shareElement = {
  /**
   * 入口
   * @param {*} Vue Vue对象
   * @param {*} options
   *  duration：动画过渡时间
   *  zIndex：共享元素层级
   */
  install: function (Vue, options) {
    let _options = Object.assign({ duration: 600, zIndex: 20001 }, options);
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
        el.style.transition = `${_options.duration / 1000}s`;
        el.style.opacity = "0";
        document.body.appendChild(shareEl);
      };
      // 过渡
      yield new Promise((res) => {
        setTimeout(() => {
          shareEl.style.width = `${el.offsetWidth}px`;
          shareEl.style.height = `${el.offsetHeight}px`;
          shareEl.style.top = `${el.offsetTop}px`;
          shareEl.style.left = `${el.offsetLeft}px`;
          el.style.opacity = "1";
          res();
        }, 1);
      });
      // 清空
      yield new Promise((res) => {
        setTimeout(() => {
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
      // destroyed 保存共享组件
      destroyed() {
        this._saveShareNowElement(document.getElementById("share"));
      },
      mounted() {
        this._$shareElementCall();
      },
      methods: {
        async _$shareElementCall() {
          // 当前界面元素
          let el = this.$refs.share;
          // 共享元素
          let shareEl = this._getShareNowElement(el);
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
          await _$updateShareView.next().value;
          await _$updateShareView.next().value;
        },
        _saveShareNowElement(el) {
          if (!el) return;
          let shareKey = el.getAttribute("share-key");
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
