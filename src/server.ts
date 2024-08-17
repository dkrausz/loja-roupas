import { app } from "./app";
import { initStore } from "./configs/initStore.config";
const port = 3000;

app.listen(port, async () => {
  console.log(`Api sucessfully started on port ${port}`);
  await initStore();
});
