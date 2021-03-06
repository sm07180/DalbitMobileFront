import React, { useMemo, useContext } from "react";

import { convertDateToText } from "lib/rank_fn";

import NoResult from "common/ui/no_result";

import RankListTop from "./rank_list_top";
import RankList from "./rank_list";
import MyProfile from "../myProfile";
import {useSelector} from "react-redux";

export default function RankListWrap({ empty }) {
  const rankState = useSelector(({rankCtx}) => rankCtx);

  const { formState } = rankState;

  const realTimeCheck = useMemo(() => {
    if (convertDateToText(formState[formState.pageType].dateType, formState[formState.pageType].currentDate, 0)) {
      return true;
    } else {
      return false;
    }
  }, [formState]);

  return (
    <>
      {empty === true ? (
        <NoResult type="default" text="랭킹이 없습니다." />
      ) : (
        <>
          <div className="rankTop3Box">
            <MyProfile />
            <RankListTop />

            {/* {!convertDateToText(formState[formState.pageType].dateType, formState[formState.pageType].currentDate, 0) && (
              <RankListTop />
            )} */}
          </div>
          <RankList />
        </>
      )}
    </>
  );
}
