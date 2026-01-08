import { translate } from '@vitalets/google-translate-api';

export class TranslateService {
  async translate(text: string, originalLanguage: string, translateLanguage: string): Promise<string | undefined> {

    try {
      const result = await translate(text, { from: originalLanguage, to: translateLanguage });

      return result.text;
    }
    catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

export const translateService = new TranslateService();
