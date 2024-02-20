import { faker } from "@faker-js/faker";

import { UserInterface, UserRole } from "../../src/models/user";

function generateFakeBaseUser() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
  };
}
export function generateFakeUser(): UserInterface {
  return { ...generateFakeBaseUser(), role: UserRole.USER };
}

export function generateFakeAdmin(): UserInterface {
  return {
    ...generateFakeBaseUser(),
    role: UserRole.ADMIN,
  };
}
