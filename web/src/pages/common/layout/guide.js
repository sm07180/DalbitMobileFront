/**
 *
 */
import React, {useEffect, useContext} from 'react'
//component

const Guide = props => {
  //initalize
  const {children} = props
  const store = useContext(Context)
  //---------------------------------------------------------------------

  //---------------------------------------------------------------------
  return (
    <main className="guide">
      <nav>네비영역</nav>
      <article>{children}</article>
    </main>
  )
}
export default Guide
