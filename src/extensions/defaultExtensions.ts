import Input from './input';

const defaultExtensions = {
  input: [
    Input,
    {
      onChange: ['onChange', 'e.target.value'],
    },
  ],
};

export default defaultExtensions;
