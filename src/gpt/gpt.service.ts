import {Injectable} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";
import * as fs from 'fs';
import * as path from "path";

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
      return dto.text
    }
  }


  protected async audioToText(dto: { file: Express.Multer.File, lang: string }): Promise<string> {
    try {
      const {data} = await this.httpService.axiosRef.post("https://api.openai.com/v1/audio/translations", {
        model: 'whisper-1',
        file: fs.createReadStream(path.resolve('upload', dto.file.filename))
      }, {
        headers: {
          "Authorization": 'Bearer ' + this.apiKey,
          "Content-Type": "multipart/form-data"
        },
      })

      return data.text
    } catch (e) {
      console.error(e.response)
    }
  }

  protected async textToAudio(dto: { text }): Promise<ArrayBuffer> {
    try {
      const {data} = await this.httpService.axiosRef.post("https://api.openai.com/v1/audio/speech", {
        model: 'tts-1',
        input: dto.text,
        voice: "alloy"
      }, {
        headers: {
          "Authorization": 'Bearer ' + this.apiKey,
          "Content-Type": "application/json"
        },
        responseType: 'arraybuffer'
      })

      return data
    } catch (e) {
      return e
    }
  }

  async translateAudio(dto: { file: Express.Multer.File, lang: string }): Promise<string> {
    try {
      const text = await this.audioToText(dto)
      const audio = await this.textToAudio({text})

      const parseName = path.parse(dto.file.path)
      const newName = 'translate-' + parseName.name + ".mp3"
      const newFileName = path.resolve('upload', newName)
      const buffer = Buffer.from(audio);

      await fs.promises.writeFile(newFileName, buffer);

      return newName
    } catch (e) {
      console.error(e.response)
      return dto.file.fieldname
    }
  }
}