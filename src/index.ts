import { MutableRefObject } from 'react';
import { IFormBunchProps } from './form-bunch';
import FormBunchCore from './core/index';
import getComputedExtensions from './extensions/getComputedExtensions';
import defaultExtensions from './extensions/defaultExtensions';

export let computedExtensions: unknown = getComputedExtensions(
  defaultExtensions
);

export const formBunchInit = <T extends unknown>(
  extensions: T
): ((
  props: IFormBunchProps<T>,
  ref?: ((instance: unknown) => void) | MutableRefObject<unknown> | null
) => JSX.Element) => {
  computedExtensions = getComputedExtensions<T>(extensions);
  return FormBunchCore;
};
