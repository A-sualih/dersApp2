import * as FileSystem from 'expo-file-system/legacy';

/**
 * Get the local file URI for a given filename
 * @param filename The name of the file
 * @returns The local file URI
 */
export function getLocalUri(filename: string): string {
    return `${FileSystem.documentDirectory}${filename}`;
}

/**
 * Check if a file exists locally
 * @param filename The name of the file to check
 * @returns Promise<boolean> True if the file exists, false otherwise
 */
export async function checkFileExists(filename: string): Promise<boolean> {
    try {
        const fileUri = getLocalUri(filename);
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        return fileInfo.exists;
    } catch (error) {
        console.error('Error checking file existence:', error);
        return false;
    }
}

/**
 * Download a file from a remote URL to local storage
 * @param remoteUrl The remote URL to download from
 * @param filename The name to save the file as
 * @returns Promise<string> The local file URI
 */
export async function downloadFile(remoteUrl: string, filename: string): Promise<string> {
    try {
        const localUri = getLocalUri(filename);
        const downloadResult = await FileSystem.downloadAsync(remoteUrl, localUri);
        return downloadResult.uri;
    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
}

/**
 * Delete a local file
 * @param filename The name of the file to delete
 * @returns Promise<void>
 */
export async function deleteFile(filename: string): Promise<void> {
    try {
        const fileUri = getLocalUri(filename);
        await FileSystem.deleteAsync(fileUri, { idempotent: true });
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
}

/**
 * Get information about a local file
 * @param filename The name of the file
 * @returns Promise<FileSystem.FileInfo> File information
 */
export async function getFileInfo(filename: string): Promise<FileSystem.FileInfo> {
    try {
        const fileUri = getLocalUri(filename);
        return await FileSystem.getInfoAsync(fileUri);
    } catch (error) {
        console.error('Error getting file info:', error);
        throw error;
    }
}
