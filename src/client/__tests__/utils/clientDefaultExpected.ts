import { TClient, TClientRegister } from "../../interfaces";

export const clientDefaultResponseExpected = (
  data: TClient,
  expected: TClientRegister
) => {
  expect(data.id).toBeDefined();
  expect(data.publicId).toBeDefined();
  expect(data.name).toBe(expected.name);
  expect(data.email).toBe(expected.email);
  expect(data.password).toBe(expected.password);
  expect(data.birthDate).toBe(expected.birthDate);
  expect(data.CPF).toBe(expected.CPF);
  expect(data.phone).toBe(expected.phone);
  expect(data.storeId).toBe(expected.storeId);
};
