/// <reference types="react" />
import { IFormRule, IFormValue } from '../types';
import { StoreApi } from 'zustand';
interface Store {
    value: IFormValue;
    initRule: IFormRule;
    rule: IFormRule;
    defaultValue: IFormValue;
    setValue: (value: IFormValue) => void;
    verify: (params: {
        value: IFormValue;
        initError: {
            [x: string]: string;
        };
    }) => void;
    verifyAll: (params: {
        value: IFormValue;
        initError: {
            [x: string]: string;
        };
    }) => boolean;
    setInitRule: (initRule: IFormRule) => void;
    setDefaultValue: (defaultValue: IFormValue) => void;
    reset: () => void;
}
export declare const Provider: ({ createStore, children, }: {
    createStore: () => StoreApi<Store>;
    children: import("react").ReactNode;
}) => import("react").FunctionComponentElement<import("react").ProviderProps<StoreApi<Store>>>, useStore: {
    (): Store;
    <U>(selector: import("zustand").StateSelector<Store, U>, equalityFn?: import("zustand").EqualityChecker<U>): U;
};
declare const store: () => import("zustand").UseBoundStore<StoreApi<Store>>;
export default store;
