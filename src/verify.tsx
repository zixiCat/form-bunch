import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { IFormItem, IFormRule, IFormRuleItem, IFormValue } from './form-bunch';
import { itemsContext, ruleDispatchContext, valueContext } from './index';

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
      required: !!i?.required
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
  }
};
export type TVerifyFnMap = keyof typeof verifyFnMap;

export const ruleReducer = (
  state: IFormRule,
  {
    value,
    initError,
    isValidateAll,
    isReset
  }: {
    value: IFormValue;
    initError: { [x: string]: string };
    isValidateAll: boolean;
    isReset?: boolean;
  }
): IFormRule => {
  try {
    const newRule = { ...state };
    if (isReset) {
      for (let i in newRule) {
        if (newRule.hasOwnProperty(i)) {
          newRule[i].result = 'unverified';
        }
      }
      return newRule;
    }
    const validate = (key: string) => {
      const target = (!!state[key]?.required + '-' + !!state[key]?.verify) as TVerifyFnMap;
      const tempResult = verifyFnMap[target](state[key], value[key], value);
      newRule[key] = {
        ...newRule[key],
        value: value[key],
        result: tempResult === true,
        error: typeof tempResult === 'string' ? tempResult : initError[key]
      };
    };
    if (!isValidateAll) {
      for (const i in value) {
        if (value.hasOwnProperty(i) && newRule[i]?.value !== value[i]) {
          validate(i);
        }
      }
    } else {
      for (const i in state) {
        if (state.hasOwnProperty(i)) {
          validate(i);
        }
      }
    }

    return newRule;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 * initRule
 * @return {IFormRule} The sum of the two numbers.
 */
const Verify = () => {
  // is there any way to simple this var [timeout]
  let [timeout] = useState<any>(null);
  const value = useContext(valueContext);
  const ruleDispatch = useContext(ruleDispatchContext);
  const items = useContext(itemsContext);
  const initError = useMemo(() => {
    const temp: { [x: string]: string } = {};
    for (const i of items) {
      temp[i.key] = i.error || '';
    }
    return temp;
  }, [items]);

  const debounce = useCallback((fn: Function, interval = 200) => {
    return function () {
      clearTimeout(timeout);

      // eslint-disable-next-line react-hooks/exhaustive-deps
      timeout = setTimeout(() => {
        // @ts-ignore

        fn.apply(this, arguments);
      }, interval);
    };
  }, []);

  const mounted = useRef<boolean>();
  useEffect(() => {
    if (mounted.current) {
      // do componentDidUpdate logic
      debounce(() => {
        ruleDispatch({
          value,
          initError,
          isValidateAll: false
        });
      })();
    } else {
      // do componentDidMount logic
      mounted.current = true;
    }
  }, [debounce, value, initError, ruleDispatch]);

  return <></>;
};

export default memo(Verify);
