import { IFormRule, IFormValue } from '../types';
import { validate } from './verify';
import create, { StoreApi } from 'zustand';
import createContext from 'zustand/context';

interface Store {
  value: IFormValue;
  initRule: IFormRule;
  rule: IFormRule;
  defaultValue: IFormValue;
  setValue: (value: IFormValue) => void;
  verify: (params: {
    value: IFormValue;
    initError: { [x: string]: string };
  }) => void;
  verifyAll: (params: {
    value: IFormValue;
    initError: { [x: string]: string };
  }) => boolean;
  setInitRule: (initRule: IFormRule) => void;
  setDefaultValue: (defaultValue: IFormValue) => void;
  reset: () => void;
}

export const { Provider, useStore } = createContext<StoreApi<Store>>();

const store = () =>
  create<Store>((set, get) => ({
    value: {},
    initRule: {},
    rule: {},
    defaultValue: {},
    setValue: (newValue: IFormValue) => {
      set({ value: newValue });
    },
    verify(params: { value: IFormValue; initError: { [x: string]: string } }) {
      const { value, initError } = params;
      const rule = get().rule;
      for (const i in value) {
        if (value.hasOwnProperty(i) && rule[i]?.value !== value[i]) {
          rule[i] = validate({
            key: i,
            value,
            rule: rule,
            initError: initError,
          });
        }
      }
      set({ rule: { ...rule } });
    },
    verifyAll: (params: {
      value: IFormValue;
      initError: { [x: string]: string };
    }) => {
      const { value, initError } = params;
      const newRule: IFormRule = {};
      let result = true;
      const rule = get().rule;
      for (const i in rule) {
        if (rule.hasOwnProperty(i)) {
          newRule[i] = validate({
            key: i,
            value,
            rule: rule,
            initError: initError,
          });
          if (result) result = Boolean(newRule[i].result);
        }
      }
      set({ rule: newRule });
      return result;
    },
    setInitRule: (initRule: IFormRule) => {
      const newRule: IFormRule = {};
      const rule = get().rule;
      for (const i in initRule) {
        if (initRule.hasOwnProperty(i)) {
          newRule[i] = {
            ...initRule[i],
            result: rule[i]?.result ?? initRule[i].result,
            value: rule[i]?.value ?? initRule[i].value,
          };
        }
      }
      set({ rule: newRule, initRule });
    },
    setDefaultValue: (defaultValue: IFormValue) => {
      set({ value: defaultValue, defaultValue });
    },
    reset: () => {
      const rule = get().rule;
      const newRule = { ...rule };
      const defaultValue = get().defaultValue;
      for (const i in newRule) {
        if (newRule.hasOwnProperty(i)) {
          newRule[i].result = 'unverified';
          newRule[i].value = defaultValue[i] || '';
        }
      }
      set({
        rule: newRule,
        value: defaultValue,
      });
    },
  }));

export default store;
