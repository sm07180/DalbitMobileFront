import React from 'react'
import '../../index.scss'
import {IMG_SERVER} from 'context/config'

const Guidance = () => {
  return (
    <>
      <div id="benefitsDetail">
        <h3 className="title">
          π μ£Όκ° ν΄λ¦½ TOP λ­μ»€μ λμ ν΄ λ³΄μΈμ!
          <p>μ²­μ·¨μλ€μ μ°μμΈμ΄ λ  μ μμ΅λλ€.</p>
        </h3>
        <div className="datailContent">
          <ul className="pointCount">
            <li>
              μ²­μ·¨ 1λΆ μ΄μ <span>1μ </span>
            </li>
            <li>
              μ λ¬Ό 1λ¬ λΉ <span>2μ </span>
            </li>
            <li>
              μ’μμ 1λ² λΉ <span>3μ </span>
            </li>
          </ul>

          <ul className="noticeList">
            <li>Β· μ£Όκ° ν΄λ¦½ TOP3 νμμκ²λ λ°°μ§ ννμ λλ¦½λλ€.</li>
            <li>Β· ν΄λ¦½ λ±λ‘ ν κ³΅κ°λ ν΄λ¦½λ§ λ­νΉ λμμ΄ λ  μ μμ΅λλ€.</li>
            <li>Β· μ’μμ μ μλ μΌμ£ΌμΌ κ° λ§€μΌ 1ν 1κ±΄μ λν μ μκ° λ°μλ©λλ€.</li>
          </ul>

          <div className="tableBox">
            {/*<p className="tableBox__title">μΌκ° ν΄λ¦½λ­νΉ TOP3 νν</p>*/}

            {/*<table>*/}
            {/*  <colgroup>*/}
            {/*    <col width="*" />*/}
            {/*    <col width="28%" />*/}
            {/*    <col width="28%" />*/}
            {/*    <col width="28%" />*/}
            {/*  </colgroup>*/}

            {/*  <thead>*/}
            {/*    <tr>*/}
            {/*      <th>μΌκ°</th>*/}
            {/*      <th>1μ</th>*/}
            {/*      <th>2μ</th>*/}
            {/*      <th>3μ</th>*/}
            {/*    </tr>*/}
            {/*  </thead>*/}

            {/*  <tbody>*/}
            {/*    <tr>*/}
            {/*      <td>λ¬</td>*/}
            {/*      <td>*/}
            {/*        <img src={`${IMG_SERVER}/svg/ic_moon_s.svg`} className="dal" /> λ¬ 100*/}
            {/*      </td>*/}
            {/*      <td>*/}
            {/*        <img src={`${IMG_SERVER}/svg/ic_moon_s.svg`} className="dal" /> λ¬ 50*/}
            {/*      </td>*/}
            {/*      <td>*/}
            {/*        <img src={`${IMG_SERVER}/svg/ic_moon_s.svg`} className="dal" /> λ¬ 30*/}
            {/*      </td>*/}
            {/*    </tr>*/}
            {/*  </tbody>*/}
            {/*</table>*/}

            <p className="tableBox__title">μ£Όκ° ν΄λ¦½ TOP3 νμ νν</p>

            <table>
              <colgroup>
                <col width="*" />
                <col width="28%" />
                <col width="28%" />
                <col width="28%" />
              </colgroup>

              <thead>
                <tr>
                  <th>μ£Όκ°</th>
                  <th>1μ</th>
                  <th>2μ</th>
                  <th>3μ</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>λ°°μ§</td>
                  <td>
                    <span className="badge">
                      <img src={`${IMG_SERVER}/svg/ic_topclip_w01.svg`} />
                      ν΄λ¦½ μ£Όκ°1
                    </span>
                  </td>
                  <td>
                    <span className="badge">
                      <img src={`${IMG_SERVER}/svg/ic_topclip_w02.svg`} />
                      ν΄λ¦½ μ£Όκ°2
                    </span>
                  </td>
                  <td>
                    <span className="badge">
                      <img src={`${IMG_SERVER}/svg/ic_topclip_w03.svg`} />
                      ν΄λ¦½ μ£Όκ°3
                    </span>
                  </td>
                </tr>
                {/*<tr>*/}
                {/*  <td>λ¬</td>*/}
                {/*  <td>*/}
                {/*    <img src={`${IMG_SERVER}/svg/ic_moon_s.svg`} className="dal" /> λ¬ 200*/}
                {/*  </td>*/}
                {/*  <td>*/}
                {/*    <img src={`${IMG_SERVER}/svg/ic_moon_s.svg`} className="dal" /> λ¬ 100*/}
                {/*  </td>*/}
                {/*  <td>*/}
                {/*    <img src={`${IMG_SERVER}/svg/ic_moon_s.svg`} className="dal" /> λ¬ 50*/}
                {/*  </td>*/}
                {/*</tr>*/}
              </tbody>
            </table>
            <div className="tableBox__notice">
              β» μ£Όκ° ν΄λ¦½ TOP3 νμμκ² μ μ©λλ λ°°μ§λ
              <br /> <strong>λ­νΉνμ΄μ§μ λ§μ΄ νλ‘νμμ νμΈμ΄ κ°λ₯ν©λλ€.</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Guidance
