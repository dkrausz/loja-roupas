import { app } from "./app";
import { initStore } from "./configs/initStore.config";
import { IStoreId } from "./store/interfaces";
const port = 3000;
export const loadedStore: IStoreId = { id: 0 };

const initApp = async () => {
  await initStore(loadedStore);
};
initApp();

app.listen(port, () => {
  console.log(`Api sucessfully started on port ${port}`);
});
