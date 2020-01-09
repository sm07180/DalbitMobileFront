/**
 * @file useClick.js
 * @brief onClick={()=>{code...}} 를 {...hooks} 형태로 사용
 * @code
 
  import useClick from '@/components/hooks/useClick'

  //공통함수
  const update = obj => {
    console.log(obj)
  }

  //--hooks
  const hooks1 = useClick(update, {code: 1})
  const hooks2 = useClick(update, {code: 2})
  const hooks3 = useClick(update, {code: 3})

  //example
  <button {...hooks1}>code1</button>
  <button {...hooks2}>code2</button>
  <button {...hooks3}>code3</button>

 */

import {useCallback, useState} from 'react'

const useClick = (clickEventHandler, initalOption) => {
  let [opts, setOpts] = useState(initalOption)
  /**
   * @brief click 이벤트가 발생시 이벤트발생
   */
  const onClick = useCallback(() => clickEventHandler(opts))
  return {opts, onClick}
}
export default useClick
