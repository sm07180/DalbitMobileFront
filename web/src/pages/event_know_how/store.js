import React, {useState, createContext} from 'react'

const KnowHowContext = createContext()
const {Provider} = KnowHowContext
function KnowHowProvider(props) {
  const [pageName, setPageName] = useState('main')
  const [list, setList] = useState([])
  const [tab, setTab] = useState(0)
  const [condition, setCondition] = useState(0)
  const [order, setOrder] = useState(0)
  const KnowHowState = {
    pageName,
    list,
    tab,
    condition,
    order
  }

  const KnowHowAction = {
    setPageName,
    setList,
    setTab,
    setCondition,
    setOrder
  }

  const bundle = {
    KnowHowState,
    KnowHowAction
  }

  return <Provider value={bundle}>{props.children}</Provider>
}

export {KnowHowContext, KnowHowProvider}
