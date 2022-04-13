import { ResponseModel } from "../../../domain/models/response.model";
import jwt_decode from "jwt-decode";

export const JWTStructureMiddleware = () => {
  return (
    target: Object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<Function>
  ) => {
    return {
      value: function (...args: any[]) {
        const responseBuilder = (message: string) => ({
          statusCode: 304,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: {
              status: 304,
              message: message,
            },
            data: {},
          } as ResponseModel<any>),
        });
        const event = args[0];
        const headers = event.headers || {};

        if (!headers.token) {
          return responseBuilder("Token is not present in the header");
        } else {
          try {
            const decodedToken = jwt_decode(headers.token);
          } catch (error) {
            return responseBuilder("Token does not have a right structure.");
          }
        }
        const value = descriptor.value.apply(target, args);
        return value;
      },
    };
  };
};
