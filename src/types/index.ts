export interface AttributesType extends NamedNodeMap {
  share?: {
    value: any;
  };
  row?: any;
}
export interface WindowType extends Window {
  _$flag?: any;
  _$share?: any;
  _$clone?: HTMLElement;
  _$scrollTop?: number;
  _$scrollLeft?: number;
}

export interface HooksType {
  onStart?: Function;
  onEnd?: Function;
}
