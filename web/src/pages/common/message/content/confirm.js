/**
 *
 */
import React, {useContext} from 'react'
//context
import {Context} from 'context'

//components

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)

  //makeContents
  const makeContents = () => {
    if (context.message.visible) {
      console.log(context.message)
    }
  }

  //---------------------------------------------------------------------
  return (
    <React.Fragment>
      <div>confirm</div>
    </React.Fragment>
  )
}
