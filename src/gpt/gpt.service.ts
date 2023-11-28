import {Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {Stream} from "typeorm";

@Injectable()
export class GptService {
    constructor(private readonly httpService: HttpService) {}

    private apiKey = "org-fYC1uVemh7NrTH0ZVfn6N1EV"
    private baseURL = "https://api.openai.com/v1/chat/completions"

    async translate(dto: {text: string, lang: string}): Promise<Stream> {
        try {
            const {data} = await this.httpService.axiosRef.post(this.baseURL, {
                messages: [{
                    role: "user",
                    content: `Translate this text into ${dto.lang}: ${dto.text}`
                }],
            }, {
                headers: {
                    "Authorization": 'bearer ' + this.apiKey,
                    "OpenAI-Organization": ""
                },
            })

            console.log(data)

            return data['choices'][0]['message']['content']
        } catch (e) {
            console.error(e.response)
        }
    }
}