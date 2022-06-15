import React from 'react';
import './index.scss';
import { IFormItem, IFormSetting, IFormValue } from '../types';
declare const _default: <T extends unknown>(props: {
    className?: string;
    style?: React.CSSProperties;
    value?: IFormValue;
    items: IFormItem<T>[];
    setting?: IFormSetting;
    onChange: (form: IFormValue, item: any, key: string) => void;
}) => JSX.Element;
export default _default;
