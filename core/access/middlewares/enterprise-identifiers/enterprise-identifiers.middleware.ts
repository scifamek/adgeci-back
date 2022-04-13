import { ResponseModel } from "../../../domain/models/response.model";

import jwt_decode from "jwt-decode";
import {
  DATABASE_NAME_HEADER,
  ENTERPRISE_ID_HEADER,
} from "../../constants/enterprise-identifiers.constants";

export const EnterpriseIdentifiersMiddleware = () => {
  return (
    target: Object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<Function>
  ) => {
    return {
      value: function (...args: any[]) {
        const event = args[0];
        const headers = event.headers;
        const decodedToken = jwt_decode(headers.token);
        const arePresent =
          decodedToken[ENTERPRISE_ID_HEADER] ||
          decodedToken[DATABASE_NAME_HEADER];
        if (!arePresent) {
          return {
            statusCode: 304,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code: {
                status: 304,
                message: `The token does not have ${ENTERPRISE_ID_HEADER} key or ${DATABASE_NAME_HEADER} key`,
              },
              data: {},
            } as ResponseModel<any>),
          };
        }

        const value = descriptor.value.apply(target, args);
        return value;
      },
    };
  };
};
