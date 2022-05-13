import { createElement } from "lib/create_element";

type Element = {
  type: string;
  text?: string;
  className?: string;
  style?: object;
  children?: Array<Element>;
  event?: Array<{ type: string; callback: () => void }>;
};

export function NormalMsgFormat(data: Element) {
  return createElement(data);
}

export function GiftActionFormat(data: Element) {
  return createElement(data);
}

export function SystemStartMsg(data: Element) {
  return createElement(data);
}

export function SystemEventMsg(data: Element) {
  return createElement(data);
}

export function ReqGood(data: Element) {
  return createElement(data);
}
