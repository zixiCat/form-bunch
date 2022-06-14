import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import './index.scss';
import {
  IFormItem,
  IFormRule,
  IFormSetting,
  IFormValue,
  Class,
} from '../types';
import { useStore } from './store';
import { computedExtensions } from '..';

const Render = <T extends unknown>(props: {
  className?: string;
  style?: React.CSSProperties;
  value?: IFormValue;
  items: IFormItem<T>[];
  setting?: IFormSetting;
  onChange: (form: IFormValue, item: any, key: string) => void;
}) => {
  const value = useStore((s) => s.value);
  const rule = useStore((s) => s.rule);
  const setValue = useStore((s) => s.setValue);
  const setDefaultValue = useStore((s) => s.setDefaultValue);
  const mounted = useRef<boolean>();
  const setting = useMemo(() => props.setting, [props.setting]);
  const items = useMemo(() => props.items, [props.items]);
  const defaultValue = useMemo(() => {
    const temp: IFormValue = {};
    props.items.forEach((i) => {
      if (i.defaultValue !== null && i.defaultValue !== undefined) {
        temp[i.key] = i.defaultValue;
      }
    });
    return temp;
  }, [props.items]);

  useEffect(() => {
    if (mounted.current) {
      // do componentDidUpdate logic
      setValue(props.value || {});
    } else {
      // do componentDidMount logic
      setDefaultValue({ ...props.value, ...defaultValue });
      mounted.current = true;
    }
  }, [props.value, defaultValue]);

  const layoutItem = useCallback(
    (item: IFormItem<T>, rule?: IFormRule) => ({
      item: {
        className: `form-bunch-item ${item.className || ''}`.trim(),
        style: {
          flexBasis: item.col || setting?.col || '100%',
          marginLeft: item.offset || setting?.offset || 0,
        },
      },
      label: {
        className: `form-bunch-item-label ${
          'form-bunch-labelAlign-' +
          (item.labelAlign || setting?.labelAlign || 'right')
        }`,
        style: {
          flexBasis: String(item.labelCol || setting?.labelCol || '20%'),
        },
      },
      control: {
        className: `form-bunch-item-control ${
          rule && rule[item.key]?.result === false ? 'form-bunch-error-box' : ''
        }`.trim(),
        style: {
          flexBasis: String(
            item.labelCol || setting?.labelCol
              ? item.controlCol ||
                  setting?.controlCol ||
                  `calc(100% - ${item.labelCol || setting?.labelCol})`
              : item.controlCol || setting?.controlCol || '80%'
          ),
        },
      },
      tips1: {
        style: {
          flexBasis: String(item.labelCol || setting?.labelCol || '20%'),
        },
      },
      tips2: {
        className: 'form-bunch-item-error',
        style: {
          flexBasis: String(
            item.labelCol || setting?.labelCol
              ? item.controlCol ||
                  setting?.controlCol ||
                  `calc(100% - ${item.labelCol || setting?.labelCol})`
              : item.controlCol || setting?.controlCol || '80%'
          ),
        },
      },
    }),
    [setting]
  );

  return (
    <div
      className={`form-bunch ${props.className || ''}`.trim()}
      style={props.style}
    >
      {items.map((item) => {
        const Comp = computedExtensions[item.type || ''] as Class;
        return (
          <div key={item.key} {...layoutItem(item).item}>
            {item.label && (
              <div {...layoutItem(item).label}>
                {item.required && (
                  <span className="form-bunch-item-require">*</span>
                )}
                {item.label}
              </div>
            )}
            <div {...(layoutItem(item, rule)?.control || {})}>
              {item?.type ? (
                <Comp
                  {...(item.typeProps || {})}
                  value={value[item.key] || null}
                  onChange={(e: any) => {
                    const newForm: IFormValue = {
                      ...value,
                      [item.key]: e,
                    };
                    props.onChange(newForm, newForm[item.key], item.key);
                    setValue(newForm);
                  }}
                />
              ) : (
                (item.render &&
                  item.render(value[item.key], (state: any) => {
                    const newForm: IFormValue = {
                      ...value,
                      [item.key]: state,
                    };
                    props.onChange(newForm, newForm[item.key], item.key);
                    setValue(newForm);
                  })) ||
                ''
              )}
            </div>
            {setting?.hasTips || rule[item.key]?.error ? (
              <div className="form-bunch-item-tips">
                {item.label && <div {...layoutItem(item).tips1} />}
                <div {...layoutItem(item).tips2}>
                  {rule[item.key]?.result === false && rule[item.key]?.error}
                </div>
              </div>
            ) : (
              <div className="form-bunch-item-noTips" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default memo(Render) as typeof Render;
