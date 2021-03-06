/**
 * @file components/ui/icon.js
 * @brief 아이콘 컴포넌트
 * @example import creatIcon from 'components/ui/icon'
 * @example creatIcon('like', '#000', 30, 30)
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
            stroke={color || '#FF3C7B'}
            strokeWidth="3"
            d="M20.771 8.998c6.502 0 11.772 5.268 11.772 11.767s-5.27 11.768-11.772 11.768c-6.502 0-11.772-5.269-11.772-11.768 0-6.499 5.27-11.767 11.772-11.767z"
          />
          <path fill="none" fillRule="evenodd" stroke={color || '#FF3C7B'} strokeLinecap="round" strokeWidth="3" d="M37.662 36.616l-8.826-8.32" />
        </svg>
      )
      break
    case 'profile':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width || '49.5'} height={height || '49.5'}>
          <path fill="none" fillRule="evenodd" stroke={color || '#FF3C7B'} strokeWidth="3" d="M24.015 8.998A9.016 9.016 0 1 1 15 18.014a9.014 9.014 0 0 1 9.015-9.016z" />
          <path
            fill="none"
            fillRule="evenodd"
            stroke={color || '#FF3C7B'}
            strokeLinecap="round"
            strokeWidth="3"
            d="M10.874 37.014c0-7.258 5.884-13.141 13.141-13.141 7.258 0 13.14 5.883 13.14 13.141"
          />
        </svg>
      )
      break
    case 'menu':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="49.5" height="49.5">
          <path fill="#F5F5F5" fillRule="evenodd" stroke={color || '#FF3C7B'} strokeLinecap="round" strokeWidth="3" d="M37.998 35.998h-28M37.998 15.998h-28M37.998 25.998h-28" />
        </svg>
      )
      break
    case 'headphone':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width || '49'} height={height || '49'} viewBox={`0 0 ${width * 1.6} ${height * 1.6}`}>
          <path fill="none" fillRule="evenodd" stroke={color || '#FF3C7B'} strokeWidth="2" d="M13.998 26.997v-7c0-5.522 4.477-8.999 9.999-8.999h.001c5.523 0 10 3.477 10 8.999v7" />
          <path
            fill="none"
            fillRule="evenodd"
            stroke={color || '#FF3C7B'}
            strokeWidth="2"
            d="M11.999 21.997h3.999v14h-3.999a4 4 0 0 1-4-3.999v-6a4 4 0 0 1 4-4.001zM31.998 21.997h4c2.208 0 4 1.791 4 4.001v6a4 4 0 0 1-4 3.999h-4v-14z"
          />
        </svg>
      )
    case 'like':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width || '49'} height={height || '49'} viewBox={`0 0 ${width * 1.6} ${height * 1.6}`}>
          <path
            fill="none"
            fillRule="evenodd"
            stroke={color || '#FF3C7B'}
            strokeWidth="2"
            d="M35.851 24.945L23.933 36.23 12.026 24.949a7.685 7.685 0 0 1 5.388-13.163 7.668 7.668 0 0 1 6.522 3.637 7.67 7.67 0 0 1 6.522-3.637 7.685 7.685 0 0 1 5.393 13.159z"
          />
        </svg>
      )
    default:
      break
  }
}
