const useCheckEmpty = (value: string) => {
  if (value === '') {
    return 'This field is required';
  } else {
    return '';
  }
};

const useCheckLength = (value: string, length: number) => {
  if (value.length < length) {
    return 'This field must be at least ' + length + ' characters';
  } else {
    return '';
  }
};

const useCheckMaxLength = (value: string, length: number) => {
  if (value.length > length) {
    return 'This field must be at most ' + length + ' characters';
  } else {
    return '';
  }
};

export { useCheckEmpty, useCheckLength, useCheckMaxLength };
