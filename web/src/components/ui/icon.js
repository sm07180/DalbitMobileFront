/**
 * @file components/ui/icon.js
 * @brief 아이콘 컴포넌트
 * @example <Icon type="search" fill={COLOR_MAIN} width={48} height={48}/>
 */

import React, {useEffect, useContext} from 'react'

export default (name, color, width, height) => {
  switch (name) {
    case 'search':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="49.5" height="49.5">
          <path
            fill="none"
            fillRule="evenodd"
            stroke={color ? color : "#8556F6"}
            strokeWidth="3"
            d="M20.771 8.998c6.502 0 11.772 5.268 11.772 11.767s-5.27 11.768-11.772 11.768c-6.502 0-11.772-5.269-11.772-11.768 0-6.499 5.27-11.767 11.772-11.767z"
          />
          <path fill="none" fillRule="evenodd" stroke={color ? color : "#8556F6"} strokeLinecap="round" strokeWidth="3" d="M37.662 36.616l-8.826-8.32" />
        </svg>
      )
      break
    case 'profile':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="49.5" height="49.5">
          <path fill="none" fillRule="evenodd" stroke={color ? color : "#8556F6"} strokeWidth="3" d="M24.015 8.998A9.016 9.016 0 1 1 15 18.014a9.014 9.014 0 0 1 9.015-9.016z"/>
          <path fill="none" fill-rule="evenodd" stroke={color ? color : "#8556F6"} strokeLinecap="round" strokeWidth="3" d="M10.874 37.014c0-7.258 5.884-13.141 13.141-13.141 7.258 0 13.14 5.883 13.14 13.141"/>
      </svg>
      )
      break
    case 'menu':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="49.5" height="49.5">
          <path fill="#F5F5F5" fillRule="evenodd" stroke={color ? color : "#8556F6"}  strokeLinecap="round" strokeWidth="3" d="M37.998 35.998h-28M37.998 15.998h-28M37.998 25.998h-28"/>
       </svg>
      )
      break
    default:
      break
  }
}
