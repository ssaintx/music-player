import { useState, useEffect } from "react";
import { Track } from "@/app/api/tracks/route";

export const useTracks = (...trackNames: string[]) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setIsLoading(true);

        let url = '/api/tracks';
        // If track names are provided, add them as query parameters
        if (trackNames.length > 0) {
          const queryParams = new URLSearchParams();
          trackNames.forEach(name => queryParams.append('tracks', name));
          url = `${url}?${queryParams.toString()}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch tracks: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setTracks(data);
        } else {
          setError('No tracks found. Please add some music files to the tracks directory.');
        }
      } catch (err) {
        console.error('Error fetching tracks:', err);
        setError(err instanceof Error ? err.message : 'Unknown error fetching tracks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, [trackNames.join(',')]); // Re-fetch when track list changes

  // Handle track selection
  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  // Toggle play/pause
  const handlePlayPauseToggle = () => {
    setIsPlaying(!isPlaying);
  };

  return {
    tracks,
    currentTrackIndex,
    isPlaying,
    isLoading,
    error,
    handleTrackSelect,
    handlePlayPauseToggle,
    setCurrentTrackIndex
  };
};