import { injectable } from "tsyringe";
import { TClientLogin, TClientLoginReturn } from "./inferfaces";
import { prisma } from "../database/prisma";
import bcryptjs from "bcryptjs";
import { TClient } from "../client/interfaces";
import { jwtConfig } from "../configs/auth.config";
import { sign } from "jsonwebtoken";
import { clientReturnSchema } from "../client/schemas";
import { AppError } from "../@shared/errors";

@injectable()
export class ClientAuthenticationService {
  login = async (payload: TClientLogin): Promise<TClientLoginReturn> => {
    const loadedUser: TClient = (await prisma.client.findFirst({
      where: { email: payload.email },
      include: { address: true },
    })) as TClient;

    if (!loadedUser) {
      throw new AppError(404, "User not found.");
    }

    const pwdMatch = await bcryptjs.compare(
      payload.password,
      loadedUser.password
    );

    if (!pwdMatch) {
      throw new AppError(401, "Email and password doesn't match.");
    }

    const { jwtKey, expiresIn } = jwtConfig();
    const tokenGen: string = sign({}, jwtKey, {
      expiresIn: expiresIn,
      subject: loadedUser.publicId,
    });

    return { token: tokenGen, client: clientReturnSchema.parse(loadedUser) };
  };
}
