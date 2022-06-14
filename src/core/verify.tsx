import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  MutableRefObject,
  memo,
} from 'react';
import {
  IFormBunchRef,
  IFormItem,
  IFormRule,
  IFormRuleItem,
  IFormValue,
} from '../types';
import { useStore } from './store';
import { hasValue } from './util';

/**
 * Function to get the initial rule
 * @param {IFormItem[]} items The second number.
 * @param {IFormValue} defaultValue
 * @return {IFormRule} The sum of the two numbers.
 */
export const initRuleFn = <T extends unknown>(
  items: IFormItem<T>[],
  defaultValue: IFormValue
) => {
  const temp: IFormRule = {};
  items.forEach((i) => {
    temp[i.key] = {
      value: defaultValue[i.key] || null,
      error: i.error || '',
      verify: i?.verify,
      result: 'unverified',
      required: !!i?.required,
    };
  });
  return temp || ({} as IFormRule);
};

export const verifyFnMap = {
  'false-false': () => {
    return true;
  },
  'false-true': (rule: IFormRuleItem, valueItem: any, value: IFormValue) => {
    if (rule?.verify instanceof RegExp) {
      return (rule?.verify as RegExp).test(valueItem) || false;
    } else {
      return (rule?.verify as Function)(valueItem, value) || false;
    }
  },
  'true-false': (_rule: IFormRuleItem, valueItem: any) => {
    return hasValue(valueItem);
  },
  'true-true': (rule: IFormRuleItem, valueItem: any, value: IFormValue) => {
    if (hasValue(valueItem)) {
      if (rule?.verify instanceof RegExp) {
        return (rule?.verify as RegExp).test(valueItem) || false;
      } else {
        return (rule?.verify as Function)(valueItem, value) || false;
      }
    } else {
      if (typeof rule?.verify === 'function') {
        const temp = (rule?.verify as Function)(valueItem, value);
        return typeof temp === 'string' ? temp : false;
      } else {
        return false;
      }
    }
  },
};

type TValidateParams = {
  // The key that need to be validated
  key: string;
  // The value that need to be validated
  value: IFormValue;
  // The current rule
  rule: IFormRule;
  initError: { [p: string]: string };
};

/**
 * Function to get the new rule
 * @param {TValidateParams} validateParams
 * @return {IFormRule} new FormRule
 */
export const validate = ({ key, value, rule, initError }: TValidateParams) => {
  const target = (!!rule[key]?.required +
    '-' +
    !!rule[key]?.verify) as TVerifyFnMap;
  const tempResult = verifyFnMap[target](rule[key], value[key], value);

  return {
    ...rule[key],
    value: value[key],
    result: tempResult === true,
    error: typeof tempResult === 'string' ? tempResult : initError[key],
  };
};

export type TVerifyFnMap = keyof typeof verifyFnMap;

const Verify = <T extends unknown>(
  props: {
    items: IFormItem<T>[];
  },
  ref?: ((instance: unknown) => void) | MutableRefObject<unknown> | null
) => {
  let [timeout] = useState<any>(null);
  const mounted = useRef<boolean>();
  const value = useStore((s) => s.value);
  const defaultValue = useStore((s) => s.defaultValue);
  const setInitRule = useStore((s) => s.setInitRule);
  const verify = useStore((s) => s.verify);
  const verifyAll = useStore((s) => s.verifyAll);
  const reset = useStore((s) => s.reset);

  const initError = useMemo(() => {
    const temp: { [x: string]: string } = {};
    for (const i of props.items) {
      temp[i.key] = i.error || '';
    }
    return temp;
  }, [props.items]);

  const initRule = useMemo(
    () => initRuleFn(props.items, defaultValue),
    [defaultValue, props.items]
  );

  useEffect(() => {
    setInitRule(initRule);
  }, [initRule]);

  const debounce = useCallback((fn: Function, interval = 200) => {
    return function () {
      clearTimeout(timeout);
      /* eslint-disable no-invalid-this */
      /* eslint-disable prefer-rest-params */
      /* eslint-disable react-hooks/exhaustive-deps */
      timeout = setTimeout(() => {
        // @ts-ignore
        fn.apply(this, arguments);
      }, interval);
    };
  }, []);

  useImperativeHandle(
    ref,
    (): IFormBunchRef => ({
      validate: () => {
        return verifyAll({
          value: value || {},
          initError: initError,
        });
      },
      reset: () => {
        reset();
      },
    })
  );

  useEffect(() => {
    if (mounted.current) {
      // do componentDidUpdate logic
      debounce(() => {
        verify({
          value,
          initError,
        });
      })();
    } else {
      // do componentDidMount logic
      mounted.current = true;
    }
  }, [debounce, value, initError]);

  return <></>;
};

export default memo(forwardRef(Verify)) as <T extends unknown>(props: {
  items: IFormItem<T>[];
  ref?: ((instance: unknown) => void) | MutableRefObject<unknown> | null;
}) => JSX.Element;
