import {Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import {Stream} from "typeorm";

@Injectable()
export class GptService {
    constructor(private readonly httpService: HttpService) {
    }

    private org = "org-fYC1uVemh7NrTH0ZVfn6N1EV"
    private apiKey = "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"
    private baseURL = "https://api.openai.com/v1/chat/completions"

    async translate(dto: { text: string, lang: string }): Promise<string> {
        try {
            const {data} = await this.httpService.axiosRef.post(this.baseURL, {
                model: 'gpt-3.5-turbo',
                messages: [
                    {role: "system", content: `You are a useful assistant who translates text into ${dto.lang}.`},
                    {
                        role: "user",
                        content: dto.text
                    }],
            }, {
                headers: {
                    "Authorization": 'Bearer ' + this.apiKey,
                    "Content-Type": "application/json"
                },
            })

            return data['choices'][0]['message']['content']
        } catch (e) {
            console.error(e.response)
        }
    }
}