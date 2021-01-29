import React from 'react'
import {Route, Switch} from 'react-router-dom'
import PackagejWrite from './package_write.js'
import PackageView from './package_view.js'
const Event_page = [
  {path: 'write', component: PackagejWrite, exact: true},
  {path: '', component: PackageView, exact: true}
]

export default () => {
  return (
    <Switch>
      {Event_page.map((item, index) => {
        const {path, component, exact} = item
        return <Route key={index} path={`/event/package/${path}`} component={component} exact={exact} />
      })}
    </Switch>
  )
}
