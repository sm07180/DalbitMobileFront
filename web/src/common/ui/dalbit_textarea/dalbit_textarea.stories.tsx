import React, { useState, useEffect } from "react";
import DalbitTextArea from "./index";

export default {
  title: "Dalbit TextArea",
  component: DalbitTextArea,
};

export const Default = () => {
  const [value, setValue] = useState<string>("");
  return <DalbitTextArea cols={20} rows={3} state={value} setState={setValue} />;
};
