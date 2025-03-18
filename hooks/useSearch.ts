"use client"

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAudio } from "@/components/player/AudioContext";
import { useDebounce } from "./useDebounce";

export const useSearch = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Track[]>([]);
    const [allTracks, setAllTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const tracksPerPage = 10;

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const { playTrackAtIndex } = useAudio();

    // Fetch all tracks only once when the hook mounts
    useEffect(() => {
        const fetchAllTracks = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/tracks');

                if (!response.ok) {
                    throw new Error(`Failed to fetch tracks: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    setAllTracks(data);
                    setSearchResults(data); // Initially show all tracks
                } else {
                    setError('No tracks found');
                }
            } catch (err) {
                console.error('Error fetching tracks:', err);
                setError(err instanceof Error ? err.message : 'Unknown error fetching tracks');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllTracks();
    }, []);

    // Filter tracks based on debounced search query
    useEffect(() => {
        if (!debouncedSearchQuery.trim()) {
            setSearchResults(allTracks);
            return;
        }

        const normalizedQuery = debouncedSearchQuery.toLowerCase().trim();

        const filtered = allTracks.filter(track =>
            track.title.toLowerCase().includes(normalizedQuery) ||
            track.author!.toLowerCase().includes(normalizedQuery) ||
            (track.album && track.album.toLowerCase().includes(normalizedQuery)) ||
            track.id.includes(normalizedQuery)
        );

        setSearchResults(filtered);
    }, [debouncedSearchQuery, allTracks]);

    // Reset to first page when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchQuery]);

    // Handle search input change
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, []);

    // Handle track selection
    const handleTrackSelect = useCallback((index: number) => {
        playTrackAtIndex(index, searchResults);
    }, [playTrackAtIndex, searchResults]);

    const totalPages = useMemo(() => Math.ceil(searchResults.length / tracksPerPage), [searchResults.length]);

    // Get current tracks for the current page
    const currentPageTracks = useMemo(() => {
        const startIndex = (currentPage - 1) * tracksPerPage;
        return searchResults.slice(startIndex, startIndex + tracksPerPage);
    }, [searchResults, currentPage]);

    // Update the return statement to include these new values
    return {
        searchQuery,
        searchResults,
        currentPageTracks,
        currentPage,
        setCurrentPage,
        totalPages,
        isLoading,
        error,
        handleSearchChange,
        handleTrackSelect
    };
};