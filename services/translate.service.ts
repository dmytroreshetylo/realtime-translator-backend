const Reverso = require('reverso-api');

export class TranslateService {
  private readonly reverso = new Reverso();

  async translate(text: string, originalLanguage: string, translateLanguage: string): Promise<string | undefined> {
    try {
      const result = await this.reverso.getTranslation(
        text,
        originalLanguage,
        translateLanguage,
      );

      return result.translations[0];
    }
    catch (err) {
      throw new Error((err as Error).message);
    }
  }
}

export const translateService = new TranslateService();