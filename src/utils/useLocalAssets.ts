import { Asset } from 'expo-asset';
import { useEffect, useState } from 'react';

// Import all local assets statically (Metro requires this)
const pdfAsset = require('../../assets/media/pdf/خذ عقيدتك من الكتاب والسنة.pdf');

// Static imports for all audio files - ኹዝ አቂዳ (sorted by number 001-025)
const audioModules = [
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

// Audio file names for mapping (sorted by number 001-025)
const audioFileNames = [
  'خذ عقيدتك 001 (1).mp3',     // 001
  'خذ عقيدة 002.mp3',          // 002
  'خذ عقيدة 003(2).mp3',       // 003
  'خذ عقيدة 004.mp3',          // 004
  '👈_خذ عقيدة 005.mp3',       // 005
  'خذ عقيدة  006.mp3',         // 006
  'خذ عقيدة 007(2).mp3',       // 007
  '_خذ عقيدة 008.mp3',         // 008
  'خذ عقيدة 009.mp3',          // 009
  'خذ عقيدة  10.mp3',          // 010
  'خذ عقيده 11.mp3',           // 011
  'خذ عقيدة 12.mp3',           // 012
  'خذ عقيده 13.mp3',           // 013
  'خذ عقيده  14.mp3',          // 014
  'خذ عقيده  15.mp3',          // 015
  'خذ عقيدة 16.mp3',           // 016
  'خذ عقيده 17.mp3',           // 017
  'خذ عقيده 18.mp3',           // 018
  'خذ عقيده 19.mp3',           // 019
  '_خذ عقيده 20.mp3',          // 020
  '🔥 خذ عقيده 21.mp3',        // 021
  'خذ عقيدة 22.mp3',           // 022
  'خذ عقيده 23.mp3',           // 023
  'خذ عقيده 24.mp3',           // 024
  'خذ عقيدة 25.mp3',           // 025
];

// Sequential display names (1-25 based on original numbers)
const displayNames = [
  'ኹዝ አቂዳ 001',   // Position 1
  'ኹዝ አቂዳ 002',   // Position 2
  'ኹዝ አቂዳ 003',   // Position 3
  'ኹዝ አቂዳ 004',   // Position 4
  'ኹዝ አቂዳ 005',   // Position 5
  'ኹዝ አቂዳ 006',   // Position 6
  'ኹዝ አቂዳ 007',   // Position 7
  'ኹዝ አቂዳ 008',   // Position 8
  'ኹዝ አቂዳ 009',   // Position 9
  'ኹዝ አቂዳ 010',   // Position 10
  'ኹዝ አቂዳ 011',   // Position 11
  'ኹዝ አቂዳ 012',   // Position 12
  'ኹዝ አቂዳ 013',   // Position 13
  'ኹዝ አቂዳ 014',   // Position 14
  'ኹዝ አቂዳ 015',   // Position 15
  'ኹዝ አቂዳ 016',   // Position 16
  'ኹዝ አቂዳ 017',   // Position 17
  'ኹዝ አቂዳ 018',   // Position 18
  'ኹዝ አቂዳ 019',   // Position 19
  'ኹዝ አቂዳ 020',   // Position 20
  'ኹዝ አቂዳ 021',   // Position 21
  'ኹዝ አቂዳ 022',   // Position 22
  'ኹዝ አቂዳ 023',   // Position 23
  'ኹዝ አቂዳ 024',   // Position 24
  'ኹዝ አቂዳ 025',   // Position 25
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
          id: 'book-huze-aqida-pdf',
          name: 'ኹዝ አቂዳ በኡስታዝ አቡ ሁዘይፋ.pdf',
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
