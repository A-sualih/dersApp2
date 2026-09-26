export interface DriveFile {
    id: string;
    name: string;
    type: 'audio' | 'pdf';
    url: string;
    /** The PDF page where this audio lesson starts. Set manually per file. */
    pdfPage?: number;
}

export interface FileStatus {
    downloaded: boolean;
    localUri: string | null;
}

export interface Category {
    id: string;
    title: string;
    description?: string;
    files: DriveFile[];
}
