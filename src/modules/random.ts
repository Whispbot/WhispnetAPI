export function generateRandomKey(len: number = 20) {
  let str = "";
  while (str.length < len)
    str += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"[
      Math.round(Math.random() * 61)
    ];
  return str;
}
