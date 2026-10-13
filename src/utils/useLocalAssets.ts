import { Asset } from 'expo-asset';
import { useEffect, useState } from 'react';

// Import all local assets statically (Metro requires this)
const pdfAsset = require('../../assets/media/pdf/አቂደቱ ጡሃዉያ.pdf');

// Static imports for all audio files - አቂደቱ ጡሃውያ (sorted by number 1-32)
const audioModules = [
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

// Audio file names for mapping (sorted by number 1-32)
const audioFileNames = [
  'አቂደቱ ጡሐውያ 1.mp3',          // 001
  'አቂደቱ ጦሃውያ 2.mp3',          // 002
  'አቂደቱ ጡሃውያ 3.mp3',          // 003
  'አቂደቱ ጡሃውያ 4.mp3',          // 004
  'አቂደቱ ጡሃውያ 5.mp3',          // 005
  'አቂደቱ ጡሃውያ 6.mp3',          // 006
  'አቂደቱ ጡሃውያ 7.mp3',          // 007
  'አቂደቱ ጡሃውያ 8.mp3',          // 008
  'አቂደቱ ጡሃውያ 9.mp3',          // 009
  'አቂደቱ ጡሃውያ 10.mp3',         // 010
  'አቂደቱ ጡሃውያ 11.mp3',         // 011
  'አቂደቱ ጡሃውያ 12.mp3',         // 012
  'አቂደቱ ጡሃውያ 13.mp3',         // 013
  'አቂደቱ ጡሃውያ 14.mp3',         // 014
  'አቂደቱ ጡሃውያ 15.mp3',         // 015
  'አቂደቱ ጡሃውያ 16.mp3',         // 016
  'አቂደቱ ጡሃውያ 17.mp3',         // 017
  'አቂደቱ ጡሃውያ 18.mp3',         // 018
  'አቂደቱ ጡሃውያ 19.mp3',         // 019
  'አቂደቱ ጡሃውያ 20.mp3',         // 020
  'አቂደቱ ጡሃውያ 21.mp3',         // 021
  'አቂደቱ ጡሃዉያ 22.mp3',         // 022
  'አቂደቱ ጡሃውያ 23.mp3',         // 023
  'አቂደቱ ጡሃውያ 24.mp3',         // 024
  'አቂደቱ ጡሃውያ 25.mp3',         // 025
  'አቂደቱ ጡሃውያ 26.mp3',         // 026
  'አቂደቱ ጡሃውያ 27.mp3',         // 027
  'አቂደቱ ጡሃውያ 28.mp3',         // 028
  'አቂደቱ ጡሃውያ 29.mp3',         // 029
  'አቂደቱ ጡሃውያ 30.mp3',         // 030
  'አቂደቱ ጡሃውያ 31.mp3',         // 031
  'አቂደቱ ጡሃውያ 32.mp3',         // 032
];

// Sequential display names (1-32 based on available numbers)
const displayNames = [
  'አቂደቱ ጡሃውያ 1',   // Position 1
  'አቂደቱ ጡሃውያ 2',   // Position 2
  'አቂደቱ ጡሃውያ 3',   // Position 3
  'አቂደቱ ጡሃውያ 4',   // Position 4
  'አቂደቱ ጡሃውያ 5',   // Position 5
  'አቂደቱ ጡሃውያ 6',   // Position 6
  'አቂደቱ ጡሃውያ 7',   // Position 7
  'አቂደቱ ጡሃውያ 8',   // Position 8
  'አቂደቱ ጡሃውያ 9',   // Position 9
  'አቂደቱ ጡሃውያ 10',   // Position 10
  'አቂደቱ ጡሃውያ 11',   // Position 11
  'አቂደቱ ጡሃውያ 12',   // Position 12
  'አቂደቱ ጡሃውያ 13',   // Position 13
  'አቂደቱ ጡሃውያ 14',   // Position 14
  'አቂደቱ ጡሃውያ 15',   // Position 15
  'አቂደቱ ጡሃውያ 16',   // Position 16
  'አቂደቱ ጡሃውያ 17',   // Position 17
  'አቂደቱ ጡሃውያ 18',   // Position 18
  'አቂደቱ ጡሃውያ 19',   // Position 19
  'አቂደቱ ጡሃውያ 20',   // Position 20
  'አቂደቱ ጡሃውያ 21',   // Position 21
  'አቂደቱ ጡሃውያ 22',   // Position 22
  'አቂደቱ ጡሃውያ 23',   // Position 23
  'አቂደቱ ጡሃውያ 24',   // Position 24
  'አቂደቱ ጡሃውያ 25',   // Position 25
  'አቂደቱ ጡሃውያ 26',   // Position 26
  'አቂደቱ ጡሃውያ 27',   // Position 27
  'አቂደቱ ጡሃውያ 28',   // Position 28
  'አቂደቱ ጡሃውያ 29',   // Position 29
  'አቂደቱ ጡሃውያ 30',   // Position 30
  'አቂደቱ ጡሃውያ 31',   // Position 31
  'አቂደቱ ጡሃውያ 32',   // Position 32
];

// Map modules to asset info
const audioAssets = audioModules.map((asset, index) => {
  const fileName = audioFileNames[index];
  const displayName = displayNames[index];
  return {
    id: `audio-part-${index + 1}`,
    name: displayName, // Use sequential display name
    fileName: fileName, // Keep original file name for reference
    asset,
  };
});

interface AssetInfo {
  id: string;
  name: string;
  localUri: string | null;
  type: 'audio' | 'pdf';
}

export const useLocalAssets = () => {
  const [assets, setAssets] = useState<AssetInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        setIsLoading(true);
        const loadedAssets: AssetInfo[] = [];

        // Load PDF - Get URI directly without downloading (it's already bundled)
        const pdfAssetObj = Asset.fromModule(pdfAsset);
        const pdfUri = pdfAssetObj.uri || pdfAssetObj.localUri;
        loadedAssets.push({
          id: 'book-aqidatu-tahawiya-pdf',
          name: 'አቂደቱ ጡሃውያ በኡስታዝ አቡ ሁዘይፋ.pdf',
          localUri: pdfUri,
          type: 'pdf',
        });

        // Load all audio files - Get URIs directly without downloading
        for (const audio of audioAssets) {
          const assetObj = Asset.fromModule(audio.asset);
          const audioUri = assetObj.uri || assetObj.localUri;
          loadedAssets.push({
            id: audio.id,
            name: audio.name,
            localUri: audioUri,
            type: 'audio',
          });
        }

        setAssets(loadedAssets);
        console.log(`✅ Loaded ${loadedAssets.length} local assets instantly (1 PDF + ${audioAssets.length} audio files)`);
      } catch (error) {
        console.error('Error loading local assets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, []);

  const getAssetUri = (name: string) => {
    const asset = assets.find(a => a.name === name);
    return asset?.localUri || null;
  };

  return {
    assets,
    isLoading,
    getAssetUri,
  };
};
