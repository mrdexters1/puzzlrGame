import type { TS } from "@/toolbox/utils/index";

export const HttpStatus = {
  // success:
  OK: 200,
  CREATED: 201,
  // redirect:
  MOVED_PERMANENTLY: 301,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  TEMPORARY_REDIRECT: 307,
  // clientError:
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  UNPROCESSABLE_CONTENT: 422,
  // serverError:
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export type HttpStatusOK = TS.ValuesOf<
  Pick<typeof HttpStatus, "OK" | "CREATED">
>;
export type HttpStatusRedirect = TS.ValuesOf<
  Pick<
    typeof HttpStatus,
    "MOVED_PERMANENTLY" | "SEE_OTHER" | "TEMPORARY_REDIRECT"
  >
>;
export type HttpStatusClientError = TS.ValuesOf<
  Pick<
    typeof HttpStatus,
    | "BAD_REQUEST"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "METHOD_NOT_ALLOWED"
    | "UNPROCESSABLE_CONTENT"
  >
>;
export type HttpStatusServerError = TS.ValuesOf<
  Pick<
    typeof HttpStatus,
    | "INTERNAL_SERVER_ERROR"
    | "NOT_IMPLEMENTED"
    | "BAD_GATEWAY"
    | "SERVICE_UNAVAILABLE"
    | "GATEWAY_TIMEOUT"
  >
>;
