import React, {useState, useContext} from 'react'
import {IMG_SERVER} from 'context/config'
import {Context} from 'context'
import {useHistory} from 'react-router-dom'
import moment from 'moment'

// global components
import GenderItems from 'components/ui/genderItems/GenderItems'
import PopSlide from 'components/ui/popSlide/PopSlide'
// components
import RankList from '../../components/rankList/RankList'
// contents
// css
import '../style.scss'

const DallaguersPopSlide = (props) => {
  const {myRankInfo, rankInfo, eventDate, tabmenuType, lodingTime} = props
  const history = useHistory()
  const context = useContext(Context)
  const {token} = context

  const nowTime = moment().format('MMDDHH')

  const [popRankSlide, setPopRankSlide] = useState(false)

  // 랭킹 더보기
  const moreRank = () => {
    setPopRankSlide(true)
  }

  return (
    <>
    <section className="listWrap">
      <div className="rankWrap">
      {token.isLogin ?
        <RankList photoSize={55} listNum={myRankInfo.rankNo} rankList={myRankInfo} type="my">
          <div className="listContent">
            <div className="listItem">
              <GenderItems data={myRankInfo.mem_sex} />
              <div className="nick">{myRankInfo.mem_nick}</div>
            </div>
            <div className="listItem">
              <i className="d">{myRankInfo.ins_d_cnt}</i>
              <i className="a">{myRankInfo.ins_a_cnt}</i>
              <i className="l">{myRankInfo.ins_l_cnt}</i>
            </div>
          </div>
          <div className="listBack">
            <img src={`${IMG_SERVER}/event/rebranding/dalla_logo.png`} alt="dalla" />
            <span>{myRankInfo.dalla_cnt}</span>
          </div>
        </RankList>
        :
        <div onClick={() => history.push('/login')}>
          <RankList photoSize={0} type="my">
            <div className="listContent">
              <div className="text">로그인하고 달라를 모아보세요!</div>
            </div>
            <div className="listBack">
              <img src={`${IMG_SERVER}/event/rebranding/dalla_logo.png`} alt="dalla" />
              <span>{myRankInfo.dalla_cnt}</span>
            </div>
          </RankList>
        </div>
      }
      </div>
      {rankInfo.length > 0 || nowTime > lodingTime.end ?
        <div className="rankWrap">
          {rankInfo.map((data,index) => {
            return (
              <>
              {index < 20 &&
                <RankList photoSize={55} listNum={index} rankList={data} key={index}>
                  <div className="listContent">
                    <div className="listItem">
                      <GenderItems data={data.mem_sex} />
                      <div className="nick">{data.mem_nick}</div>
                    </div>
                  </div>
                  <div className="listBack">
                    <span>{data.dalla_cnt}</span>
                  </div>
                </RankList>
              }
              </>
            )
          })}
          <button className="moreBtn" onClick={moreRank}>더보기</button>
        </div>
        :
        <div className="noList">
          <img src={`${IMG_SERVER}/event/rebranding/listNone.png`} />
          <span>참가자들이 dalla를 만들고 있어요!</span>
        </div>
      }
    </section>
    <section>
      <img src={`${IMG_SERVER}/event/rebranding/gift-1.png`} alt="이벤트 상품 이미지" />
    </section>
    {popRankSlide &&
      <PopSlide setPopSlide={setPopRankSlide}>
        <section className="rebrandingRank">
          <h3>달라져스 : {tabmenuType} 라운드<span>{`${moment(eventDate.start).format('YY.MM.DD')} - ${moment(eventDate.end).format('MM.DD')}`}</span></h3>
          <div className="rankWrap">
            {rankInfo.map((data,index) => {
              return (
                <RankList photoSize={55} listNum={index} rankList={data} key={index}>
                  <div className="listContent">
                    <div className="listItem">
                      <GenderItems data={data.mem_sex} />
                      <div className="nick">{data.mem_nick}</div>
                    </div>
                  </div>
                  <div className="listBack">
                    <span>{data.dalla_cnt}</span>
                  </div>
                </RankList>
              )
            })}
          </div>
        </section>
      </PopSlide>
    }
    </>
  )
}
DallaguersPopSlide.defaultProps = {
  lodingTime: moment().format('MMDDHH'),
}

export default DallaguersPopSlide