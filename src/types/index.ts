/**
 * 元素属性类型
 * 扩展自NamedNodeMap，添加share属性支持
 */
export interface AttributesType extends NamedNodeMap {
  share?: {
    value: any;
  };
  row?: any;
}

/**
 * 扩展Window对象类型
 * 用于存储共享元素动画所需的临时数据
 */
export interface WindowType extends Window {
  _$flag?: string; // 当前页面URL标记，防止重复动画
  _$share?: any; // 共享元素标识
  _$clone?: HTMLElement; // 克隆的共享元素
  _$scrollTop?: number; // 滚动容器的垂直滚动位置
  _$scrollLeft?: number; // 滚动容器的水平滚动位置
  _$computedStyle?: Record<string, string>; // 完整的计算样式信息
  _$sourceHTML?: string; // 源元素的HTML内容
}

/**
 * 钩子函数类型
 */
export interface HooksType {
  onStart?: Function; // 动画开始钩子
  onEnd?: Function; // 动画结束钩子
}

/**
 * 事件类型
 */
export interface EmitType {
  (event: "toPage", el: HTMLElement): void;
}
/**
 * 组件属性类型
 */
export interface PropsType {
  delay?: number; // 动画延迟时间
  zIndex?: number; // 动画元素层级
}
