import { IFormRule, IFormValue } from '../form-bunch';
import { validate } from './verify';

class Store {
  value: IFormValue = {};
  initRule: IFormRule = {};
  rule: IFormRule = {};
  defaultValue: IFormValue = {};
  setValue(value: IFormValue) {
    this.value = value;
  }
  verify(params: { value: IFormValue; initError: { [x: string]: string } }) {
    const { value, initError } = params;
    for (const i in value) {
      if (value.hasOwnProperty(i) && this.rule[i]?.value !== value[i]) {
        this.rule[i] = validate({
          key: i,
          value,
          rule: this.rule,
          initError: initError,
        });
      }
    }
    this.rule = { ...this.rule };
  }
  verifyAll(params: { value: IFormValue; initError: { [x: string]: string } }) {
    const { value, initError } = params;
    const newRule: IFormRule = {};
    let result = true;
    for (const i in this.rule) {
      if (this.rule.hasOwnProperty(i)) {
        newRule[i] = validate({
          key: i,
          value,
          rule: this.rule,
          initError: initError,
        });
        if (result) result = Boolean(newRule[i].result);
      }
    }
    this.rule = newRule;
    return result;
  }
  setInitRule(initRule: IFormRule) {
    const newRule: IFormRule = {};
    for (const i in initRule) {
      if (initRule.hasOwnProperty(i)) {
        newRule[i] = {
          ...initRule[i],
          result: this.rule[i]?.result ?? initRule[i].result,
          value: this.rule[i]?.value ?? initRule[i].value,
        };
      }
    }
    this.rule = newRule;
    this.initRule = initRule;
  }
  setDefaultValue(defaultValue: IFormValue) {
    this.defaultValue = defaultValue;
    this.value = defaultValue;
  }
  reset() {
    const newRule = { ...this.rule };
    for (const i in newRule) {
      if (newRule.hasOwnProperty(i)) {
        newRule[i].result = 'unverified';
        newRule[i].value = this.defaultValue[i] || '';
      }
    }
    this.rule = newRule;
    this.value = this.defaultValue;
  }
}

export type IStore = InstanceType<typeof Store>;

export default Store;
