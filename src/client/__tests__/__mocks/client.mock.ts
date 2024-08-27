import { loadedStore } from "../../../app";
import { jwtConfig } from "../../../configs/auth.config";
import { prisma } from "../../../database/prisma";
import { ClientFactory } from "../client.factories";
import { sign } from "jsonwebtoken";

export const loginClientMock = async () => {
  const newValidClient = ClientFactory.build(loadedStore.id);

  const client = await prisma.client.create({ data: newValidClient });
  const { jwtKey, expiresIn } = jwtConfig();

  const token = sign({}, process.env.JWT_SECRET as string, {
    expiresIn: expiresIn,
    subject: client.publicId,
  });

  return { client, token };
};
