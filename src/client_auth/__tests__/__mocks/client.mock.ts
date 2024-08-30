import { loadedStore } from "../../../app";
import { ClientFactory } from "../../../client/__tests__/client.factories";
import { jwtConfig } from "../../../configs/auth.config";
import { prisma } from "../../../database/prisma";
import { sign } from "jsonwebtoken";

export const loginClientMock = async () => {
  const newValidClient = ClientFactory.build(loadedStore.id);

  const client = await prisma.client.create({ data: newValidClient });

  const token = sign({}, process.env.JWT_SECRET as string, {
    expiresIn: process.env.EXPIRES_IN,
    subject: client.publicId,
  });

  return { client, token };
};
