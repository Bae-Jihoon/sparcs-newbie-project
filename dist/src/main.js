"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const NODE_ENV = process.env.NODE_ENV || 'local';
const envFilePath = path.resolve(__dirname, `../.env.${NODE_ENV}`);
if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
    console.log(`Loaded environment variables from ${envFilePath}`);
}
else {
    dotenv.config();
    console.log('Loaded environment variables from default .env file');
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map