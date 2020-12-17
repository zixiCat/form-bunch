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
    const newRule: IFormRule = {};

    for (const i in value) {
      if (value.hasOwnProperty(i) && newRule[i]?.value !== value[i]) {
        newRule[i] = validate({
          key: i,
          value,
          rule: this.rule,
          initError: initError,
        });
      }
    }
    this.rule = newRule;
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
    this.rule = initRule;
    this.initRule = initRule;
  }
  setDefaultValue(defaultValue: IFormValue) {
    this.defaultValue = defaultValue;
    this.value = { ...this.value, ...defaultValue };
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
