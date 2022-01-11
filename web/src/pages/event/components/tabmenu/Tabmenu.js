import React, {useEffect, useState, useRef} from 'react'

import './tabmenu.scss'

const Tabmenu = (props) => {
	const {tab} = props
  const tabMenuRef = useRef()
  const tabBtnRef = useRef()
  const [tabFixed, setTabFixed] = useState(false)

  const tabScrollEvent = () => {
    const tabMenuNode = tabMenuRef.current
    const tabBtnNode = tabBtnRef.current
    if (tabMenuNode && tabBtnNode) {
      const tabMenuTop = tabMenuNode.offsetTop - tabBtnRef.current.clientHeight

      if (window.scrollY >= tabMenuTop) {
        setTabFixed(true)
      } else {
        setTabFixed(false)
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', tabScrollEvent)
    return () => window.removeEventListener('scroll', tabScrollEvent)
  }, [])

  useEffect(() => {
    if (tabFixed) {
      window.scrollTo(0, tabMenuRef.current.offsetTop - tabBtnRef.current.clientHeight)
    }
  }, [tab])

  // 페이지 시작
  return (
		<div className="tabContainer" ref={tabMenuRef}>
			<div className={`tabWrapper ${tabFixed === true ? 'fixed' : ''}`} ref={tabBtnRef}>
				<div className="tabmenu">
					{props.children}
				</div>
			</div>
		</div>
  )
}

export default Tabmenu
