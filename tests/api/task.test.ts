import request from "supertest";
import app from "../../src/app";
import Task from "../../src/models/task";
import { generateFakeTask } from "../data/taskFixture";
import { StatusCodes } from "http-status-codes";
import { TaskService } from "../../src/services/taskService";
import { TaskServiceInterface } from "../../src/services/interfaces/taskServiceInterface";
import User, { UserDocumentInterface, UserRole } from "../../src/models/user";
import { generateFakeAdmin, generateFakeUser } from "../data/userFixture";
import { generateToken } from "../../src/utils/utils";
import { UserServiceInterface } from "../../src/services/interfaces/userServiceInterface";
import { UserService } from "../../src/services/userService";

const BASE_URL = "/api/v1/tasks";
describe("Task endpoints", () => {
  let taskService: TaskServiceInterface;
  let userService: UserServiceInterface;

  beforeAll(async () => {
    taskService = new TaskService();
    userService = new UserService();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
  });

  describe("Authenticated Task endpoints", () => {
    let user: UserDocumentInterface;
    let userAuthToken: string;

    afterEach(async () => {
      await Task.deleteMany({});
    });

    beforeAll(async () => {
      const userData = generateFakeUser();
      user = await userService.createUser(userData);
      userAuthToken = generateToken({ id: user.id, role: user.role });
    });

    it("should create a new task", async () => {
      const taskData = generateFakeTask();

      const response = await request(app)
        .post(BASE_URL)
        .auth(userAuthToken, { type: "bearer" })
        .send(taskData)
        .expect(StatusCodes.CREATED);

      expect(response.body).toHaveProperty("_id");
      expect(response.body.title).toBe(taskData.title);
      expect(response.body.description).toBe(taskData.description);
    });

    it("should return 409 if task title already exists", async () => {
      const taskData = generateFakeTask();

      await taskService.createTask(taskData);

      await request(app)
        .post(BASE_URL)
        .auth(userAuthToken, { type: "bearer" })
        .send(taskData)
        .expect(StatusCodes.CONFLICT);
    });

    it("should return Forbidden when trying to get all tasks without admin authentication", async () => {
      const response = await request(app)
        .get(BASE_URL)
        .auth(userAuthToken, { type: "bearer" })
        .expect(StatusCodes.FORBIDDEN);
      expect(response.body.error).toBe(
        "Access denied. You do not have permission to access this resource."
      );
    });

    it("should return a task by ID", async () => {
      const taskData = generateFakeTask();
      const createdTask = await taskService.createTask(taskData);

      const response = await request(app)
        .get(`${BASE_URL}/${createdTask._id}`)
        .auth(userAuthToken, { type: "bearer" })
        .expect(StatusCodes.OK);

      expect(response.body.title).toBe(taskData.title);
      expect(response.body._id).toBe(createdTask._id.toString());
    });

    it("should return task not found", async () => {
      const notFoundId = "65d09100dd6294bf821d3aa6";
      const response = await request(app)
        .get(`${BASE_URL}/${notFoundId}`)
        .auth(userAuthToken, { type: "bearer" })
        .expect(StatusCodes.NOT_FOUND);

      expect(response.body.error).toBe(
        `Task with ID '${notFoundId}' not found`
      );
    });

    it("should update a task", async () => {
      const taskData = generateFakeTask();
      const createdTask = await taskService.createTask(taskData);

      const updatedTaskData = {
        title: "Updated Title",
        description: "Updated Description",
      };

      const response = await request(app)
        .patch(`${BASE_URL}/${createdTask._id}`)
        .auth(userAuthToken, { type: "bearer" })
        .send(updatedTaskData)
        .auth(userAuthToken, { type: "bearer" })
        .expect(StatusCodes.OK);

      expect(response.body.title).toBe(updatedTaskData.title);
      expect(response.body.description).toBe(updatedTaskData.description);
    });

    it("should delete a task", async () => {
      const taskData = generateFakeTask();
      const createdTask = await taskService.createTask(taskData);

      await request(app)
        .delete(`${BASE_URL}/${createdTask._id}`)
        .auth(userAuthToken, { type: "bearer" })
        .expect(StatusCodes.OK);
      const tasks = await taskService.findAllTasks();
      expect(tasks.length).toEqual(0);
    });
  });

  describe("Admin-only endpoints ", () => {
    let admin: UserDocumentInterface;
    let adminAuthToken: string;

    beforeAll(async () => {
      const adminData = generateFakeAdmin();
      admin = await userService.createUser(adminData);
      adminAuthToken = generateToken({ id: admin.id, role: admin.role });
    });

    it("should return all tasks", async () => {
      const taskData = generateFakeTask();
      await taskService.createTask(taskData);

      const response = await request(app)
        .get(BASE_URL)
        .auth(adminAuthToken, { type: "bearer" })
        .expect(StatusCodes.OK);

      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe(taskData.title);
    });
  });
});
