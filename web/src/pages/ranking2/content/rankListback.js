import React from 'react'

const rankList = props => {
  const RankList = props.djlist
  console.log(RankList)
  return (
    <div>
       {RankList && RankList.map((item, index) => {
          const {rank,upDown,profImg,nickNm,gender,gift,broadcast} = item
          return (
            <div key={index}>
               <span>{rank}</span>
               <span>{upDown}</span>
               <div>
                <img src={profImg.thumb62x62}/>
       <p>{nickNm}</p>
       {gender && gender === 'f' && <span>여자</span>}
       {gender && gender === 'n' && <span>-</span>}
       {gender && gender === 'm' && <span>남자</span>}
       {/* {ispecial && ispecial === true && <span>스페셜DJ</span>} */}
       <p>{gift}</p>
       <p>{broadcast}</p>
               </div>
            </div>
          )
        })}
    </div>
  );
};

export default rankList;  