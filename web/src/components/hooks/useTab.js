/**
 * @title tab
 * @param overlap {true} 탭이 활성화되어있으면 변화가 없는데, 강제로 handler 실행
 */
/**
  //hooks
  import useTab from 'components/hooks/useTab'

  //useTab
  const tabHandler = (data, idx) => {
   console.log(idx)
  }
  //--hooks
  const title = ['탭이름1', '탭이름2', '탭이름3']
  const {tab, tabOpts, selected, setSelected} = useTab({title: title,overlap: true,  handler: tabHandler})
  //--components
  <div className="tabs">{tab}</div>
  <h1>{selected}</h1>
  <button onClick={() => { setSelected(2) }}> 2로세팅 </button>
 */
import React, {useEffect, useState, useCallback} from 'react'

const useTab = initalValue => {
  const [tabOpts, setTabOpts] = useState(initalValue)
  const [selected, setSelected] = useState(initalValue.selected)
  //---
  const tabClick = useCallback(idx => {
    setSelected(idx)
    setTabOpts({...tabOpts, selected: idx})
    if (tabOpts.overlap === true && tabOpts.overlap !== undefined && idx === selected) {
      tabOpts.handler(tabOpts, selected)
    }
  })
  const setTabTitle = useCallback(titles => {
    setTabOpts({...tabOpts, title: titles})
  })
  //---------------------------------------------------------------------
  //makeTab
  const makeTab = () => {
    return tabOpts.title.map((list, idx) => {
      return (
        <button key={idx} className={selected === idx ? 'on' : ''} onClick={() => tabClick(idx)}>
          {list}
        </button>
      )
    })
  }
  //---------------------------------------------------------------------
  useEffect(() => {
    tabOpts.handler(tabOpts, selected)
  }, [selected])
  //---------------------------------------------------------------------
  let tab = makeTab()
  return {tab, tabOpts, selected, setSelected, setTabTitle}
}
export default useTab
