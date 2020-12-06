import React from 'react';

export const typeMap = {};

const keyReplaceFn = (
  Comp: any,
  keyReplace: {
    onChange?: [string, string];
    value?: string;
  }
) => {
  return (props: React.ComponentProps<typeof Comp>) => {
    const temp: {
      [key: string]: any;
    } = {};
    if (keyReplace.onChange) {
      temp[keyReplace.onChange[0]] = (e: any) => {
        if (keyReplace.onChange) {
          const keyArr = keyReplace.onChange[1].split('.');
          keyArr.shift();
          let val: any = e;
          for (let i = 0; i < keyArr.length; i++) {
            val = val[keyArr[i]];
          }
          props.onChange(val);
        }
      };
    }

    if (keyReplace['value']) {
      temp[keyReplace['value']] = props.value;
    }
    return <Comp {...props} {...temp} />;
  };
};

const computedTypeMap: { [p: string]: any } = {};
for (const i in typeMap) {
  if (typeMap.hasOwnProperty(i)) {
    // @ts-ignore
    if (Array.isArray(typeMap[i])) {
      // @ts-ignore
      computedTypeMap[i] = keyReplaceFn(typeMap[i][0], typeMap[i][1]);
    } else {
      // @ts-ignore
      computedTypeMap[i] = typeMap[i];
    }
  }
}

export { computedTypeMap };
