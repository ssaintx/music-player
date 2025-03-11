// /components/player/BottomPlayer.tsx
"use client"

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Slider } from "@/components/ui/slider";
import { useState, useCallback, memo, useEffect } from 'react';
import {
    Volume1,
    Volume2,
    VolumeX,
    ChevronLeft,
    ChevronRight,
    Play,
    Pause,
    Maximize2,
    Minimize2
} from 'lucide-react';
import { useAudio } from './AudioContext';

const BottomPlayer = () => {
    const {
        tracks,
        currentTrackIndex,
        isPlaying,
        volume,
        currentTime,
        duration,
        togglePlayPause,
        nextTrack,
        prevTrack,
        setVolume,
        seekTo,
        hasNextTrack,
        hasPrevTrack
    } = useAudio();

    const [isPlayerVisible, setIsPlayerVisible] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const currentTrack = tracks?.[currentTrackIndex];

    // Show player when there are tracks
    useEffect(() => {
        if (tracks && tracks.length > 0) {
            setIsPlayerVisible(true);
        } else {
            setIsPlayerVisible(false);
        }
    }, [tracks]);

    // Toggle play/pause
    const handlePlayPauseToggle = useCallback(() => {
        togglePlayPause();
    }, [togglePlayPause]);

    // Handle volume change from slider
    const handleVolumeChange = useCallback((value: number[]) => {
        setVolume(value[0] / 100);
    }, [setVolume]);

    // Handle seeking in the song
    const handleSeek = useCallback((value: number[]) => {
        const newTime = (value[0] / 100) * duration;
        seekTo(newTime);
    }, [duration, seekTo]);

    // Format time display (e.g., 01:45)
    const formatTime = useCallback((time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, []);

    // Calculate the current progress percentage
    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Toggle expanded view
    const toggleExpanded = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    // Handle next track click
    const handleNextTrack = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        nextTrack();
    }, [nextTrack]);

    // Handle previous track click
    const handlePrevTrack = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        prevTrack();
    }, [prevTrack]);

    // Don't render anything if no tracks or player is hidden
    if (!isPlayerVisible || !tracks || tracks.length === 0 || !currentTrack) {
        return null;
    }

    return (
        <motion.footer
            className={`fixed ${isExpanded ? 'inset-0 bg-white' : 'bottom-20 sm:bottom-24 md:bottom-0 left-0 w-full'} bg-sidebar glassmorphism border-t-[1px] border-neutral-200 p-4 z-100`}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className={`flex items-center justify-between ${isExpanded ? 'flex-col h-full' : 'flex-col md:flex-row'} gap-4 w-full`}>
                {isExpanded && (
                    <div className="self-end">
                        <motion.button
                            className="p-2 rounded-full hover:bg-gray-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleExpanded();
                            }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Minimize2 />
                        </motion.button>
                    </div>
                )}

                {/* Track Info */}
                <div
                    className={`flex items-center space-x-4 flex-grow md:flex-grow-0 order-1 md:order-none ${isExpanded ? 'mt-10 flex-col justify-center space-x-0 space-y-4' : ''}`}
                    onClick={isExpanded ? undefined : toggleExpanded}
                >
                    <Image
                        src={currentTrack?.cover || '/default-cover.jpg'}
                        alt="Track Cover"
                        width={isExpanded ? 300 : 36}
                        height={isExpanded ? 300 : 36}
                        className={`rounded-sm ${isExpanded ? 'rounded-lg shadow-lg' : ''}`}
                    />
                    <div className={`${isExpanded ? 'text-center' : ''}`}>
                        <h4 className={`font-semibold ${isExpanded ? 'text-xl' : 'truncate max-w-[100px]'}`}>
                            {currentTrack?.title || "No Track"}
                        </h4>
                        <p className={`text-sm text-gray-500 ${isExpanded ? '' : 'truncate max-w-[200px] md:max-w-full'}`}>
                            {currentTrack?.author || "Unknown Artist"}
                        </p>
                    </div>
                </div>

                {/* Player Controls - Middle */}
                <div className={`flex items-center w-full space-x-6 order-2 flex-col ${isExpanded ? 'mb-12' : 'md:flex-row'} md:flex-1 justify-center`}>
                    <div className="flex flex-col items-center justify-center gap-2 w-full">
                        <div className={`flex items-center space-x-6 ${isExpanded ? 'mb-6' : 'mb-4'}`}>
                            <motion.button
                                className={`p-2 rounded-full ${hasPrevTrack ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
                                onClick={hasPrevTrack ? handlePrevTrack : undefined}
                                whileTap={hasPrevTrack ? { scale: 0.9 } : undefined}
                            >
                                <ChevronLeft className={`font-thin ${isExpanded ? 'w-8 h-8' : 'w-8 h-8'}`} />
                            </motion.button>

                            <motion.button
                                className={`p-3 font-thin ${isExpanded ? 'p-5' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlayPauseToggle();
                                }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {isPlaying ? (
                                    <Pause className={isExpanded ? 'w-8 h-8' : 'w-8 h-8'} />
                                ) : (
                                    <Play className={isExpanded ? 'w-8 h-8' : 'w-8 h-8'} />
                                )}
                            </motion.button>

                            <motion.button
                                className={`p-2 rounded-full ${hasNextTrack ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
                                onClick={hasNextTrack ? handleNextTrack : undefined}
                                whileTap={hasNextTrack ? { scale: 0.9 } : undefined}
                            >
                                <ChevronRight className={`font-thin ${isExpanded ? 'w-8 h-8' : 'w-8 h-8'}`} />
                            </motion.button>
                        </div>
                        {/* Song Progress Slider */}
                        <div className="flex items-center w-full max-w-[500px] px-4 space-x-2">
                            <span className="text-sm text-gray-500">{formatTime(currentTime)}</span>
                            <Slider
                                value={[progressPercentage]}
                                max={100}
                                step={0.1}
                                onValueChange={handleSeek}
                                aria-label="song progress"
                                className="flex-grow"
                            />
                            <span className="text-sm text-gray-500">{formatTime(duration || 0)}</span>
                        </div>
                    </div>
                </div>

                {/* Volume Control */}
                <div className="hidden md:flex items-center space-x-2 md:w-40 justify-end order-3">
                    {volume === 0 ? <VolumeX className='w-5 h-5' /> : volume < 0.5 ? <Volume1 className='w-5 h-5' /> : <Volume2 className='w-5 h-5' />}
                    <Slider
                        value={[volume * 100]}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        aria-label="volume"
                        className={`${isExpanded ? 'w-full' : 'w-24'} flex-grow md:flex-grow-0`}
                    />
                </div>

                {!isExpanded && (
                    <div className="hidden md:flex items-center">
                        <motion.button
                            className="p-2 rounded-full hover:bg-gray-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleExpanded();
                            }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Maximize2 />
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.footer>
    );
};

export default memo(BottomPlayer);