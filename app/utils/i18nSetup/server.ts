export const setCookie = async (req: Request, name: string, value: string) => {
  const cookie = `${name}=${value}; Path=/; HttpOnly; SameSite=Strict`;
  req.headers.set("Set-Cookie", cookie);
};

export function getCookie(req: Request, name: string) {
  const cookies = req.headers.get("Cookie");
  if (!cookies) {
    return;
  }
  const cookie = cookies
    .split(";")
    .find((cookie) => cookie.trim().startsWith(name));
  return cookie?.split("=")[1];
}

export const setLangCookie = async (req: Request, lang: string) => {
  return setCookie(req, "language-tag", lang);
};

export const getLangCookie = async (req: Request) => {
  return getCookie(req, "language-tag");
};

export const getLang = async <T extends string>(
  req: Request,
  defaultValue: T,
) => {
  const value = (await getLangCookie(req)) ?? defaultValue;
  return value as T;
};
