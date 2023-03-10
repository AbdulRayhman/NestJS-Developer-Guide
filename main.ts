import { Controller, Module, Get } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
@Controller()
class AppController {
	@Get()
	getRootRoute() {
		return "Hi There!";
	}
}
@Module({ controllers: [AppController] })
class AppModule {}

async function BootStrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(5000);
}
