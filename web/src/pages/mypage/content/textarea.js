import React from 'react'
let keyCode
export function DalbitTextArea(props) {
  const {cols, rows, maxLength, setState, state, className, placeholder} = props

  const handleChange = (e) => {
    let value = e.target.value
    if (value.length > 100) return
    const lines = value.split('\n').length
    const a = value.split('\n')

    if (rows !== undefined && cols !== undefined) {
      if (keyCode === 8) {
        setState(value)
      } else if (lines < rows) {
        if (a[lines - 1].length % cols === 0 && a[lines - 1].length > 0) {
          value += '\n'
        } else if (a[lines - 1].length > cols) {
          const b = a[lines - 1].substr(0, cols) + '\n' + a[lines - 1].substr(cols, a[lines - 1].length - 1)
          a.pop()
          if (a.length > 0) value = a.join('\n') + '\n' + b
          else {
            value = b
          }
        }
        setState(value)
      } else if (lines === rows && cols === a[lines - 2].length) {
        if (a[lines - 1].length <= cols) {
          // console.log(value);
          setState(value)
        } else {
          const b = a[lines - 1].substr(0, cols)
          a.pop()
          if (a.length > 0) value = a.join('\n') + '\n' + b
          else {
            value = b
          }
          setState(value)
        }
      } else {
        return
      }
    } else if (rows !== undefined && cols === undefined) {
      if (lines <= rows) {
        setState(value)
      }
    } else if (rows === undefined && cols !== undefined) {
      if (a[lines - 1].length % cols === 0 && a[lines - 1].length > 0) {
        value += '\n'
      } else if (a[lines - 1].length > cols) {
        const b = a[lines - 1].substr(0, cols) + '\n' + a[lines - 1].substr(cols, a[lines - 1].length - 1)
        a.pop()
        if (a.length > 0) value = a.join('\n') + '\n' + b
        else {
          value = b
        }
      }
      setState(value)
    } else {
      setState(value)
    }
  }
  const test = (e) => {
    keyCode = e.keyCode
  }
  return (
    <textarea
      id="DalbitTextArea"
      className={className || ''}
      placeholder={placeholder || ''}
      value={state}
      onKeyDown={(e) => {
        test(e)
      }}
      onChange={(e) => handleChange(e)}
      maxLength={maxLength || undefined}></textarea>
  )
}

export default DalbitTextArea
