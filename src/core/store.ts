import { IFormItem, IFormRule, IFormValue } from '../form-bunch';
import { TVerifyFnMap, verifyFnMap } from './verify';

class Store {
  value: IFormValue = {};
  items: IFormItem[] = [];
  rule: IFormRule = {};
  setValue(value: IFormValue) {
    this.value = value;
  }
  verify(params: {
    value: IFormValue;
    initError: { [x: string]: string };
    isValidateAll: boolean;
    isReset?: boolean;
  }) {
    const state = this.rule;
    const { value, initError, isValidateAll, isReset } = params;
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
      const target = (!!state[key]?.required +
        '-' +
        !!state[key]?.verify) as TVerifyFnMap;
      const tempResult = verifyFnMap[target](state[key], value[key], value);
      newRule[key] = {
        ...newRule[key],
        value: value[key],
        result: tempResult === true,
        error: typeof tempResult === 'string' ? tempResult : initError[key],
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
    this.rule = newRule;
  }
  setInitRule(initRule: IFormRule) {
    this.initRule = initRule;
  }
  initRule: IFormRule = {};
  setDefaultValue(defaultValue: IFormValue) {
    this.defaultValue = defaultValue;
    this.value = { ...this.value, ...defaultValue };
  }
  defaultValue: IFormValue = {};
  getRule() {
    return this.rule;
  }
  getDefaultValue() {
    return this.defaultValue;
  }
}

export type IStore = InstanceType<typeof Store>;

export default Store;
