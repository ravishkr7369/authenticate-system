import config from "./config/config.js";
import { connectDB } from "./config/connectDB.js";
import app from "./app.js";


const PORT=config.PORT||3000;


connectDB();
app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
