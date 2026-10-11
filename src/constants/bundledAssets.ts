import { Asset } from 'expo-asset';

// Import PDF - ኹዝ አቂዳ በኡስታዝ አቡ ሁዘይፋ
const pdfAsset = require('../../assets/media/pdf/خذ عقيدتك من الكتاب والسنة.pdf');

// Import audio files (25 files) - ኹዝ አቂዳ (sorted by number 001-025)
const audioAssets = [
  require('../../assets/media/audio/خذ عقيدتك 001 (1).mp3'),     // 001
  require('../../assets/media/audio/خذ عقيدة 002.mp3'),          // 002
  require('../../assets/media/audio/خذ عقيدة 003(2).mp3'),       // 003
  require('../../assets/media/audio/خذ عقيدة 004.mp3'),          // 004
  require('../../assets/media/audio/👈_خذ عقيدة 005.mp3'),       // 005
  require('../../assets/media/audio/خذ عقيدة  006.mp3'),         // 006
  require('../../assets/media/audio/خذ عقيدة 007(2).mp3'),       // 007
  require('../../assets/media/audio/_خذ عقيدة 008.mp3'),         // 008
  require('../../assets/media/audio/خذ عقيدة 009.mp3'),          // 009
  require('../../assets/media/audio/خذ عقيدة  10.mp3'),          // 010
  require('../../assets/media/audio/خذ عقيده 11.mp3'),           // 011
  require('../../assets/media/audio/خذ عقيدة 12.mp3'),           // 012
  require('../../assets/media/audio/خذ عقيده 13.mp3'),           // 013
  require('../../assets/media/audio/خذ عقيده  14.mp3'),          // 014
  require('../../assets/media/audio/خذ عقيده  15.mp3'),          // 015
  require('../../assets/media/audio/خذ عقيدة 16.mp3'),           // 016
  require('../../assets/media/audio/خذ عقيده 17.mp3'),           // 017
  require('../../assets/media/audio/خذ عقيده 18.mp3'),           // 018
  require('../../assets/media/audio/خذ عقيده 19.mp3'),           // 019
  require('../../assets/media/audio/_خذ عقيده 20.mp3'),          // 020
  require('../../assets/media/audio/🔥 خذ عقيده 21.mp3'),        // 021
  require('../../assets/media/audio/خذ عقيدة 22.mp3'),           // 022
  require('../../assets/media/audio/خذ عقيده 23.mp3'),           // 023
  require('../../assets/media/audio/خذ عقيده 24.mp3'),           // 024
  require('../../assets/media/audio/خذ عقيدة 25.mp3'),           // 025
];

/**
 * Get the URI for a bundled audio file by part number (1-25)
 * In production builds, ensures the asset is downloaded before returning URI
 */
export async function getAudioUri(partNumber: number): Promise<string> {
  const index = partNumber - 1;
  
  if (index < 0 || index >= audioAssets.length) {
    console.warn(`Audio part ${partNumber} is out of range (1-${audioAssets.length})`);
    return '';
  }
  
  try {
    const assetObj = Asset.fromModule(audioAssets[index]);
    
    // Ensure asset is downloaded in production
    if (!assetObj.downloaded) {
      await assetObj.downloadAsync();
    }
    
    return assetObj.localUri || assetObj.uri || '';
  } catch (error) {
    console.error(`Error loading audio ${partNumber}:`, error);
    return '';
  }
}

/**
 * Synchronous version - only use after ensuring asset is loaded
 * May return empty string if asset not ready
 */
export function getAudioUriSync(partNumber: number): string {
  const index = partNumber - 1;
  
  if (index < 0 || index >= audioAssets.length) {
    console.warn(`Audio part ${partNumber} is out of range (1-${audioAssets.length})`);
    return '';
  }
  
  const assetObj = Asset.fromModule(audioAssets[index]);
  return assetObj.localUri || assetObj.uri || '';
}

/**
 * Get the URI for the bundled PDF file
 * Downloads the asset if needed to ensure it's accessible
 */
export async function getPdfUri(): Promise<string> {
  try {
    const assetObj = Asset.fromModule(pdfAsset);
    
    // Download if not already downloaded
    if (!assetObj.downloaded) {
      await assetObj.downloadAsync();
    }
    
    return assetObj.localUri || assetObj.uri || '';
  } catch (error) {
    console.error('Error loading PDF:', error);
    return '';
  }
}

/**
 * Synchronous version that returns PDF URI immediately
 * May return empty string if asset not ready
 */
export function getPdfUriSync(): string {
  const assetObj = Asset.fromModule(pdfAsset);
  return assetObj.localUri || assetObj.uri || '';
}

/**
 * Preload all assets at app startup
 * Call this in your app root to ensure all assets are ready
 */
export async function preloadAllAssets(): Promise<void> {
  try {
    console.log('Preloading all assets...');
    
    // Preload PDF
    const pdfAssetObj = Asset.fromModule(pdfAsset);
    if (!pdfAssetObj.downloaded) {
      await pdfAssetObj.downloadAsync();
    }
    
    // Preload all audio files
    const audioPromises = audioAssets.map(async (asset) => {
      const assetObj = Asset.fromModule(asset);
      if (!assetObj.downloaded) {
        await assetObj.downloadAsync();
      }
    });
    
    await Promise.all(audioPromises);
    console.log('✅ All assets preloaded successfully');
  } catch (error) {
    console.error('Error preloading assets:', error);
  }
}

/**
 * Get all audio URIs (1-25) - returns empty strings until assets are loaded
 */
export function getAllAudioUrisSync(): string[] {
  return audioAssets.map((asset) => {
    const assetObj = Asset.fromModule(asset);
    return assetObj.localUri || assetObj.uri || '';
  });
}
