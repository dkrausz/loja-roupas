import { inject, injectable } from "tsyringe";
import { IAddressService } from "./interfaces";
import { Request, Response } from "express";

@injectable()
export class AddressController {
  constructor(@inject("AddressService") private service: IAddressService) {}

  public createAddress = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const newAddress = await this.service.createAddress(
      req.body,
      req.params.id
    );
    return res.status(201).json(newAddress);
  };

  public getAddressById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    // provavelmente vai mudar nao faz sentido essa pesquisa
    const address = await this.service.getAddressById(Number(req.params));
    return res.status(200).json(address);
  };

  public getAddressByUser = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    //nao sei se faz sentido essa pesquisa
    const addresses = await this.service.getAddressByUser(req.params.id);
    return res.status(200).json(addresses);
  };

  public updateAddress = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const updatedAddress = await this.service.updateAddress(
      req.body,
      Number(req.params.addressid)
    );
    return res.status(200).json(updatedAddress);
  };

  public deleteAddress = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    await this.service.deleteAddress(Number(req.params.addressid));
    return res.status(204).json("");
  };
}
