import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import './index.scss';
import { IFormItem, IFormRule, IFormSetting, IFormValue } from './form-bunch';
import { computedTypeMap } from './plugins';
import { storeCtx } from './index';

const Render = (props: {
  className?: string;
  style?: React.CSSProperties;
  value?: IFormValue;
  items: IFormItem[];
  setting?: IFormSetting;
  onChange: (form: IFormValue, item: any, key: string) => void;
}) => {
  const value = useContext(storeCtx.getContext('value'));
  const rule = useContext(storeCtx.getContext('rule'));
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
    storeCtx.dispatch('setValue', defaultValue);
    storeCtx.dispatch('setDefaultValue', defaultValue);
  }, [defaultValue]);

  const layoutItem = useCallback(
    (item: IFormItem, rule?: IFormRule) => ({
      item: {
        className: `form-com-item ${item.className || ''}`.trim(),
        style: {
          flexBasis: item.col || setting?.col || '100%',
          marginLeft: item.offset || setting?.offset || 0,
        },
      },
      label: {
        className: `form-com-item-label ${
          'form-com-labelAlign-' +
          (item.labelAlign || setting?.labelAlign || 'right')
        }`,
        style: {
          flexBasis: String(item.labelCol || setting?.labelCol || '20%'),
        },
      },
      control: {
        className: `form-com-item-control ${
          rule && rule[item.key]?.result === false ? 'form-com-error-box' : ''
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
        className: 'form-com-item-error',
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

  console.log('render render');

  return (
    <div
      className={`form-com ${props.className || ''}`.trim()}
      style={props.style}
    >
      {items.map((item) => {
        // @ts-ignore
        const Comp = computedTypeMap[item.type || ''];

        return (
          <div key={item.key} {...layoutItem(item).item}>
            {item.label && (
              <div {...layoutItem(item).label}>
                {item.required && (
                  <span className="form-com-item-require">*</span>
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
                    storeCtx.dispatch('setValue', newForm);
                  }}
                />
              ) : (
                // @ts-ignore
                (item.render &&
                  item.render(value[item.key], (state: any) => {
                    const newForm: IFormValue = {
                      ...value,
                      [item.key]: state,
                    };
                    props.onChange(newForm, newForm[item.key], item.key);
                    storeCtx.dispatch('setValue', newForm);
                  })) ||
                ''
              )}
            </div>
            {setting?.hasTip || rule[item.key]?.error ? (
              <div className="form-com-item-tips">
                {item.label && <div {...layoutItem(item).tips1} />}
                <div {...layoutItem(item).tips2}>
                  {rule[item.key]?.result === false && rule[item.key]?.error}
                </div>
              </div>
            ) : (
              <div className="form-com-item-noTips" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default memo(Render);
