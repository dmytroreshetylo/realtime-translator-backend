export interface HistoryModel {
  id: number;
  userUUID: string;
  originalText: string;
  translatedText: string;
  originalLanguage: string;
  translatedLanguage: string;
  date: Date;
}