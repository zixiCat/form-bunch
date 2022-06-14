export const hasValue = (value: any): boolean => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') {
    return !!value;
  }
  if (Array.isArray(value)) {
    return !!value.length;
  }
  if (typeof value === 'object') {
    return !!Object.keys({}).length;
  }
  return true;
};
