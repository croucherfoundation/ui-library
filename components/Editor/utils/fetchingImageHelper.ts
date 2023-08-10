export const getIsFetchingImage = (): boolean => {

  let isFetchMethod = false,
    imageApi: unknown = "",
    imageCookieName: unknown = "",
    imageHeaderName: unknown = "";

  // For NEXT Environment
  if (typeof process !== "undefined") {
    imageApi = process?.env?.NEXT_PUBLIC_EDITOR_IMAGE_API;
    imageCookieName = process?.env?.NEXT_PUBLIC_EDITOR_IMAGE_COOKIE_NAME;
    imageHeaderName = process?.env?.NEXT_PUBLIC_EDITOR_IMAGE_HEADER_NAME;
    isFetchMethod =
      imageApi && imageCookieName && imageHeaderName ? true : false;

    return isFetchMethod;
  }

  // For Vite Environment
  if (typeof import.meta.env !== "undefined") {
    imageApi = import.meta.env.VITE_EDITOR_IMAGE_API;
    imageCookieName = import.meta.env.VITE_EDITOR_IMAGE_COOKIE_NAME;
    imageHeaderName = import.meta.env.VITE_EDITOR_IMAGE_HEADER_NAME;
    isFetchMethod =
      imageApi && imageCookieName && imageHeaderName ? true : false;

    return isFetchMethod;
  }

  return isFetchMethod;
};

function getCookie(cname: string) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export const getFetchingImageInfo = (base64: string) => {
  let isFetchMethod = false,
    imageApi = "",
    imageCookieName = "",
    imageHeaderName = "";

  // For Vite Environment
  if (typeof import.meta.env !== "undefined") {
    imageApi = import.meta.env.VITE_EDITOR_IMAGE_API as string;
    imageCookieName = import.meta.env.VITE_EDITOR_IMAGE_COOKIE_NAME as string;
    imageHeaderName = import.meta.env.VITE_EDITOR_IMAGE_HEADER_NAME as string;
    isFetchMethod =
      imageApi && imageCookieName && imageHeaderName ? true : false;
  }

  // For NEXT Environment
  if (typeof process !== "undefined") {
    imageApi = process?.env?.NEXT_PUBLIC_EDITOR_IMAGE_API as string;
    imageCookieName = process?.env?.NEXT_PUBLIC_EDITOR_IMAGE_COOKIE_NAME as string;
    imageHeaderName = process?.env?.NEXT_PUBLIC_EDITOR_IMAGE_HEADER_NAME as string;
    isFetchMethod =
      imageApi && imageCookieName && imageHeaderName ? true : false;
  }

  const cookieValue = getCookie(imageCookieName);
  const myHeaders = new Headers();
  myHeaders.append(imageHeaderName, cookieValue);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    image: {
      name: "Editor Image",
      caption: "Editor Caption Image",
      record_type: "page",
      data: base64,
    },
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  const returnData = {
    imageApi,
    imageCookieName,
    imageHeaderName,
    requestOptions,
    isSuccess: isFetchMethod && !!cookieValue,
  };

  return returnData;
};
