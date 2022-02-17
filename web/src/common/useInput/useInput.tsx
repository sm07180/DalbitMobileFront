import React, { useState } from 'react';

const getUseInput = (value, setValue, validator) => {
  const onChange = event => {
    const { target: { value } } = event;
    let willUpdate = true;

    if(typeof validator === 'function') {
      willUpdate = validator(value);
    }

    if(willUpdate) {
      setValue(value);
    }
  };

  return {value, onChange}
}

/**********************************************************************************************
* @Method 설명 : useInput.tsx
* @작성일   : 2021-11-23
* @작성자   : 박성민
* @설명  : validator: onChange 시킬지 검증 함수
**********************************************************************************************/
export const UseInput = (props) => {
  const { value, setValue, validator, className, forwardedRef, placeholder, name, focus = () => {}, blur = () => {} } = props;
  const useInput = getUseInput(value, setValue, validator);
  return (
    <input {...useInput}
           type="text"
           className={className}
           name={name}
           ref={forwardedRef}
           placeholder={placeholder}
           onFocus={focus}
           onBlur={blur}
    />
  )
}

export default UseInput;