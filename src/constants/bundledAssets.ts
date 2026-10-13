import { Asset } from 'expo-asset';

// Import PDF - አቂደቱ ጡሃውያ በኡስታዝ አቡ ሁዘይፋ
const pdfAsset = require('../../assets/media/pdf/አቂደቱ ጡሃዉያ.pdf');

// Import audio files (32 files) - አቂደቱ ጡሃውያ (sorted by number 1-32)
const audioAssets = [
  require('../../assets/media/audio/አቂደቱ ጡሐውያ 1.mp3'),          // 001
  require('../../assets/media/audio/አቂደቱ ጦሃውያ 2.mp3'),          // 002
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 3.mp3'),          // 003
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 4.mp3'),          // 004
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 5.mp3'),          // 005
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 6.mp3'),          // 006
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 7.mp3'),          // 007
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 8.mp3'),          // 008
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 9.mp3'),          // 009
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 10.mp3'),         // 010
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 11.mp3'),         // 011
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 12.mp3'),         // 012
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 13.mp3'),         // 013
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 14.mp3'),         // 014
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 15.mp3'),         // 015
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 16.mp3'),         // 016
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 17.mp3'),         // 017
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 18.mp3'),         // 018
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 19.mp3'),         // 019
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 20.mp3'),         // 020
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 21.mp3'),         // 021
  require('../../assets/media/audio/አቂደቱ ጡሃዉያ 22.mp3'),         // 022
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 23.mp3'),         // 023
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 24.mp3'),         // 024
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 25.mp3'),         // 025
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 26.mp3'),         // 026
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 27.mp3'),         // 027
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 28.mp3'),         // 028
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 29.mp3'),         // 029
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 30.mp3'),         // 030
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 31.mp3'),         // 031
  require('../../assets/media/audio/አቂደቱ ጡሃውያ 32.mp3'),         // 032
];

/**
 * Get the URI for a bundled audio file by part number (1-32)
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
 * Get all audio URIs (1-32) - returns empty strings until assets are loaded
 */
export function getAllAudioUrisSync(): string[] {
  return audioAssets.map((asset) => {
    const assetObj = Asset.fromModule(asset);
    return assetObj.localUri || assetObj.uri || '';
  });
}
