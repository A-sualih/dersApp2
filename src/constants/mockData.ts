import { Category } from '../types';
import { ALL_AUDIO_FILES } from './allAudioData';

export const DRIVE_FILES = [...ALL_AUDIO_FILES];
export const ALL_FILES = DRIVE_FILES;

export const CATEGORIES: Category[] = [
  {
    id: 'huze-aqida-ustaz-abuhuzeyfa',
    title: 'ኹዝ አቂዳ በኡስታዝ አቡ ሁዘይፋ - ክፍል 1-25',
    description: 'ከ 1 እስከ 25 የ ኹዝ አቂዳ ክፍሎች በኡስታዝ አቡ ሁዘይፋ',
    files: ALL_AUDIO_FILES,
  },
];