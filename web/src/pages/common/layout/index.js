/**
 *
 */
import React, {useEffect, useContext} from 'react'
//component
import {Context} from 'context'

import Header from 'pages/common/header/'

const Layout = props => {
  //initalize
  const {children} = props
  const store = useContext(Context)
  //---------------------------------------------------------------------

  //---------------------------------------------------------------------
  return (
    <main className={store.state.header}>
      <Header {...store} {...props} />
      <div className="wrap">
        <article>{children}</article>
      </div>
    </main>
  )
}
export default Layout
