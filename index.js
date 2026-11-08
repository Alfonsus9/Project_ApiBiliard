import 'dotenv/config';
import app from './app.js';
import cookieParser from "cookie-parser";
const port = process.env.PORT || 3000;

app.use(cookieParser());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});