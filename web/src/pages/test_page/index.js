import React from 'react';

import Seo from './seo.js'
import Lee from './lee.js'
import Test from './test.js';

export default () => {
  return (
    <div className="test-page">
      {false && <Seo />}
      {false && <Lee />}
      <Test />
    </div>
  )
}

