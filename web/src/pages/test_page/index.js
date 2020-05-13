import React from 'react'

import Seo from './seo.js'
import Lee from './lee.js'

import './test.scss'

export default () => {
  return (
    <div className="test-page">
      <Seo />
      {false && <Lee />}
    </div>
  )
}
