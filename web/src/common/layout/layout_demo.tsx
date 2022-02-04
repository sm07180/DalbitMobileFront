import React, { useState, useEffect, useContext, useRef } from "react";
import Layout from "common/layout";
import Header from "common/ui/header";
import "../clip.scss";

export default function layoutDemo(props: any) {
  useEffect(() => {}, []);

  return (
    <Layout>
      <Header title="데모페이지" />
      <div className="layoutDemo subContent gray">레이아웃 데모페이지</div>
    </Layout>
  );
}
