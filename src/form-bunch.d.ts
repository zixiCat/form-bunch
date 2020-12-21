import React from 'react';

export interface IFormItemT {
  /** type of label alignment, default: right */
  labelAlign?: 'left' | 'right' | 'center';
  /** class of the formItem */
  className?: string;
  /** default value, you can also change `initial value of form API` to set the default value */
  defaultValue?: any;
  /** like flex-basic, it's the property of the formItem, default: 100% */
  col?: string;
  /** the length to offset space from the left, default: 0 */
  offset?: string;
  /** formItem label name */
  label?: string;
  /** formItem property */
  key: string;
  /** like flex-basic, it's the label's property of the formItem, default: 20% */
  labelCol?: string;
  /** like flex-basic, it's the control's property of the formItem, default: 80% */
  controlCol?: string;
  /** the message after failed to verify */
  error?: string;
  /** the way that trigger to verify, default: 'change' */
  trigger?: TTrigger;
  /** set formItem value to be required, default: false */
  required?: boolean;
  /** function that to verify the formItem value, it supports regex, when its return is string, the string will replace corresponding error tip */
  verify?: RegExp | ((value?: any, form?: IFormValue) => boolean | string);
  /** render type of formItem control, require that one and only one is provided between property [type] and [render] */
  render?: (value: any, setValue: (state: any) => void) => JSX.Element;
}

type TFormItems<T> = {
  [P in keyof TOriginTypeMap<T>]: RequireOnlyOne<
    {
      /** render type of formItem control, require that one and only one is provided between property [type] and [render] */
      type?: P;
      /** when use [type], then [typeProps] is its original props */
      typeProps?: TOriginTypeMap<T>[P];
    } & IFormItemT,
    'type' | 'render'
  >;
};

export interface IFormSetting {
  /** like flex-basic, it's the property of the formItem, default: 100% */
  col?: string;
  /** like flex-basic, it's the label's property of the formItem, default: 20% */
  labelCol?: string;
  /** like flex-basic, it's the control's property of the formItem, default: 80% */
  controlCol?: string;
  /** the length to offset space from the left, default: 0 */
  offset?: string;
  /** determine if there is space left for error tips */
  hasTips?: boolean;
  /** type of label alignment, default is right */
  labelAlign?: 'left' | 'right' | 'center';
}

export interface IFormBunchRef {
  /** validate all values of form and return result */
  validate: () => boolean;
  /** reset all value of form and result of verify */
  reset: () => void;
}

export interface IFormBunchProps<T> {
  /** config of each form item */
  items: IFormItem<T>[];
  /** global setting of form, Priority: items > setting */
  setting?: IFormSetting;
  /** the callback function when form data changes */
  onChange?: (form: IFormValue, item: any, key: string) => void;
  /** the callback function that is triggered when some keys of keyboard is pressed */
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** form data */
  value?: IFormValue;
  className?: string;
  ref?: any;
  style?: React.CSSProperties;
}

export interface IFormRuleItem {
  value?: string;
  error: string;
  trigger?: TTrigger;
  verify?: RegExp | ((value?: unknown, form?: IFormValue) => void);
  result?: boolean | 'unverified';
  required: boolean;
}

export interface IFormRule {
  [x: string]: IFormRuleItem;
}

type TTrigger = 'blur' | 'change';

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

export interface IFormValue {
  [x: string]: any;
}

type TOriginTypeMap<T> = {
  [p in keyof T]: T[p] extends any[]
    ? UnionToIntersection<React.ComponentProps<T[p][0]>>
    : // @ts-ignore
      React.ComponentProps<T[p]>;
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export type IFormItem<T> = TFormItems<T>[keyof TFormItems<T>];

export type Class<T = any> = new (...args: any[]) => T;
