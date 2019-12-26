/*

//hooks
import useClick from 'components/hooks/useClick'

  공통함수
  const update = obj => {
    console.log(obj)
  }

  //hooks설정
  const hooks1 = useClick(update, {code: 1})
  const hooks2 = useClick(update, {code: 2})
  const hooks3 = useClick(update, {code: 3})

  //적용
  <button {...hooks1}>code1</button>
  <button {...hooks2}>code2</button>
  <button {...hooks3}>code3</button>

 */
import {useCallback, useState} from 'react'

const useClick = (clickEventHandler, initalOption) => {
  let [opts, setOpts] = useState(initalOption)
  //onClickEventHandler
  /*
  const onClick = () => {
    clickEventHandler(opts)
  }
*/
  const onClick = useCallback(() => clickEventHandler(opts))
  return {opts, onClick}
}
export default useClick
