import React from 'react';
import { typeMap } from './plugins';

export interface IFormItemT {
  /** type of label alignment, default is right */
  labelAlign?: 'left' | 'right' | 'center'
  /** class of the formItem */
  className?: string
  /** default value, you can also change `initial value of form API` to set the default value */
  defaultValue?: any
  /** like flex-basic, it's the property of the formItem, default is 100% */
  col?: string
  offset?: string
  /** formItem label name */
  label?: string
  /** formItem property */
  key: string
  /** render type of formItem control, require that one and only one is provided between property [type] and [render] */
  type?: TTypeMapKey
  /** like flex-basic, it's the label's property of the formItem, default is 20% */
  labelCol?: string
  /** like flex-basic, it's the control's property of the formItem, default is 80% */
  controlCol?: string
  /** the message after fail to verify */
  error?: string
  /** the way that trigger to verify */
  trigger?: TTrigger
  /** set formItem value to required */
  required?: boolean
  /** function that verify the formItem value, support regex, when the return function is string, the error is  */
  verify?: RegExp | ((value?: any, form?: IFormValue) => boolean | string)
  /** render type of formItem control, require that one and only one is provided between property [type] and [render] */
  render?: (value: any, setValue: (state: any) => void) => void
  /** when use [type], then [typeProps] is its original props */
  typeProps?: React.ComponentProps<TOriginTypeMap[keyof TOriginTypeMap]>
}

export interface IFormSetting {
  /** like flex-basic, it's the property of the formItem, default is 100% */
  col?: string
  /** like flex-basic, it's the label's property of the formItem, default is 20% */
  labelCol?: string
  /** like flex-basic, it's the control's property of the formItem, default is 80% */
  controlCol?: string
  offset?: string
  hasTip?: boolean
  /** type of label alignment, default is right */
  labelAlign?: 'left' | 'right' | 'center'
}

export interface IFormBunchRef {
  /** validate all values of form and return the result */
  validate: () => boolean
  /** reset all value of form */
  reset: () => void
}

export interface IFormBunchProps {
  /** config of each form item */
  items: IFormItem[]
  rule?: IFormRule
  /** default global setting of form */
  setting?: IFormSetting
  /** callback after form data changes */
  onChange?: (form: IFormValue, item: any, key: string) => void
  /** The callback function that is triggered when some keys of KB is pressed */
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  /** form data */
  value?: IFormValue
  className?: string
  style?: React.CSSProperties
}

export interface IFormRuleItem {
  value?: string
  error: string
  trigger?: TTrigger
  verify?: RegExp | ((value?: unknown, form?: IFormValue) => void)
  result?: boolean | 'unverified'
  required: boolean
}

export interface IFormRule {
  [x: string]: IFormRuleItem
}

type TTrigger = 'blur' | 'change'

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T,
  Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
    Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys]

export type IFormItem = RequireOnlyOne<IFormItemT, 'type' | 'render'>

export interface IFormValue {
  [x: string]: any
}

type TTypeMapKey = keyof typeof typeMap;

type TTypeMap = typeof typeMap;

type TOriginTypeMap = {
  [p in keyof TTypeMap]: TTypeMap[p] extends any[] ? TTypeMap[p][0] : TTypeMap[p];
};

export type IContextValue = [
  IFormValue,
  React.Dispatch<TAction<IFormValue>>,
  IFormItem[],
  IFormRule,
  React.Dispatch<any>,
  IFormSetting
]
