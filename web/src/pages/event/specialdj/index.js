import React from 'react'
import {Route, Switch} from 'react-router-dom'
import SpecialdjWrite from './checkwrite.js'
import Specialdj from './specialdj.js'
const Event_page = [
  {path: 'write', component: SpecialdjWrite, exact: true},
  {path: '', component: Specialdj, exact: true}
]

export default () => {
  return (
    <Switch>
      {Event_page.map((item, index) => {
        const {path, component, exact} = item
        return <Route key={index} path={`/event/specialdj/${path}`} component={component} exact={exact} />
      })}
    </Switch>
  )
}
