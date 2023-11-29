import {Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {Stream} from "typeorm";

@Injectable()
export class GptService {
    constructor(private readonly httpService: HttpService) {}

    private org = "org-fYC1uVemh7NrTH0ZVfn6N1EV"
    private apiKey = "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"
    private baseURL = "https://api.openai.com/v1/chat/completions"

    async translate(dto: {text: string, lang: string}): Promise<Stream> {
        try {
            const {data} = await this.httpService.axiosRef.post(this.baseURL, {
                model: 'gpt-3.5-turbo-0613',
                messages: [{
                    role: "user",
                    content: `Translate this text into ${dto.lang}: ${dto.text}`
                }],
            }, {
                headers: {
                    "Authorization": 'Bearer ' + this.apiKey,
                    "OpenAI-Organization": this.org
                },
            })

            console.log(data)

            return data['choices'][0]['message']['content']
        } catch (e) {
            console.error(e.response)
        }
    }
}