import { app } from "./app";
import { initStore } from "./configs/initStore.config";
const port = 3000;
export let storeIdActive: number = 0;

app.listen(port, async () => {
  console.log(`Api sucessfully started on port ${port}`);
  storeIdActive = (await initStore()) as number;
});
