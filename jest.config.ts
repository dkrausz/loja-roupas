/** @type {import('ts-jest').JestConfigWithTsJest} */

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/(units)/**/*.[jt]s"],
  setupFilesAfterEnv: ["./src/configs/reflectmetadata.config.ts"],
};
