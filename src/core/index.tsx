import React, {
  forwardRef,
  MutableRefObject,
  useImperativeHandle,
  useRef,
} from 'react';
import { IFormBunchProps, IFormBunchRef } from '../form-bunch';
import Render from './render';
import Verify from './verify';
// See https://github.com/zixiCat/easy-create-react-context for more details about `easy-create-react-context`
// If you like it, star it :)
import { getConTexts, Provider } from 'easy-create-react-context';
import Store, { IStore } from './store';

export const storeCtx = getConTexts<IStore>();

const FormBunchCore = (
  props: IFormBunchProps<any>,
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

export default forwardRef(FormBunchCore);
