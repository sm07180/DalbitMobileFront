/**
 * @file components/ui/icon.js
 * @brief 아이콘 컴포넌트
 * @example <Icon type="search" fill={COLOR_MAIN} width={48} height={48}/>
 */

import React from 'react'

const getViewBox = type => {
  switch (type) {
    case 'search':
      return '0 0 48 48'
    case 'login':
      return '0 0 36 36'
    case 'menu':
      return '0 0 40 26'
    default:
      return '0 0 32 32'
  }
}

const getPath = type => {
  switch (type) {
    case 'search':
      return (
        <g transform="translate(11 11)">
          <path
            d="M14.741 2.13a11.333 11.333 0 0 1 8.684 18.615l5.412 5.4a1.422 1.422 0 1 1-2.012 2.012l-5.454-5.5a11.206 11.206 0 0 1-6.6 2.139 11.333 11.333 0 1 1 0-22.667zm0 19.833a8.5 8.5 0 1 0-8.5-8.5 8.5 8.5 0 0 0 8.5 8.5z"
            transform="translate(-3.436 -2.13)"
          />
        </g>
      )
    case 'login':
      return (
        <g transform="translate(6 6)">
          <path d="M12 15a5 5 0 0 0 5-5V6A5 5 0 0 0 7 6v4a5 5 0 0 0 5 5zM9 6a3 3 0 0 1 6 0v4a3 3 0 0 1-6 0z" />
          <path d="M11 18.93V22a1 1 0 0 0 2 0v-3.07A8 8 0 0 0 20 11v-1a1 1 0 0 0-2 0v1a6 6 0 0 1-12 0v-1a1 1 0 0 0-2 0v1a8 8 0 0 0 7 7.93z" />
        </g>
      )
    case 'menu':
      return (
        <path d="M 22.8196 15.7456C 22.0005 16.5862 20.9038 17.0508 19.7317 17.0542C 18.5632 17.0444 17.46 16.5994 16.6362 15.7646L 1.09009 0L 38.1626 0L 22.8196 15.7456ZM 0 1.06567L 11.2952 12.5818L 0 24.1392L 0 1.06567ZM 27.9519 12.623L 39.2878 24.1233L 39.2878 1.06567L 27.9519 12.623ZM 23.7844 16.9265L 27.0105 13.6885L 38.1833 25.082L 1.10547 25.082L 12.4006 13.6885L 15.6772 16.9512C 16.7539 18.0415 18.1877 18.6418 19.7185 18.6418L 19.7363 18.6418C 21.2734 18.6375 22.7109 18.0281 23.7844 16.9265Z" />
      )
    case 'microphone':
      return (
        <g transform="translate(6 6)">
          <path d="M12 15a5 5 0 0 0 5-5V6A5 5 0 0 0 7 6v4a5 5 0 0 0 5 5zM9 6a3 3 0 0 1 6 0v4a3 3 0 0 1-6 0z" />
          <path d="M11 18.93V22a1 1 0 0 0 2 0v-3.07A8 8 0 0 0 20 11v-1a1 1 0 0 0-2 0v1a6 6 0 0 1-12 0v-1a1 1 0 0 0-2 0v1a8 8 0 0 0 7 7.93z" />
        </g>
      )
    default:
      return <path />
  }
}

const SVGIcon = ({type = '', style = {}, fill = '#000', viewBox = '', width = '100%', height = '100%'}) => (
  <svg width={width} style={style} height={height} fill={fill} xmlns="http://www.w3.org/2000/svg" viewBox={viewBox || getViewBox(type)}>
    {getPath(type)}
  </svg>
)

export default SVGIcon
