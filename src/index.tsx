import React, {
  forwardRef,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  IFormBunchProps,
  IFormBunchRef,
  IFormItem,
  IFormValue,
} from './form-bunch';
import Render from './render';
import Verify from './verify'; // verifyFnMap, // TVerifyFnMap, // ruleReducer, // initRuleFn,
import { getConTexts, Provider } from 'easy-create-react-context';
import Store, { IStore } from './store';

export const storeCtx = getConTexts<IStore>();

const FormBunch = (
  props: IFormBunchProps,
  ref?: ((instance: unknown) => void) | MutableRefObject<unknown> | null
) => {
  const verifyRef = useRef<IFormBunchRef>({} as any);

  useImperativeHandle(
    ref,
    (): IFormBunchRef => ({
      validate: () => verifyRef.current.validate(),
      reset: () => verifyRef.current.reset(),
    })
  );

  console.log('form-bunch render');

  return (
    <Provider<IStore> contexts={storeCtx} value={new Store()}>
      <Render
        className={props.className}
        style={props.style}
        value={props.value}
        setting={props.setting}
        items={props.items}
        onChange={(e, item, key) => {
          props.onChange && props.onChange(e, item, key);
        }}
      />
      <Verify ref={verifyRef} items={props.items} />
    </Provider>
  );
};

export default forwardRef(FormBunch);
