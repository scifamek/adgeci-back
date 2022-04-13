import { ResponseCodeModel } from "../domain/models/response-code.model";
import * as util from "util";
export function buildResponseCode(
  baseCode: number,
  responseCodeStructure: ResponseCodeModel,
  data: any
) {
  const regexp = new RegExp("{([a-zA-Z0-9]+)}", "gm");
  const keys = {};
  let temp = null;
  while ((temp = regexp.exec(responseCodeStructure.message))) {
    keys[temp[0]] = data[temp[1]];
  }
  let message = responseCodeStructure.message;
  for (const key in keys) {
    if (Object.prototype.hasOwnProperty.call(keys, key)) {
      const element = keys[key];
      if (element) {
        message = message.replace(key, element);
      }
    }
  }
  return {
    status: baseCode + responseCodeStructure.code,
    message: message,
  };
}
