type paginationData={
  page:number|null,
  perPage:number|null,
  previousPage:string|null,
  nextPage:string|null
};

type paginationResponse<T>={
  count:number,
  previousPage:string|null,
  nextPage:string|null,
  data:Array<T>

};

export {paginationData,paginationResponse};