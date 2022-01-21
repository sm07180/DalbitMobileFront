import React, { useState, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
//components
import Layout from "common/layout";
import Benefit from "./rank_guide_benefit";
import Header from "common/ui/header";
import MarketingPick from "./marketing_pick";
import MarketingAdv from "./marketing_adv";
//static
import "./rank_guide.scss";

export default (props) => {
  //const [guideType, setGuideType] = useState('benefit')
  // const [guideType, setGuideType] = useState('howUse')
  const params = useParams<{ type: string }>();

  const guideType = params.type;

  const subTitle = useMemo(() => {
    if (guideType === "pick") {
      return "위클리픽";
    } else if (guideType === "marketing") {
      return "15초 광고";
    } else {
      return "랭킹 혜택";
    }
  }, []);

  return (
    <Layout>
      <Header title={subTitle} />
      <div id="ranking-guide-page" className={`subContent ${guideType !== "benefit" ? `gray` : ``}`}>
        {guideType === "benefit" && <Benefit></Benefit>}
        {guideType === "pick" && <MarketingPick></MarketingPick>}
        {guideType === "marketing" && <MarketingAdv></MarketingAdv>}
      </div>
    </Layout>
  );
};
