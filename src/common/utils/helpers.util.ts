export function isBoolean(value: string | boolean) {
  return ['true', true, 'false', false].includes(value);
}

export function toBoolean(value: string | boolean) {
  return [true, 'true'].includes(value)
    ? true
    : [false, 'false'].includes(value)
      ? false
      : value;
}
