import React, { useState, useEffect, useCallback } from "react";
import DalbitCheckbox from ".";
import { action } from "@storybook/addon-actions";
export default {
  title: "Dalbit Checkbox",
  component: DalbitCheckbox,
};

export const Default = () => {
  const [check, setCheck] = useState<boolean>(false);

  const changeCheckStatus = useCallback(() => {
    const checked = check === true ? false : true;
    setCheck(checked);
  }, [check]);

  return <DalbitCheckbox status={check} callback={changeCheckStatus} />;
};

export const MultipleCheckBox = () => {
  type exampleType = {
    id: number;
    checked: boolean;
    value: string;
  };

  const initData: Array<exampleType> = [
    { id: 1, checked: false, value: "one" },
    { id: 2, checked: false, value: "two" },
    { id: 3, checked: false, value: "three" },
    { id: 4, checked: false, value: "four" },
  ];

  const [allCheck, setAllCheck] = useState<boolean>(false);
  const [example, setExample] = useState<Array<exampleType>>(initData);

  const allCheckCallback = () => {
    const checked = allCheck === true ? false : true;
    setAllCheck(checked);

    if (checked === true) {
      setExample([
        { id: 1, checked: true, value: "one-new" },
        { id: 2, checked: true, value: "two-new" },
        { id: 3, checked: true, value: "three-new" },
        { id: 4, checked: true, value: "four-new" },
      ]);
    } else if (checked === false) {
      setExample([
        { id: 1, checked: false, value: "one-new" },
        { id: 2, checked: false, value: "two-new" },
        { id: 3, checked: false, value: "three-new" },
        { id: 4, checked: false, value: "four-new" },
      ]);
    }
  };

  const firstCheckboxCallback = (value) => {
    if (value !== undefined) {
      const thisCheckbox = example.find((ex) => ex.value === value);

      let checked = false;

      if (thisCheckbox !== undefined) {
        checked = thisCheckbox.checked === true ? false : true;
        const thisValue = example.filter((ex) => ex.value != value);

        const multipleCheck = [...thisValue, { id: thisCheckbox.id, checked: checked, value: value }];

        multipleCheck.sort(function(a, b) {
          return a.id < b.id ? -1 : 1;
        });

        let allState = true;

        for (let index = 0; index < multipleCheck.length; index++) {
          if (multipleCheck[index].checked === false) allState = false;
        }
        setAllCheck(allState);

        setExample([...multipleCheck]);
      }
    }
  };

  return (
    <>
      <div>
        <div>all checkbox</div>
        <div>
          <DalbitCheckbox status={allCheck} callback={allCheckCallback} />
        </div>
        <div>checkbox</div>
      </div>
      {example.map((data, idx) => {
        const { checked } = data;
        return (
          <DalbitCheckbox key={`checkbox-${idx}`} status={checked} callback={() => firstCheckboxCallback(data.value)} />
        );
      })}
    </>
  );
};

export const checkSize = () => {
  const [check, setCheck] = useState<boolean>(false);

  const changeCheckStatus = useCallback(() => {
    const checked = check === true ? false : true;
    setCheck(checked);
  }, [check]);

  return <DalbitCheckbox status={check} callback={changeCheckStatus} size={50} />;
};

export const BackgroundColor = () => {
  const [check, setCheck] = useState<boolean>(false);

  const changeCheckStatus = useCallback(() => {
    const checked = check === true ? false : true;
    setCheck(checked);
  }, [check]);

  return <DalbitCheckbox status={check} callback={changeCheckStatus} bgColor="#fff000" />;
};
