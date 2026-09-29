import { Category } from '../types';
import { LUMMATUL_IITQAD_FILES } from './lummatulIitqadData';

// Helper to get direct download links from Google Drive
const getDirectLink = (id: string) => `https://drive.google.com/uc?id=${id}&export=download`;

export const DRIVE_FILES = [...LUMMATUL_IITQAD_FILES];
export const ALL_FILES = DRIVE_FILES;

export const CATEGORIES: Category[] = [
    {
        id: 'lummatul-iitqad',
        title: 'ሉምአቱል ኢእቲቃድ',
        description: 'የሉምአቱል ኢእቲቃድ ደርስ ስብስቦች',
        files: LUMMATUL_IITQAD_FILES,
    },
];
