import React from "react";
import "./index.scss";

type PropsType = {
  /** react hooks */
  state: string;
  setState(value: string): void;
  /** 한 줄에 들어갈 총 글자 갯수 */
  cols?: number;
  /** 총 몇줄까지 지원할지 */
  rows?: number;
  /** 총 글자 갯수 */
  maxLength?: any;
  className?: string;
  placeholder?: string;
};

let keyCode;
export function DalbitTextArea(props: PropsType) {
  const { cols, rows, maxLength, setState, state, className, placeholder } = props;

  const handleChange = (e) => {
    let value = e.target.value;
    if (value.length > maxLength) return;
    const lines = value.split("\n").length;
    const a = value.split("\n");

    if (rows !== undefined && cols !== undefined) {
      if (keyCode === 8) {
        setState(value);
      } else if (lines < rows) {
        if (a[lines - 1].length % cols === 0 && a[lines - 1].length > 0) {
          value += "\n";
        } else if (a[lines - 1].length > cols) {
          const b = a[lines - 1].substr(0, cols) + "\n" + a[lines - 1].substr(cols, a[lines - 1].length - 1);
          a.pop();
          if (a.length > 0) value = a.join("\n") + "\n" + b;
          else {
            value = b;
          }
        }
        setState(value);
      } else if (lines === rows && cols === a[lines - 2].length) {
        if (a[lines - 1].length <= cols) {
          // console.log(value);
          setState(value);
        } else {
          const b = a[lines - 1].substr(0, cols);
          a.pop();
          if (a.length > 0) value = a.join("\n") + "\n" + b;
          else {
            value = b;
          }
          setState(value);
        }
      } else {
        return;
      }
    } else if (rows !== undefined && cols === undefined) {
      if (lines <= rows) {
        setState(value);
      }
    } else if (rows === undefined && cols !== undefined) {
      if (a[lines - 1].length % cols === 0 && a[lines - 1].length > 0) {
        value += "\n";
      } else if (a[lines - 1].length > cols) {
        const b = a[lines - 1].substr(0, cols) + "\n" + a[lines - 1].substr(cols, a[lines - 1].length - 1);
        a.pop();
        if (a.length > 0) value = a.join("\n") + "\n" + b;
        else {
          value = b;
        }
      }
      setState(value);
    } else {
      setState(value);
    }
  };
  const test = (e) => {
    keyCode = e.keyCode;
  };
  return (
    <textarea
      id="DalbitTextArea"
      className={className || ""}
      placeholder={placeholder || ""}
      value={state}
      onKeyDown={(e) => {
        test(e);
      }}
      onChange={(e) => handleChange(e)}
      maxLength={maxLength || undefined}
    ></textarea>
  );
}

export default DalbitTextArea;
