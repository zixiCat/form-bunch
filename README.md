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

### usage

```typescript jsx


<FormBunch 
items={
    
}
onChange={(newValue)=>{
    
}}
/>
```

### API

#### Table

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| className | The className of form-bunch | string | - |
| items | items of form-bunch | IFormItemT[] | - |
| setting |  |  |  |
| value | form data | 1000 | - |
| onChange | callback after form data changes | (form: IFormValue, item?: any, key?: string | string[]) => void | - |
| onKeyPress | The callback function that is triggered when some keys of KB is pressed | (e: React.KeyboardEvent<HTMLInputElement>) => void | - |

#### Items

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| labelAlign | type of label alignment, default is right | "left", "right", "center" | "left" |
| className | default value, you can also change `initial value of form API` to set the default value | any | - |
| defaultValue |  |  |  |
| col | like flex-basic, it's the property of the formItem, default is 100% | string | 100% |
| label | formItem label name | string | - |
| key | formItem property | string | - |
| type | render type of formItem control, require that one and only one is provided between property [type] and [render] | TTypeMap | - |
| labelCol | like flex-basic, it's the label's property of the formItem | string | "20%" |
| controlCol | like flex-basic, it's the control's property of the formItem | string | 80% |
| error | the message after fail to verify | string | - |
| trigger | the way that trigger to verify | "blur", "change" | - |
| required | set formItem value to required | boolean | false |
| verify | function that verify the formItem value, support regex, when the return function is string, the error is | RegExp, ((value?: any, form?: IFormValue) => boolean | string) | - |
| render | render type of formItem control, require that one and only one is provided between property [type] and [render] | (value: any, setValue: (state: any) => void) => React.ReactNode | - |
| typeProps | when use [type], then [typeProps] is its original props | React.ComponentProps<typeof typeMap[keyof typeof typeMap]> | - |

#### Setting

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value |  |  |  |
| items |  |  |  |
| labelAlign | type of label alignment | "left" , "right" , "center" | 'left' |
| hasTip |  |  |  |
| offset |  |  |  |
| labelCol | like flex-basic, it's the label's property of the formItem | string | "20%" |
| controlCol | like flex-basic, it's the control's property of the formItem | string | 80% |
| col | like flex-basic, it's the property of the formItem, default is 100% | string | 100% |

#### Ref

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| validate | Number | ()=>boolean | - |

## Bug tracker

If you find a bug, please report it [here on Github](https://github.com/zixiCat/form-bunch/issues)!
