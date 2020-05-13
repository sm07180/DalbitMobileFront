import React from 'react'

import Seo from './seo.js'
import Lee from './lee.js'

export default () => {
  return (
    <div className="test-page">
      {false && <Seo />}
      <Lee />
    </div>
  )
}
