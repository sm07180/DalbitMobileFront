export function setCookie(c_name: string, value: any, exdays: number) {
  const exdate = new Date();
  if (exdays !== null) {
    exdate.setDate(exdate.getDate() + exdays);
  }

  const encodedValue = encodeURIComponent(value);
  const c_value = encodedValue + (exdays ? "" : "; expires=" + exdate.toUTCString());
  document.cookie = c_name + "=" + c_value + "; path=/; secure; domain=.dallalive.com";
}

export function getCookie(c_name: string): any {
  const splited = document.cookie.split(";");
  const cookies = {};
  splited.forEach((bundle) => {
    const [key, value] = bundle.split("=");
    cookies[key.trim()] = value;
  });

  if (cookies[c_name]) {
    return decodeURIComponent(cookies[c_name]);
  }

  return;
}

export function removeAllCookieData() {
  const yesterDay = (() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toUTCString();
  })();

  const splited = document.cookie.split(";");
  splited.forEach((bundle) => {
    let [key, value] = bundle.split("=");
    key = key.trim();
    document.cookie = key + "=" + "; expires=" + yesterDay + "; path=/; secure; domain=.dallalive.com";
  });
}
