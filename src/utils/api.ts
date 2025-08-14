// src/utils/api.ts
import { ResultItem } from './types';

// Simulate network delay for mock data
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const PREVIEW_VIDEO_URL =
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4';
const FULL_VIDEO_URL =
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4';
const PREVIEW_VIDEO_DURATION_SECONDS = 5;

const API_URL = import.meta.env.VITE_API_URL || ''; // Empty string if not set

// Generate fake search results for fallback mode
const generateMockResults = (count: number): ResultItem[] => {
  const results: ResultItem[] = [];
  let currentSourceId = `source_video_${Date.now()}`;
  let itemsInGroup = 0;
  let groupSize = Math.floor(Math.random() * 5) + 3;

  for (let i = 0; i < count; i++) {
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
      sourceVideoId: currentSourceId,
    };

    if (type === 'video') {
      const segmentDuration = Math.random() * 2.5 + 0.5;
      const startTime =
        Math.random() * (PREVIEW_VIDEO_DURATION_SECONDS - segmentDuration);
      const endTime = startTime + segmentDuration;

      result.videoPreviewUrl = `${PREVIEW_VIDEO_URL}?v=${id}`;
      result.fullUrl = `${FULL_VIDEO_URL}?v=${id}`;
      result.startTime = startTime;
      result.endTime = endTime;
    }

    results.push(result);
    itemsInGroup++;
  }

  return results;
};

// Search API
export const fetchSearchResults = async (
  query: string,
  options: { file?: File }
): Promise<ResultItem[]> => {
  // Fallback if API URL is not configured
  if (!API_URL) {
    console.warn('VITE_API_URL not set — using mock results.');
    return generateMockResults(10);
  }

  try {
    const formData = new FormData();
    if (query) formData.append('query', query);
    if (options.file) formData.append('file', options.file);

    const response = await fetch(`${API_URL}/search`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Ensure we always return an array
    return Array.isArray(data.results) ? data.results : [];
  } catch (err) {
    console.error('Backend not reachable, using mock data.', err);
    return generateMockResults(10);
  }
};
