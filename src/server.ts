import { app } from "./app";
import { initStore } from "./configs/initStore.config";
import { IStoreId } from "./store/interfaces";
const port = 3000;
export let loadedStore: IStoreId = { id: 0 };

const initApp = async () => {
  await initStore(loadedStore);
  console.log(`Id carregado: ${loadedStore.id}`);
};
initApp();
app.listen(port, () => {
  console.log(`Api sucessfully started on port ${port}`);
});
