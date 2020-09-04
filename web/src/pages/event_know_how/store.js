import React, {useState, createContext} from 'react'

const KnowHowContext = createContext()
const {Provider} = KnowHowContext
function KnowHowProvider(props) {
  const [list, setList] = useState([])
  const [tab, setTab] = useState(0)
  const [condition, setCondition] = useState(0)
  const [order, setOrder] = useState(0)
  const [mine, setMine] = useState(0)
  const [myCnt, setMyCnt] = useState(0)
  const KnowHowState = {
    list,
    tab,
    condition,
    order,
    mine,
    myCnt
  }

  const KnowHowAction = {
    setList,
    setTab,
    setCondition,
    setOrder,
    setMine,
    setMyCnt
  }

  const bundle = {
    KnowHowState,
    KnowHowAction
  }

  return <Provider value={bundle}>{props.children}</Provider>
}

export {KnowHowContext, KnowHowProvider}
