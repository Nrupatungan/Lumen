import {configDotenv} from "dotenv";
import app from "./app.js";

configDotenv({
  path: '.env.development',
  quiet: true
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
