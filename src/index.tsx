import React, {
  createContext,
  forwardRef,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useState
} from 'react';
import { IFormBunchProps, IFormItem, IFormBunchRef, IFormRule, IFormSetting, IFormValue } from './form-bunch';
import Render, { valueReducer } from './render';
import Verify, { initRuleFn, ruleReducer, TVerifyFnMap, verifyFnMap } from './verify';
import ComProvider from './com-provider';

export const itemsContext = createContext<IFormItem[]>([]);
export const ruleContext = createContext<IFormRule>({});
export const ruleDispatchContext = createContext<any>(null);
export const settingContext = createContext<IFormSetting>({});
export const valueContext = createContext<IFormValue>({});
export const valueDispatchContext = createContext<any>({});

const FormBunch = (props: IFormBunchProps, ref?: ((instance: unknown) => void) | MutableRefObject<unknown> | null) => {
  const defaultValue = useMemo(() => {
    const temp: IFormValue = {};
    props.items.forEach((i) => {
      if (i.defaultValue !== null && i.defaultValue !== undefined) {
        temp[i.key] = i.defaultValue;
      }
    });
    return temp;
  }, [props.items]);
  const [value, valueDispatch] = useReducer(valueReducer, { ...defaultValue, ...props.value } || {});
  const [initRule] = useState(() => initRuleFn(props.items));
  const [initError] = useState(() => {
    const temp: { [x: string]: string } = {};
    for (const i of props.items) {
      temp[i.key] = i.error || '';
    }
    return temp;
  });
  const [rule, ruleDispatch] = useReducer(ruleReducer, initRule);

  useImperativeHandle(
    ref,
    (): IFormBunchRef => ({
      validate: () => {
        let result = true;
        ruleDispatch({
          value: { ...defaultValue, ...props.value } || {},
          initError: initError,
          isValidateAll: true
        });
        for (const i in rule) {
          if (rule.hasOwnProperty(i)) {
            const target = (!!rule[i]?.required + '-' + !!rule[i]?.verify) as TVerifyFnMap;
            const tempResult = verifyFnMap[target](rule[i], value[i], value);
            if (tempResult !== true) {
              result = false;
              break;
            }
          }
        }
        return result;
      },
      reset: () => {
        // props.onChange && props.onChange(defaultValue);
        setTimeout(() => {
          ruleDispatch({
            value,
            initError,
            isValidateAll: false,
            isReset: true
          });
        });
      }
    })
  );

  useEffect(() => {
    valueDispatch({ ...defaultValue, ...props.value });
    ruleDispatch({
      value: { ...defaultValue, ...props.value } || {},
      initError: initError,
      isValidateAll: false
    });
  }, [props.value, defaultValue, initError]);

  return (
    <ComProvider
      components={[
        valueContext.Provider,
        valueDispatchContext.Provider,
        itemsContext.Provider,
        ruleContext.Provider,
        ruleDispatchContext.Provider,
        settingContext.Provider
      ]}
      value={[value, valueDispatch, props.items, rule, ruleDispatch, props.setting || {}]}
    >
      <>
        <Render
          className={props.className}
          style={props.style}
          onChange={(e, item, key) => {
            props.onChange && props.onChange(e, item, key);
          }}
        />
        <Verify />
      </>
    </ComProvider>
  );
};

export default forwardRef(FormBunch);
