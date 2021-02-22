import React, {useEffect} from 'react'

export default ({setMoonPop}) => {
  const closePopup = () => {
    setMoonPop(false)
  }

  const closePopupDim = (e) => {
    const target = e.target
    if (target.id === 'layerPopup') {
      closePopup()
    }
  }

  //--------------------------
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div id="layerPopup" onClick={closePopupDim}>
      <div className="layerContainer moon_pop">
        <h3>스페셜 DJ 활동비</h3>
        <div className="layerContent scroll_box">
          <p className="note">
            스페셜 DJ 누적 6회차부터는
            <br />
            베스트 스페셜 DJ입니다.
            <br />
            <span>
              누적 6회, 10회, 15회, 20회에는
              <br />더 많은 활동비를 지원해드립니다.
            </span>
          </p>

          <table>
            <colgroup>
              <col width="20%" />
              <col width="*" />
              <col width="20%" />
              <col width="*" />
            </colgroup>

            <thead>
              <tr>
                <th>누적</th>
                <th>활동비</th>
                <th>누적</th>
                <th>활동비</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>01회</td>
                <td>-</td>
                <td>11회</td>
                <td>2,000달</td>
              </tr>
              <tr>
                <td>02회</td>
                <td>500달</td>
                <td>12회</td>
                <td>2,000달</td>
              </tr>

              <tr>
                <td>03회</td>
                <td>700달</td>
                <td>13회</td>
                <td>2,000달</td>
              </tr>
              <tr>
                <td>04회</td>
                <td>900달</td>
                <td>14회</td>
                <td>2,000달</td>
              </tr>

              <tr>
                <td>05회</td>
                <td>1,000달</td>
                <td className="red_point">15회</td>
                <td className="red_point">10,000달</td>
              </tr>
              <tr>
                <td className="red_point">06회</td>
                <td className="red_point">3,000원</td>
                <td>16회</td>
                <td>2,000달</td>
              </tr>
              <tr>
                <td>07회</td>
                <td>2,000달</td>
                <td>17회</td>
                <td>2,000달</td>
              </tr>
              <tr>
                <td>08회</td>
                <td>2,000달</td>
                <td>18회</td>
                <td>2,000달</td>
              </tr>
              <tr>
                <td>09회</td>
                <td>2,000달</td>
                <td>19회</td>
                <td>2,000달</td>
              </tr>
              <tr>
                <td className="red_point">10회</td>
                <td className="red_point">5,000달</td>
                <td className="red_point">20회</td>
                <td className="red_point">15,000달</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button className="btnClose" onClick={closePopup}>
          닫기
        </button>
      </div>
    </div>
  )
}
