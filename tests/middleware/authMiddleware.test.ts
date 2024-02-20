import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { StatusCodes } from "http-status-codes";
import {
  AuthenticatedRequest,
  TokenUserData,
  authorizeRoles,
  isAuthenticated,
} from "../../src/middleware/authMiddleware";
import { UserRole } from "../../src/models/user";

const mockUserTokenData: TokenUserData = {
  id: "user_id",
  role: UserRole.USER,
};

const mockExpiredToken = "expired_token";
const mockValidToken = jwt.sign(
  mockUserTokenData,
  process.env.SECRET_KEY as string
);

describe("isAuthenticated middleware", () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {
        authorization: `Bearer ${mockValidToken}`,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    next = jest.fn();
  });

  it("should call next if valid token is provided", () => {
    isAuthenticated(req as AuthenticatedRequest, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it("should throw UnauthorizedError if no token provided", () => {
    delete req.headers?.authorization;
    isAuthenticated(req as AuthenticatedRequest, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized. Please provide a token",
    });
  });

  it("should throw UnauthorizedError if token is expired", () => {
    req.headers!.authorization = `Bearer ${mockExpiredToken}`;
    isAuthenticated(req as AuthenticatedRequest, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({
      error: "Unauthorized. The provided token is invalid or has expired.",
    });
  });
});

describe("authorizeRoles middleware", () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      user: mockUserTokenData,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    next = jest.fn();
  });

  it("should call next if user has required role", () => {
    const rolesToAuthorize: UserRole[] = [UserRole.USER];
    authorizeRoles(rolesToAuthorize)(
      req as AuthenticatedRequest,
      res as Response,
      next
    );
    expect(next).toHaveBeenCalled();
  });

  it("should throw AccessDeniedError if user doesn't have required role", () => {
    const rolesToAuthorize: UserRole[] = [UserRole.ADMIN];
    authorizeRoles(rolesToAuthorize)(
      req as AuthenticatedRequest,
      res as Response,
      next
    );
    expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    expect(res.json).toHaveBeenCalledWith({
      error:
        "Access denied. You do not have permission to access this resource.",
    });
  });

  it("should throw AccessDeniedError if user is not authenticated", () => {
    delete req.user;
    const rolesToAuthorize: UserRole[] = [UserRole.USER];
    authorizeRoles(rolesToAuthorize)(
      req as AuthenticatedRequest,
      res as Response,
      next
    );
    expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    expect(res.json).toHaveBeenCalledWith({
      error:
        "Access denied. You do not have permission to access this resource.",
    });
  });
});
