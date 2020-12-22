# form-bunch
[![NPM Status](https://img.shields.io/npm/v/form-bunch.svg)](https://www.npmjs.com/package/form-bunch)  

The form-bunch is a component like a plugin that make it easier to write form,  
you could add most of the components what you want to form-bunch for build various forms  
you could also easily change the settings to get the layout or verification you want

Advantages:
- Customizable. You can add whatever you want if it's possible, like components of Material-UI, Ant Design or custom stuff. 
- Small. it will give you convenience and performance for building form.  
- You can change the settings - [see below](#advanced-usage)

### [DEMO](https://github.com/zixiCat/form-bunch)

## Installation

- YARN

```bash
   yarn add form-bunch
```

- NPM

```bash
   npm install form-bunch
```

### usage

First of all, initialize form-bunch, assume that you would like to use components of antd, the components should match these rules
1. Need two fields `value` and `onChange`
2. the param(e) of `onChange(e) => void` must be corresponded with `value`.
if one component has no `value` or `onChange` key, or doesn't match form-bunch, you should replace them like following.

```typescript jsx
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

export TExtensions = type extensions
export const MyFormBunch = formBunchInit<TExtensions>(extensions);
```


```typescript jsx
<MyFormBunch
items={
    
}
onChange={(newValue)=>{
    
}}
/>
```

Click [DEMO](https://github.com/zixiCat/form-bunch) for more details about usage.

### API

#### Form

| Property | Description                                                 | Type                                               | Default |
| -------- | ----------------------------------------------------------- | -------------------------------------------------- | ------- |
| items    | config of each form item， see `Items API` for more details | IFormItem<T>                                       | -       |
| onChange | the callback function when form data changes                | (form: IFormValue, item: any, key: string) => void | -       |
| value    | form data                                                   | IFormValue                                         | -       |

#### Items

| Property     | Description                                                               | Type                                                              | Default |
| ------------ | ------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------- |
| className    | class of the formItem                                                     | string                                                            | -       |
| col          | like flex-basic, it's the property of the formItem                        | number \| string                                                  | '100%'  |
| controlCol   | like flex-basic, it's the control's property of the formItem              | number \| string                                                  | '80%'   |
| defaultValue | default value, you can also change initial  `value of form API` to set it | any                                                               | -       |
| error        | the message after failed to verify                                        | string                                                            | -       |
| key          | formItem property                                                         | string                                                            | -       |
| label        | formItem label name                                                       | string                                                            | -       |
| labelAlign   | type of label alignment                                                   | 'left' \| 'right' \| 'center'                                     | 'right' |
| labelCol     | like flex-basic, it's the label's property of the formItem                | number \| string                                                  | 20%     |
| offset       | like margin-left, the length to offset space from the left                | number \| string                                                  | 0       |
| render       | render type property [type] and [render]                                  | (value: any, setValue: (state: any) => void) => JSX.Element       | -       |
| required     | set formItem value to be required                                         | boolean                                                           | false   |
| type         | render type only one is provided between property [type] and [render]     | string                                                            | -       |
| typeProps    | when use [type], then [typeProps] is its original props                   | object                                                            | -       |
| verify       | function th replace corresponding error tip                               | RegExp \| ((value?: any, form?: IFormValue) => boolean \| string) | -       |

#### Setting

| Property   | Description                                                  | Type                          | Default |
| ---------- | ------------------------------------------------------------ | ----------------------------- | ------- |
| col        | like flex-basic, it's the property of the formItem           | number \| string              | '100%   |
| controlCol | like flex-basic, it's the control's property of the formItem | number \| string              | '80%'   |
| hasTips    | determine if there is space left for error tips              | boolean                       | false   |
| labelAlign | type of label alignment                                      | "left" \| "right" \| "center" | 'right' |
| labelCol   | like flex-basic, it's the label's property of the formItem   | number \| string              | '20%'   |
| offset     | like margin-left, the length to offset space from the left   | number \| string              | 0       |

#### Ref

| Property | Description                                   | Type          | Default |
| -------- | --------------------------------------------- | ------------- | ------- |
| validate | validate all values of form and return result | () => boolean | -       |
| reset    | reset all value of form and result of verify  | () => void    | -       |

## Bug tracker


If you find a bug, please report it [here on Github](https://github.com/zixiCat/form-bunch/issues)!