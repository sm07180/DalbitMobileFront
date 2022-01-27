import React from "react";

export default function MakeAddWrap(props) {
  //   function insert(num: any ) {
  //     if (num.length <= 4) {
  //       return num;
  //     }
  //     var count = Math.ceil(num.length / 4);
  //     var newNum = [];
  //     for (var i = 0; i < count; i++) {
  //       newNum.unshift(num.slice(-4 * (i + 1), num.length - 4 * i));
  //     }
  //     return newNum.join(" ");
  //   }

  const ShowSettingPop = (e, item) => {
    e.stopPropagation();

    props.setSettingPopup(true);
    props.setModifyInfo(item);
  };
  const checkRecent = (item) => {
    props.setRecent(item);
    props.setRecentCheck(true);
  };
  // -----------------render----------------------------------------
  return (
    <>
      <div className="AddData">
        {props.addList.map((item, index) => {
          const { accountName, accountNo, bankCode, bankName, idx } = item;
          return (
            <div key={`account` + index} className="accountItem" onClick={() => checkRecent(item)}>
              <strong className="accountItem__name">{accountName}</strong>
              <span className="accountItem__bankInfo">
                {bankName} {accountNo}
              </span>
              <button className="settingBtn" onClick={(e) => ShowSettingPop(e, item)} />
            </div>
          );
        })}
      </div>
    </>
  );
}
