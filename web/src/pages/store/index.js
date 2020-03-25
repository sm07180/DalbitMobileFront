/**
 * @file /store/index.js
 * @brief 스토어
 */
import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import _ from 'lodash'
import Utility from 'components/lib/utility'

//components
//
export default props => {
  //---------------------------------------------------------------------
  const context = useContext(Context)

  //useState
  const [list, setList] = useState(false)

  //---------------------------------------------------------------------

  async function getStoreList() {
    const res = await Api.store_list({})
    if (res.result === 'success' && _.hasIn(res, 'data')) {
      setList(res.data.list)
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }

  //---------------------------------------------------------------------
  //map
  const creatList = () => {
    if (list) {
      return list.map((item, index) => {
        return (
          <div key={item.storeNo} applestoreid={item.appleStoreId}>
            <img src={item.img}></img>
            <p>{item.storeNm}</p>
            <p>{Utility.addComma(item.price)}원</p>
            <button
              onClick={() => {
                if (context.token.isLogin) {
                  context.action.updatePopup('CHARGE', {
                    name: item.storeNm,
                    price: Utility.addComma(item.price)
                  })
                } else {
                  context.action.updatePopup('LOGIN')
                }
              }}>
              구매
            </button>
          </div>
        )
      })
    }
  }

  //useEffect
  useEffect(() => {
    //context.action.updateMediaPlayerStatus(true)
    getStoreList()
  }, [])
  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      <Content>
        <h2>스토어</h2>
        {list ? (
          <List>{creatList()}</List>
        ) : (
          <NoResult>
            <NoImg />
            <span>조회된 결과가 없습니다.</span>
          </NoResult>
        )}
      </Content>
    </Layout>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  width: 1464px;
  min-height: 300px;
  margin: 0 auto;
  padding: 40px 0 100px 0;
  h2 {
    font-size: 28px;
    font-weight: 600;
    color: ${COLOR_MAIN};
    text-align: center;
  }

  @media (max-width: 1480px) {
    width: 95%;
  }
`

const List = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding-top: 70px;
  div {
    width: 15%;
    padding: 15px;
    border: 1px solid #eee;
    text-align: center;
    img {
      width: 80%;
      margin-bottom: 15px;
    }
    p {
      padding-bottom: 5px;
      color: #555;
      transform: skew(-0.03deg);
    }
    p + p {
      padding-top: 8px;
    }
    button {
      margin: 10px 0 5px 0;
      padding: 10px 30px;
      border-radius: 5px;
      background: ${COLOR_MAIN};
      color: #fff;
    }
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    flex-wrap: wrap;
    div {
      width: 30%;
    }
  }
`

const NoResult = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 60px;

  & > span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 282px;
    height: 26px;
    font-size: 24px;
    font-weight: 400;
    line-height: 1.25;
    letter-spacing: -0.6px;
    color: #616161;
    margin-top: 30px;

    @media (max-width: ${WIDTH_MOBILE}) {
      font-size: 18px;
    }
  }
`

const NoImg = styled.div`
  display: flex;
  background: url('${IMG_SERVER}/images/api/img_noresult.png') no-repeat center center;
  width: 299px;
  height: 227px;
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 90%;
    height: 198;
  }
`
