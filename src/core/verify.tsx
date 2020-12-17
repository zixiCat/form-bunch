import React, {
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  MutableRefObject,
} from 'react';
import {
  IFormBunchRef,
  IFormItem,
  IFormRule,
  IFormRuleItem,
  IFormValue,
} from '../form-bunch';
import { storeCtx } from './index';

/**
 * Function to get the initial rule
 * @param {IFormItem[]} items The second number.
 * @return {IFormRule} The sum of the two numbers.
 */
export const initRuleFn = (items: IFormItem<any>[]) => {
  const temp: IFormRule = {};
  items.forEach((i) => {
    temp[i.key] = {
      value: i.defaultValue || '',
      error: i.error || '',
      trigger: i.trigger,
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
    return !!valueItem;
  },
  'true-true': (rule: IFormRuleItem, valueItem: any, value: IFormValue) => {
    if (valueItem) {
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

const Verify = (
  props: { items: IFormItem<any>[] },
  ref?: ((instance: unknown) => void) | MutableRefObject<unknown> | null
) => {
  let [timeout] = useState<any>(null);
  const initError = useMemo(() => {
    const temp: { [x: string]: string } = {};
    for (const i of props.items) {
      temp[i.key] = i.error || '';
    }
    return temp;
  }, [props.items]);
  const initRule = useMemo(() => initRuleFn(props.items), [props.items]);
  useEffect(() => {
    storeCtx.dispatch('setInitRule', initRule);
  }, [initRule]);

  const value = useContext(storeCtx.getContext('value'));

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
        return storeCtx.dispatch('verifyAll', {
          value: value || {},
          initError: initError,
        });
      },
      reset: () => {
        storeCtx.dispatch('reset');
      },
    })
  );

  const mounted = useRef<boolean>();
  useEffect(() => {
    if (mounted.current) {
      // do componentDidUpdate logic
      debounce(() => {
        storeCtx.dispatch('verify', {
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

export default memo(forwardRef(Verify));
