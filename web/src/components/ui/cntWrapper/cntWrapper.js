import React from 'react';
// global components

import './cntWrapper.scss';

const CntWrapper = (props) => {
  const {heightFix, children} = props;

  return (
    <div id="cntWrapper" className={`${heightFix ? 'fix' : ''}`}>
      {children}
    </div>
  )
}

export default CntWrapper;