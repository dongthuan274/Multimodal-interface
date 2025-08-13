
import { ResultItem, SearchSettings } from './types';

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const TOTAL_RESULTS = 100;
const PREVIEW_VIDEO_URL = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4';
const FULL_VIDEO_URL = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4';
const PREVIEW_VIDEO_DURATION_SECONDS = 5;

// Mock data generation
const generateMockResults = (count: number): ResultItem[] => {
  const generatedResults: ResultItem[] = [];
  let currentSourceId = `source_video_${Date.now()}`;
  let itemsInGroup = 0;
  // Each source video will have between 3 and 7 result frames
  let groupSize = Math.floor(Math.random() * 5) + 3;

  for (let i = 0; i < count; i++) {
    // When the group is full, create a new source ID for the next group
    if (itemsInGroup >= groupSize) {
      currentSourceId = `source_video_${Date.now()}_${i}`;
      itemsInGroup = 0;
      groupSize = Math.floor(Math.random() * 5) + 3;
    }

    const type = Math.random() > 0.3 ? 'image' : 'video';
    const id = `result_${Date.now()}_${i}`;

    const result: ResultItem = {
      id,
      rank: i + 1,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Result #${i + 1}`,
      thumbnailUrl: `https://picsum.photos/seed/${id}/400/300`,
      fullUrl: `https://picsum.photos/seed/${id}/1280/720`,
      sourceVideoId: currentSourceId, // Assign the shared source ID
    };

    if (type === 'video') {
      // Simulate finding a relevant segment of variable length (0.5s to 3s)
      const segmentDuration = Math.random() * 2.5 + 0.5;
      const startTime = Math.random() * (PREVIEW_VIDEO_DURATION_SECONDS - segmentDuration);
      const endTime = startTime + segmentDuration;

      result.videoPreviewUrl = `${PREVIEW_VIDEO_URL}?v=${id}`;
      result.fullUrl = `${FULL_VIDEO_URL}?v=${id}`; // Use a different, longer video for full view
      result.startTime = startTime;
      result.endTime = endTime;
    }

    generatedResults.push(result);
    itemsInGroup++;
  }
  
  return generatedResults;
};


// Placeholder for the main search API endpoint
export const fetchSearchResults = async (
  query: string,
  settings: Partial<SearchSettings> & { file?: File }
): Promise<ResultItem[]> => {
  console.log('TODO: /api/search - Fetching search results for:', { query, settings });
  
  await delay(1500); // Simulate API latency

  // Don't return results if there's no query or file
  if (!query && !settings.file) {
      return [];
  }
  
  const results = generateMockResults(TOTAL_RESULTS);
  console.log('Received mock results:', results);
  return results;
};

// TODO: /api/preview - Create a function to get video preview streams.
// export const fetchVideoPreview = async (videoId: string, timestamp: number) => { ... }

// TODO: /api/color-scale - Optionally, fetch color scale from backend.
// export const fetchColorScale = async () => { ... }

// TODO: /api/settings - Functions to save/load user settings.
// export const saveUserSettings = async (settings: any) => { ... }
