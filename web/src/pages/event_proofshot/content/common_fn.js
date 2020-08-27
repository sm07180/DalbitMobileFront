import React from 'react'

export const convertContents = (item) => {
  if (item.contents.length > 100) {
    if (item.idx === detail) {
      return <span>{item.contents}</span>
    } else {
      return <span>{item.contents.slice(0, 100)}...</span>
    }
  } else {
    return <span>{item.contents}</span>
  }
}
