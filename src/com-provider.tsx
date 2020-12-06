import React from 'react';

interface IProps {
  components: Array<React.JSXElementConstructor<React.PropsWithChildren<any>>>;
  children: React.ReactNode;
  value: any;
}

const ComProvider = (props: IProps) => {
  const { components = [], children, value } = props;

  return (
    <>
      {components.reduceRight((acc, Comp, index) => {
        return <Comp value={value[index]}>{acc}</Comp>;
      }, children)}
    </>
  );
};

export default ComProvider;
