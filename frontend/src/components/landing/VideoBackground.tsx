import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const VIDEO_POOL = [
    "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/90bb1b34646b81b3b63e5a854ea00da3/manifest/video.m3u8",
    "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/df176a2fb2ea2b64bd21ae1c10d3af6a/manifest/video.m3u8",
    "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/12a9780eeb1ea015801a5f55cf2e9d3d/manifest/video.m3u8",
    "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/964cb3eddff1a67e3772aac9a7aceea2/manifest/video.m3u8",
    "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/dd17599dfa77f41517133fa7a4967535/manifest/video.m3u8",
    "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/408ad52e3f15bc8f01ae69d194a8cf3a/manifest/video.m3u8",
    "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/e923e67d71fed3e0853ec57f0348451e/manifest/video.m3u8",
    "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/136a8a211c6c3b1cc1fd7b1c7d836c58/manifest/video.m3u8",
    "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/c9ddd33ac3d964e5d33b31ce849e8f95/manifest/video.m3u8",
    "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/257c7359efd4b4aaebcc03aa8fc78a36/manifest/video.m3u8",
    "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/697945ca6b876878dba3b23fbd2f1561/manifest/video.m3u8"
];

interface VideoBackgroundProps {
    className?: string;
    overlayOpacity?: number;
}

export function VideoBackground({ className = "", overlayOpacity = 0.4 }: VideoBackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoSrc, setVideoSrc] = useState<string>("");

    useEffect(() => {
        // Randomly select a video
        const randomVideo = VIDEO_POOL[Math.floor(Math.random() * VIDEO_POOL.length)];
        setVideoSrc(randomVideo);
    }, []);

    useEffect(() => {
        if (!videoSrc || !videoRef.current) return;

        if (Hls.isSupported()) {
            const hls = new Hls({
                autoStartLoad: true,
                capLevelToPlayerSize: true,
            });
            hls.loadSource(videoSrc);
            hls.attachMedia(videoRef.current);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoRef.current?.play().catch(e => console.log('Autoplay prevented:', e));
            });

            return () => {
                hls.destroy();
            };
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            videoRef.current.src = videoSrc;
            videoRef.current.addEventListener('loadedmetadata', () => {
                videoRef.current?.play().catch(e => console.log('Autoplay prevented:', e));
            });
        }
    }, [videoSrc]);

    return (
        <div className={`absolute inset-0 z-0 overflow-hidden bg-black ${className}`}>
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                loop
                playsInline
                poster=""
            />
            {/* Overlay to ensure text readability and monochrome aesthetic */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
            />
        </div>
    );
}
