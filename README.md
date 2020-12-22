# form-bunch
[![NPM Status](https://img.shields.io/npm/v/form-bunch.svg)](https://www.npmjs.com/package/form-bunch)  

The form-bunch is a component like a plugin that make it easier to write form,  
You could add most of the components what you want to form-bunch for build various forms.
You could also easily change the settings to get the verification or layout you want

Advantages:
- Customizable. You can add whatever you want if it's possible, like components of Material-UI, Ant Design or custom components. 
- Small. it will give you convenience and performance for building form.  
- Easy. You can change the settings easily - [see below](#advanced-usage)

###   [DEMO](https://codesandbox.io/s/form-bunch-9084x)

###   Installation

- YARN

```bash
yarn add form-bunch
```

- NPM

```bash
npm install form-bunch
```


###   Usage

First of all, initialize form-bunch.<br/>
Assume that you would like to use components of [antd](https://ant.design/), the components should match two rules:<br/>
1. Need two fields `value` and `onChange`
2. the param(e) of `onChange(e) => void` must corresponds to `value`.
if one component has no `value` or `onChange` key, or doesn't match form-bunch, you should replace them like following.

```typescript jsx
// index.tsx 
import { DatePicker, Input, Switch } from 'antd';

const extensions = {
  datePick: DatePicker,
  input: [
    Input,
    {
      // change the `e.target.value` to `value`
      // assume the original filed is `onSelect`, 
      // then it should be "onChange: [`onSelect`, 'e.target.value']"
      onChange: ['onChange', 'e.target.value'],
    },
  ],
  switch: [
    Switch,
    {
      // change the field `checked` to `value`
      value: 'checked'
    }
  ]
};

export type TExtensions = typeof extensions;

const MyFormBunch = formBunchInit<TExtensions>(extensions);

export default MyFormBunch;
```

You should also need to set the style after failed to verify in `form-bunch-error-box` className, then import it.
```css
/* index.css */
.form-bunch-error-box {

   .antd-input {
      border: 1px solid red;
   }

   .antd-input:hover {
      border: 1px solid red;
   }
}
```

```typescript
// index.tsx
import './index.css'

...

export default MyFormBunch;
```

```typescript jsx
<MyFormBunch
  ref={formBunchRef}
  value={value}
  items={[
    {
      key: 'a',
      type: 'input',
    },
    {
      labelCol: '80px',
      offset: '40px',
      key: 'b',
      defaultValue: 'test',
      type: 'input',
      verify: (value) => value.length > 5,
    },
  ]}
  onChange={(value) => {
    setValue(value);
  }}
/>
```

Click [DEMO](https://codesandbox.io/s/form-bunch-9084x) for more details about usage.

### API

#### Form

| Property | Description                                                 | Type                                                                                                                        | Default |
| -------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------- |
| items    | config of each form item， see `Items API` for more details | [IFormItem<T>](https://github.com/zixiCat/form-bunch/blob/master/src/form-bunch.d.ts)                                       | -       |
| onChange | the callback function when form data changes                | (form: [IFormValue](https://github.com/zixiCat/form-bunch/blob/master/src/form-bunch.d.ts), item: any, key: string) => void | -       |
| value    | form data                                                   | [IFormValue](https://github.com/zixiCat/form-bunch/blob/master/src/form-bunch.d.ts)                                         | -       |

####  Items

| Property     | Description                                                                                                                                | Type                                                              | Default |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- | ------- |
| className    | class of the formItem                                                                                                                      | string                                                            | -       |
| col          | like flex-basic, the space that formItem takes up                                                                                          | number \| string                                                  | '100%'  |
| controlCol   | like flex-basic, the space that control of formItem takes up                                                                               | number \| string                                                  | '80%'   |
| defaultValue | default value, you can also change initial  `value of form API` to set it                                                                  | any                                                               | -       |
| error        | the message after failed to verify                                                                                                         | string                                                            | -       |
| key          | formItem property                                                                                                                          | string                                                            | -       |
| label        | formItem label name                                                                                                                        | string                                                            | -       |
| labelAlign   | type of label alignment                                                                                                                    | 'left' \| 'right' \| 'center'                                     | 'right' |
| labelCol     | like flex-basic, the space that label of formItem takes up                                                                                 | number \| string                                                  | 20%     |
| offset       | like margin-left, the length to offset space from the left                                                                                 | number \| string                                                  | 0       |
| render       | render type of formItem control, <br/>require that only one is provided between property [type] and [render]                               | (value: any, setValue: (state: any) => void) => JSX.Element       | -       |
| required     | set formItem value to be required                                                                                                          | boolean                                                           | false   |
| type         | render type of formItem control, <br/>require that only one is provided between property [type] and [render]                               | string                                                            | -       |
| typeProps    | when use [type], then [typeProps] is its original props                                                                                    | object                                                            | -       |
| verify       | function that to verify the formItem value, it supports regex.<br />when it return string, the string will replace corresponding error tip | RegExp \| ((value?: any, form?: IFormValue) => boolean \| string) | -       |

####  Setting

| Property   | Description                                                  | Type                          | Default |
| ---------- | ------------------------------------------------------------ | ----------------------------- | ------- |
| col        | like flex-basic, the space that formItem takes up            | number \| string              | '100%   |
| controlCol | like flex-basic, the space that control of formItem takes up | number \| string              | '80%'   |
| hasTips    | determine if there is space left for error tips              | boolean                       | false   |
| labelAlign | type of label alignment                                      | "left" \| "right" \| "center" | 'right' |
| labelCol   | like flex-basic, the space that label of formItem takes up   | number \| string              | '20%'   |
| offset     | like margin-left, the length to offset space from the left   | number \| string              | 0       |

####  Ref

| Property | Description                                   | Type          | Default |
| -------- | --------------------------------------------- | ------------- | ------- |
| validate | validate all values of form and return result | () => boolean | -       |
| reset    | reset all value of form and result of verify  | () => void    | -       |

## Bug tracker


If you find a bug, please report it [here on Github](https://github.com/zixiCat/form-bunch/issues)!