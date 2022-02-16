import React from 'react'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Utility from 'components/lib/utility'

import './checkbox.scss'

const Checkbox = ({fnClick, fnChange, title = '', checked = false}) => (
  <div className='checkBox'>
    <label>
      <input
        onClick={(e) => {
          if (fnClick !== undefined) fnClick(e.target.checked)
        }}
        onChange={(e) => {
          if (fnChange !== undefined) fnChange(e.target.checked)
        }}
        type="checkbox"
        checked={checked}
        className={checked ? 'on' : ''}
      />
      <div className="titlewrap" dangerouslySetInnerHTML={{__html: Utility.nl2br(title)}}></div>
    </label>
  </div>
)
export default Checkbox
