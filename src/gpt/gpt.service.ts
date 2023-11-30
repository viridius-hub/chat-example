import {Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";

@Injectable()
export class GptService {
    constructor(private readonly httpService: HttpService) {
    }

    private apiKey = process.env.OPENAI_API_KEY
    private baseURL = "https://api.openai.com/v1/chat/completions"

    async translate(dto: { text: string, lang: string }): Promise<string> {
        try {
            const {data} = await this.httpService.axiosRef.post(this.baseURL, {
                model: 'gpt-4',
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