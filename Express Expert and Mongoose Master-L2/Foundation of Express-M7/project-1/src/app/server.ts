import { Server } from "http";
import app from "./app";
const PORT = 5000;

let server: Server;

async function bootstrap() {
   server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

bootstrap();
