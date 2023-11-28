import {Module} from '@nestjs/common';
import {HttpModule} from "@nestjs/axios";
import {GptService} from "./gpt.service";

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [GptService],
    exports: [GptService]
})
export class GptModule {
}