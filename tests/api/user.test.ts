import request from "supertest";
import app from "../../src/app";
import { StatusCodes } from "http-status-codes";
import { UserServiceInterface } from "../../src/services/interfaces/userServiceInterface";
import { UserService } from "../../src/services/userService";
import User, { UserDocumentInterface, UserRole } from "../../src/models/user";
import { generateFakeAdmin, generateFakeUser } from "../data/userFixture";
import { generateToken } from "../../src/utils/utils";

const BASE_URL = "/api/v1/users";

describe("Unauthenticated user endpoints", () => {
  let userService: UserServiceInterface;

  beforeAll(async () => {
    userService = new UserService();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should create a new user", async () => {
    const userData = generateFakeUser();

    const response = await request(app)
      .post(`${BASE_URL}/register`)
      .send(userData)
      .expect(StatusCodes.CREATED);

    expect(response.body).toHaveProperty("_id");
    expect(response.body.firstName).toBe(userData.firstName);
    expect(response.body.lastName).toBe(userData.lastName);
  });

  it("should return 409 if user email already exists", async () => {
    const userData = generateFakeUser();

    await userService.createUser(userData);

    await request(app)
      .post(`${BASE_URL}/register`)
      .send(userData)
      .expect(StatusCodes.CONFLICT);
  });

  it("should return unauthorized when trying to get all users without authentication", async () => {
    const response = await request(app)
      .get(BASE_URL)
      .expect(StatusCodes.UNAUTHORIZED);
    expect(response.body.error).toBe("Unauthorized. Please provide a token");
  });

  it("should return unauthorized when trying to update a user without authentication", async () => {
    const id = "65d09100dd6294bf821d3aa6";
    const response = await request(app)
      .patch(`${BASE_URL}/${id}`)
      .expect(StatusCodes.UNAUTHORIZED);
    expect(response.body.error).toBe("Unauthorized. Please provide a token");
  });
});
describe("Authenticated user endpoints", () => {
  let userService: UserServiceInterface;
  let userAuthToken: string;
  let user: UserDocumentInterface;

  beforeAll(async () => {
    userService = new UserService();

    const userData = generateFakeUser();
    user = await userService.createUser(userData);
    userAuthToken = generateToken({ id: user.id, role: user.role });
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should return user profile for authenticated user", async () => {
    const response = await request(app)
      .get(`${BASE_URL}/profile`)
      .auth(userAuthToken, { type: "bearer" })
      .expect(StatusCodes.OK);

    expect(response.body.firstName).toBe(user.firstName);
    expect(response.body.lastName).toBe(user.lastName);
  });

  it("should update user profile for authenticated user", async () => {
    const updatedUserData = {
      firstName: "Updated first name",
      lastName: "Updated last name",
    };

    const response = await request(app)
      .patch(`${BASE_URL}/${user._id}`)
      .auth(userAuthToken, { type: "bearer" })
      .send(updatedUserData)
      .expect(StatusCodes.OK);

    expect(response.body.firstName).toBe(updatedUserData.firstName);
    expect(response.body.lastName).toBe(updatedUserData.lastName);
  });

  it("should not update another user's profile", async () => {
    const otherUserData = generateFakeUser();
    const otherUser = await userService.createUser(otherUserData);

    const updatedUserData = {
      firstName: "Updated first name",
      lastName: "Updated last name",
    };

    const response = await request(app)
      .patch(`${BASE_URL}/${otherUser._id}`)
      .auth(userAuthToken, { type: "bearer" })
      .send(updatedUserData)
      .expect(StatusCodes.FORBIDDEN);

    expect(response.body.error).toBe(
      "Access denied. You do not have permission to access this resource."
    );
  });
});

describe("Admin-only endpoints ", () => {
  let userService: UserServiceInterface;
  let admin: UserDocumentInterface;
  let adminAuthToken: string;
  beforeAll(async () => {
    userService = new UserService();
    const adminData = generateFakeAdmin();
    admin = await userService.createUser(adminData);
    adminAuthToken = generateToken({ id: admin.id, role: admin.role });
  });

  afterEach(async () => {
    await User.deleteMany({ role: { $ne: UserRole.ADMIN } });
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should return all users", async () => {
    const userData = generateFakeUser();

    await userService.createUser(userData);

    const response = await request(app)
      .get(BASE_URL)
      .auth(adminAuthToken, {
        type: "bearer",
      })
      .expect(StatusCodes.OK);

    expect(response.body.length).toBe(2);
    expect(response.body[0].firstName).toBe(admin.firstName);
    expect(response.body[1].firstName).toBe(userData.firstName);
  });

  it("should return a user by ID", async () => {
    const userData = generateFakeUser();

    const createdUser = await userService.createUser(userData);

    const response = await request(app)
      .get(`${BASE_URL}/${createdUser._id}`)
      .auth(adminAuthToken, {
        type: "bearer",
      })
      .expect(StatusCodes.OK);

    expect(response.body.firstName).toBe(userData.firstName);
    expect(response.body._id).toBe(createdUser._id.toString());
  });

  it("should return user not found", async () => {
    const notFoundId = "65d09100dd6294bf821d3aa6";
    const response = await request(app)
      .get(`${BASE_URL}/${notFoundId}`)
      .auth(adminAuthToken, {
        type: "bearer",
      })
      .expect(StatusCodes.NOT_FOUND);

    expect(response.body.error).toBe(`User with ID '${notFoundId}' not found`);
  });

  it("should update a user", async () => {
    const userData = generateFakeUser();

    const createdUser = await userService.createUser(userData);

    const updatedUserData = {
      firstName: "Updated first name",
      lastName: "Updated last name",
    };

    const response = await request(app)
      .patch(`${BASE_URL}/${createdUser._id}`)
      .auth(adminAuthToken, {
        type: "bearer",
      })
      .send(updatedUserData)
      .expect(StatusCodes.OK);

    expect(response.body.firstName).toBe(updatedUserData.firstName);
    expect(response.body.lastName).toBe(updatedUserData.lastName);
  });

  it("should delete a user", async () => {
    const userData = generateFakeUser();

    const createdUser = await userService.createUser(userData);

    const response = await request(app)
      .delete(`${BASE_URL}/${createdUser._id}`)
      .auth(adminAuthToken, {
        type: "bearer",
      })
      .expect(StatusCodes.OK);

    const users = await userService.findUsers();

    expect(response.body).toBeTruthy();
    expect(users.length).toEqual(1);
    expect(users[0].firstName).toBe(admin.firstName);
  });
});
