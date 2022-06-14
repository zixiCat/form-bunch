import React, {
  forwardRef,
  MutableRefObject,
  useImperativeHandle,
  useRef,
} from 'react';
import { IFormBunchProps, IFormBunchRef } from '../types';
import Render from './render';
import Verify from './verify';
import store, { Provider } from './store';

const FormBunchCore = <T extends unknown>(
  props: IFormBunchProps<T>,
  ref?: ((instance: unknown) => void) | MutableRefObject<unknown> | null
) => {
  const verifyRef = useRef<IFormBunchRef>();

  useImperativeHandle(
    ref,
    (): IFormBunchRef => ({
      validate: () => verifyRef.current.validate(),
      reset: () => verifyRef.current.reset(),
    })
  );

  return (
    <Provider createStore={store}>
      <Render<T>
        className={props.className}
        style={props.style}
        value={props.value}
        setting={props.setting}
        items={props.items}
        onChange={(e, item, key) => {
          props.onChange && props.onChange(e, item, key);
        }}
      />
      <Verify<T> ref={verifyRef} items={props.items} />
    </Provider>
  );
};

export default forwardRef(FormBunchCore) as <T extends unknown>(
  props: IFormBunchProps<T> & {
    ref?: ((instance: unknown) => void) | MutableRefObject<unknown> | null;
  }
) => JSX.Element;
