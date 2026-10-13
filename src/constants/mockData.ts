import { Category } from '../types';
import { ALL_AUDIO_FILES } from './allAudioData';

export const DRIVE_FILES = [...ALL_AUDIO_FILES];
export const ALL_FILES = DRIVE_FILES;

export const CATEGORIES: Category[] = [
  {
    id: 'aqidatu-tahawiya-ustaz-abuhuzeyfa',
    title: 'አቂደቱ ጡሃውያ በኡስታዝ አቡ ሁዘይፋ - ክፍል 1-32',
    description: 'ከ 1 እስከ 32 የ አቂደቱ ጡሃውያ ክፍሎች በኡስታዝ አቡ ሁዘይፋ',
    files: ALL_AUDIO_FILES,
  },
];