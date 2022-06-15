import { MutableRefObject } from 'react';
import { IFormBunchProps } from './types';
export declare let computedExtensions: unknown;
export declare const formBunchInit: <T extends unknown>(extensions: T) => (props: IFormBunchProps<T> & {
    ref?: MutableRefObject<unknown> | ((instance: unknown) => void);
}) => JSX.Element;
