import { StatusCodes } from 'http-status-codes';

export type ErrorCodeType = string;

export type ErrorCode = {
  type: ErrorCodeType;
  statusCode: StatusCodes;
};

export const ErrorCodes: Record<string, ErrorCode> = {
  // RESOURCE STATES
  RESOURCE_ALREADY_EXISTS: {
    type: 'RESOURCE_ALREADY_EXISTS',
    statusCode: StatusCodes.CONFLICT,
  },
  RESOURCE_NOT_FOUND: {
    type: 'RESOURCE_NOT_FOUND',
    statusCode: StatusCodes.NOT_FOUND,
  },
  WORKSPACE_NOT_FOUND: {
    type: 'WORKSPACE_NOT_FOUND',
    statusCode: StatusCodes.NOT_FOUND,
  },

  // AUTHENTICATION
  USER_NOT_FOUND: {
    type: 'USER_NOT_FOUND',
    statusCode: StatusCodes.NOT_FOUND,
  },
  ORGANIZATION_NOT_FOUND: {
    type: 'ORGANIZATION_NOT_FOUND',
    statusCode: StatusCodes.NOT_FOUND,
  },
  INVALID_SESSION_CLAIMS: {
    type: 'INVALID_SESSION_CLAIMS',
    statusCode: StatusCodes.UNAUTHORIZED,
  },

  // STRIPE
  STRIPE_CUSTOMER_DELETED: {
    type: 'STRIPE_CUSTOMER_DELETED',
    statusCode: StatusCodes.NOT_FOUND,
  },
  STRIPE_CUSTOMER_NOT_LINKED: {
    type: 'STRIPE_CUSTOMER_NOT_LINKED',
    statusCode: StatusCodes.NOT_FOUND,
  },
  STRIPE_UNHANDLED_WEBHOOK_EVENT: {
    type: 'STRIPE_UNHANDLED_WEBHOOK_EVENT',
    statusCode: StatusCodes.BAD_REQUEST,
  },

  // GENERIC
  INTERNAL_MISCONFIGURATION: {
    type: 'INTERNAL_MISCONFIGURATION',
    statusCode: StatusCodes.NOT_IMPLEMENTED,
  },
  UNHANDLED_ERROR: {
    type: 'UNHANDLED_ERROR',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  },
} as const;
