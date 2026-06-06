export interface DiaryEntry {
  id: string;
  title: string;
  location: string;
  country: string;
  date: string;
  content: string;
  mood: 'happy' | 'excited' | 'peaceful' | 'tired' | 'sad';
  weather: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  tags: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type MoodType = DiaryEntry['mood'];
export type WeatherType = DiaryEntry['weather'];
