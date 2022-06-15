import React, { MutableRefObject } from 'react';
import { IFormItem, IFormRule, IFormRuleItem, IFormValue } from '../types';
/**
 * Function to get the initial rule
 * @param {IFormItem[]} items The second number.
 * @param {IFormValue} defaultValue
 * @return {IFormRule} The sum of the two numbers.
 */
export declare const initRuleFn: <T extends unknown>(items: IFormItem<T>[], defaultValue: IFormValue) => IFormRule;
export declare const verifyFnMap: {
    'false-false': () => boolean;
    'false-true': (rule: IFormRuleItem, valueItem: any, value: IFormValue) => any;
    'true-false': (_rule: IFormRuleItem, valueItem: any) => boolean;
    'true-true': (rule: IFormRuleItem, valueItem: any, value: IFormValue) => any;
};
declare type TValidateParams = {
    key: string;
    value: IFormValue;
    rule: IFormRule;
    initError: {
        [p: string]: string;
    };
};
/**
 * Function to get the new rule
 * @param {TValidateParams} validateParams
 * @return {IFormRule} new FormRule
 */
export declare const validate: ({ key, value, rule, initError }: TValidateParams) => {
    value: any;
    result: boolean;
    error: string;
    verify?: RegExp | ((value?: unknown, form?: IFormValue) => void);
    required: boolean;
};
export declare type TVerifyFnMap = keyof typeof verifyFnMap;
declare const _default: <T extends unknown>(props: {
    items: IFormItem<T>[];
    ref?: React.MutableRefObject<unknown> | ((instance: unknown) => void);
}) => JSX.Element;
export default _default;
