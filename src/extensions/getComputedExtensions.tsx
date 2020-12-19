import React from 'react';

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
          let val: any = e;
          for (let i = 1; i < keyArr.length; i++) {
            val = val[keyArr[i]];
          }
          props.onChange(val);
        }
      };
    }

    if (keyReplace.value) {
      temp[keyReplace.value] = props.value;
    }

    return <Comp {...props} {...temp} />;
  };
};

const getComputedExtensions = <T extends unknown>(typeMap: T) => {
  const result: any = {};
  let item: keyof T;
  for (item in typeMap) {
    if (typeMap.hasOwnProperty(item)) {
      if (typeMap[item] instanceof Array) {
        // @ts-ignore
        result[item] = keyReplaceFn(typeMap[item][0], typeMap[item][1]);
      } else {
        result[item] = typeMap[item];
      }
    }
  }
  return result;
};

export default getComputedExtensions;
