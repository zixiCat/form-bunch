import React, {
  forwardRef,
  memo,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  IFormBunchRef,
  IFormItem,
  IFormRule,
  IFormRuleItem,
  IFormValue,
} from './form-bunch';
import { storeCtx } from './index';

/**
 * Function to get the initial rule
 * @param {IFormItem[]} items The second number.
 * @return {IFormRule} The sum of the two numbers.
 */
export const initRuleFn = (items: IFormItem[]) => {
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
  'true-false': (rule: IFormRuleItem, valueItem: any) => {
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
export type TVerifyFnMap = keyof typeof verifyFnMap;

/**
 * initRule
 * @return {IFormRule} The sum of the two numbers.
 */
const Verify = (
  props: { items: IFormItem[] },
  ref?: ((instance: unknown) => void) | MutableRefObject<unknown> | null
) => {
  // is there any way to simple this declare [timeout]
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timeout = setTimeout(() => {
        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params
        fn.apply(this, arguments);
      }, interval);
    };
  }, []);

  useImperativeHandle(
    ref,
    (): IFormBunchRef => ({
      validate: () => {
        let result = true;
        storeCtx.dispatch('verify', {
          value: value || {},
          initError: initError,
          isValidateAll: true,
        });
        const rule: any = storeCtx.dispatch('getRule');
        for (const i in rule) {
          if (rule.hasOwnProperty(i)) {
            const target = (!!rule[i]?.required +
              '-' +
              !!rule[i]?.verify) as TVerifyFnMap;
            const tempResult = verifyFnMap[target](rule[i], value[i], value);
            if (tempResult !== true) {
              result = false;
              break;
            }
          }
        }
        console.log(result);
        return result;
      },
      reset: () => {
        // props.onChange && props.onChange(defaultValue);
        storeCtx.dispatch('verify', {
          value,
          initError,
          isValidateAll: false,
          isReset: true,
        });
        // const temp = storeCtx.dispatch({ type: 'getDefaultValue' }) as any;
        // console.log(temp);
        // storeCtx.dispatch('setValue', temp);
      },
    })
  );

  const mounted = useRef<boolean>();
  useEffect(() => {
    if (mounted.current) {
      // do componentDidUpdate logic
      debounce(() => {
        console.log('verify render');
        storeCtx.dispatch('verify', {
          value,
          initError,
          isValidateAll: false,
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
