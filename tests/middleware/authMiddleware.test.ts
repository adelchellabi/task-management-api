import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import { StatusCodes } from "http-status-codes";
import {
  AuthenticatedRequest,
  TokenUserData,
  authorizeRoles,
  isAuthenticated,
  checkOwnershipAuthorization,
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

describe("checkOwnershipAuthorization middleware", () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      user: mockUserTokenData,
      params: {
        id: "resource_id",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    next = jest.fn();
  });

  it("should call next if user owns the resource", async () => {
    const mockResourceService = {
      findById: jest.fn().mockResolvedValue({ ownerId: "user_id" }),
      getOwnerId: jest.fn().mockReturnValue("user_id"),
    };

    await checkOwnershipAuthorization(mockResourceService)(
      req as AuthenticatedRequest,
      res as Response,
      next
    );
    expect(next).toHaveBeenCalled();
  });

  it("should call next if user is admin", async () => {
    const mockResourceService = {
      findById: jest.fn().mockResolvedValue({ ownerId: "other_user_id" }),
      getOwnerId: jest.fn().mockReturnValue("other_user_id"),
    };

    req.params!.id = "another_resource_id";
    req.user!.role = UserRole.ADMIN;

    await checkOwnershipAuthorization(mockResourceService)(
      req as AuthenticatedRequest,
      res as Response,
      next
    );
    expect(next).toHaveBeenCalled();
  });

  it("should throw AccessDeniedError if user does not own the resource and is not an admin", async () => {
    const mockResourceService = {
      findById: jest.fn().mockResolvedValue({ ownerId: "other_user_id" }),
      getOwnerId: jest.fn().mockReturnValue("other_user_id"),
    };

    req.user!.role = UserRole.USER;

    await checkOwnershipAuthorization(mockResourceService)(
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

  it("should handle errors appropriately", async () => {
    const mockResourceService = {
      findById: jest.fn().mockRejectedValue(new Error("Some error")),
      getOwnerId: jest.fn(),
    };

    await checkOwnershipAuthorization(mockResourceService)(
      req as AuthenticatedRequest,
      res as Response,
      next
    );
    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});
