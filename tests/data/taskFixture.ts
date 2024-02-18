import { faker } from "@faker-js/faker";

import { TaskInterface, taskPriorityValues } from "../../src/models/task";

export function generateFakeTask(): TaskInterface {
  return {
    title: faker.lorem.words(),
    description: faker.lorem.paragraph(),
    completed: faker.datatype.boolean(),
    priority: faker.helpers.arrayElement(taskPriorityValues),
  };
}
