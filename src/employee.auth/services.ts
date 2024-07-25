import { injectable } from "tsyringe";
import { TemployeeLogin, TemployeeLoginReturn } from "./schema";
import { prisma } from "../database/prisma";
import { returnEmployeeCreateSchema } from "../employee/schemas";
import bcryptjs from "bcryptjs";
import { jwtConfig } from "../configs/auth.config";
import { sign } from "jsonwebtoken";


@injectable()
export class EmployeeAuthService {
  async login(body: TemployeeLogin): Promise<TemployeeLoginReturn> {
    const employee = await prisma.employee.findFirst({
      where: { name: body.name }
    });

    if (!employee) {
      throw new Error("Employee not found.");
    }

    const compare = await bcryptjs.compare(body.password, employee.password);

    if (!compare) {
      console.log(compare);
      throw new Error("name and password doesn't match.");
    }

    const { jwtKey, expiresIn } = jwtConfig();
    const tokenGen: string = sign({ accessLevel: employee.accessLevel }, jwtKey, {
      expiresIn: expiresIn,
      subject: employee.id.toString(),
    });

    return { token: tokenGen, employee: returnEmployeeCreateSchema.parse(employee) };
  };
};


