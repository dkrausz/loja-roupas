import { prisma } from "../database/prisma";
import { Factory } from "./utils/factory"

const factory = new Factory();

const createProducts = async (quantity:number)=>{

  const store = await prisma.store.findFirst();
  
  for(let i=0;i<quantity;i++){
    const newProduct = factory.productFactory();
   const newProductWithStoreId = {...newProduct, storeId:store!.id};
   const createdProduct = await prisma.product.create({data:newProductWithStoreId});

   
  };


};
  
createProducts(1500);