import React, { useRef, useState, useEffect } from 'react';
import Window from '../os/Window';
import { WindowAppProps } from './Photos';

export interface CameraAppProps extends WindowAppProps {}

interface SavedPhoto {
    id: string;
    dataUrl: string;
    timestamp: string;
    filename: string;
}

const Camera: React.FC<CameraAppProps> = (props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [savedPhotos, setSavedPhotos] = useState<SavedPhoto[]>([]);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [viewingPhoto, setViewingPhoto] = useState<SavedPhoto | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Load saved photos from localStorage on mount
    useEffect(() => {
        console.log('Camera component mounted');
        const saved = localStorage.getItem('cameraPhotos');
        if (saved) {
            try {
                setSavedPhotos(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load saved photos:', e);
            }
        }
    }, []);
    
    // Debug video element state
    useEffect(() => {
        console.log('isStreaming changed to:', isStreaming);
        console.log('videoRef.current exists:', !!videoRef.current);
        console.log('streamRef.current exists:', !!streamRef.current);
        if (videoRef.current) {
            console.log('Video ref state:', {
                srcObject: videoRef.current.srcObject,
                readyState: videoRef.current.readyState,
                paused: videoRef.current.paused,
                videoWidth: videoRef.current.videoWidth,
                videoHeight: videoRef.current.videoHeight
            });
        }
    }, [isStreaming]);

    // Save photos to localStorage whenever they change
    useEffect(() => {
        if (savedPhotos.length > 0) {
            localStorage.setItem('cameraPhotos', JSON.stringify(savedPhotos));
        }
    }, [savedPhotos]);

    const startCamera = async () => {
        console.log('startCamera called');
        try {
            console.log('Requesting camera access...');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            console.log('Camera stream obtained:', stream);
            console.log('Video tracks:', stream.getVideoTracks());
            streamRef.current = stream;
            // Set isStreaming first so the video element gets rendered
            setIsStreaming(true);
            console.log('isStreaming set to true, waiting for video element to render...');
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Unable to access camera. Please check permissions.');
        }
    };
    
    // Set up video stream when isStreaming becomes true and video element is available
    useEffect(() => {
        if (isStreaming && streamRef.current && videoRef.current) {
            console.log('Setting video srcObject...');
            videoRef.current.srcObject = streamRef.current;
            console.log('Video srcObject set, waiting for video to load...');
            
            // Wait for video metadata to load
            const video = videoRef.current;
            video.onloadedmetadata = () => {
                console.log('Video metadata loaded');
                console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
                // Explicitly play the video
                video.play().then(() => {
                    console.log('Video started playing');
                }).catch((e) => {
                    console.error('Error playing video:', e);
                });
            };
            
            video.onplay = () => {
                console.log('Video started playing');
            };
            
            video.onerror = (e) => {
                console.error('Video error:', e);
            };
        }
    }, [isStreaming]);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsStreaming(false);
    };

    // Apply retro filter to canvas
    const applyRetroFilter = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Apply grainy, desaturated, low-quality effect
        for (let i = 0; i < data.length; i += 4) {
            // Desaturate (convert to grayscale with slight color tint)
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const gray = r * 0.299 + g * 0.587 + b * 0.114;
            
            // Add slight sepia/warm tint
            data[i] = Math.min(255, gray * 1.1); // Red channel
            data[i + 1] = Math.min(255, gray * 0.95); // Green channel
            data[i + 2] = Math.min(255, gray * 0.85); // Blue channel
            
            // Add grain/noise (increased for more visible grain)
            const noise = (Math.random() - 0.5) * 30;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }

        // Reduce quality by downscaling and upscaling
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width * 0.7;
        tempCanvas.height = height * 0.7;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
            tempCtx.putImageData(imageData, 0, 0);
            ctx.clearRect(0, 0, width, height);
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(tempCanvas, 0, 0, width, height);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current || !streamRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) return;

        // Get video's natural dimensions
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        
        // Get the actual video track settings to verify dimensions
        const videoTrack = streamRef.current.getVideoTracks()[0];
        const settings = videoTrack.getSettings();
        
        console.log('=== CAPTURE DEBUG ===');
        console.log('Video element dimensions:', videoWidth, 'x', videoHeight);
        console.log('Video track settings:', settings);
        console.log('Video element getBoundingClientRect:', video.getBoundingClientRect());
        console.log('Video element offsetWidth/Height:', video.offsetWidth, 'x', video.offsetHeight);
        console.log('Video element videoWidth/Height:', video.videoWidth, 'x', video.videoHeight);
        
        // Use the video's actual videoWidth/videoHeight - these should be the full frame
        // But if they're wrong, try using the track settings
        let captureWidth = videoWidth;
        let captureHeight = videoHeight;
        
        if (settings.width && settings.height) {
            console.log('Using track settings dimensions:', settings.width, 'x', settings.height);
            // Sometimes the video element reports wrong dimensions, use track settings
            if (settings.width !== videoWidth || settings.height !== videoHeight) {
                console.log('Dimensions mismatch! Using track settings.');
                captureWidth = settings.width;
                captureHeight = settings.height;
            }
        }
        
        console.log('Final capture dimensions:', captureWidth, 'x', captureHeight);
        
        // Set canvas to capture dimensions
        canvas.width = captureWidth;
        canvas.height = captureHeight;
        
        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, captureWidth, captureHeight);
        
        // Draw the video - try different approaches
        try {
            // Method 1: Draw full video frame
            ctx.drawImage(video, 0, 0, captureWidth, captureHeight);
            console.log('Drew video using drawImage(video, 0, 0, width, height)');
        } catch (e) {
            console.error('Error drawing video:', e);
            // Fallback: try with source dimensions
            ctx.drawImage(
                video,
                0, 0, video.videoWidth, video.videoHeight,
                0, 0, captureWidth, captureHeight
            );
            console.log('Drew video using drawImage with source/dest rects');
        }

        // Apply retro filter
        applyRetroFilter(ctx, canvas.width, canvas.height);
        
        console.log('Retro filter applied');
        console.log('Final canvas dimensions:', canvas.width, 'x', canvas.height);
        console.log('Photo captured successfully');

        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // Lower quality for retro feel

        // Save photo with simple naming
        const timestamp = new Date().toISOString();
        const photoNumber = savedPhotos.length + 1;
        const filename = `photo ${photoNumber}.jpg`;
        const newPhoto: SavedPhoto = {
            id: Date.now().toString(),
            dataUrl,
            timestamp,
            filename
        };

        setSavedPhotos(prev => [newPhoto, ...prev]);
    };

    const takePhotoWithCountdown = () => {
        if (!isStreaming) {
            alert('Please start the camera first!');
            return;
        }

        let count = 3;
        setCountdown(count);

        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                setCountdown(count);
            } else {
                setCountdown(null);
                clearInterval(countdownInterval);
                capturePhoto();
            }
        }, 1000);
    };

    const downloadPhoto = (photo: SavedPhoto) => {
        const link = document.createElement('a');
        link.download = photo.filename;
        link.href = photo.dataUrl;
        link.click();
    };

    const deletePhoto = (id: string) => {
        setSavedPhotos(prev => {
            const filtered = prev.filter(p => p.id !== id);
            // Renumber all photos after deletion
            // Since we store newest first, we number from the end
            return filtered.map((photo, index) => ({
                ...photo,
                filename: `photo ${filtered.length - index}.jpg`
            }));
        });
        // Close viewer if viewing deleted photo
        if (viewingPhoto && viewingPhoto.id === id) {
            setViewingPhoto(null);
        }
    };
    
    const openPhotoViewer = (photo: SavedPhoto) => {
        setViewingPhoto(photo);
    };
    
    const closePhotoViewer = () => {
        setViewingPhoto(null);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <>
            <Window
                top={80}
                left={300}
                width={700}
                height={600}
                windowBarIcon="camera"
                windowTitle="Photobooth"
                closeWindow={props.onClose}
                onInteract={props.onInteract}
                minimizeWindow={props.onMinimize}
            >
                <div style={styles.container}>
                <div style={styles.menuBar}>
                    <div style={styles.menuItem}>File</div>
                    <div style={styles.menuItem}>Edit</div>
                    <div style={styles.menuItem}>View</div>
                    <div style={styles.menuItem}>Help</div>
                </div>
                <div style={styles.main}>
                    {/* Left side - Camera view */}
                    <div style={styles.cameraSection}>
                        <div style={styles.videoContainer}>
                            {!isStreaming ? (
                                <div style={styles.placeholder}>
                                    <div style={styles.placeholderText}>Camera Off</div>
                                    <div style={styles.placeholderSubtext}>Click "Start Camera" to begin</div>
                                </div>
                            ) : (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        style={styles.video}
                                        onLoadedMetadata={() => {
                                            console.log('Video metadata loaded in render');
                                            if (videoRef.current) {
                                                videoRef.current.play().catch(e => {
                                                    console.error('Error playing video:', e);
                                                });
                                            }
                                        }}
                                    />
                                    {countdown !== null && (
                                        <div style={styles.countdownOverlay}>
                                            <div style={styles.countdownText}>{countdown}</div>
                                        </div>
                                    )}
                                </>
                            )}
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                        </div>
                        <div style={styles.controls}>
                            <button
                                style={styles.button}
                                onClick={isStreaming ? stopCamera : startCamera}
                            >
                                {isStreaming ? 'Stop Camera' : 'Start Camera'}
                            </button>
                            <button
                                style={{
                                    ...styles.button,
                                    ...((!isStreaming || countdown !== null) && styles.buttonDisabled)
                                }}
                                onClick={takePhotoWithCountdown}
                                disabled={!isStreaming || countdown !== null}
                            >
                                Take Photo
                            </button>
                        </div>
                    </div>

                    {/* Right side - Photo gallery */}
                    <div style={styles.gallerySection}>
                        <div style={styles.galleryHeader}>
                            Saved Photos ({savedPhotos.length})
                        </div>
                        <div style={styles.gallery}>
                            {savedPhotos.length === 0 ? (
                                <div style={styles.emptyGallery}>
                                    No photos yet. Take one to get started!
                                </div>
                            ) : (
                                [...savedPhotos].reverse().map((photo, index) => {
                                    // Renumber based on display position (oldest = photo 1)
                                    const displayNumber = index + 1;
                                    const displayFilename = `photo ${displayNumber}.jpg`;
                                    return (
                                        <div 
                                            key={photo.id} 
                                            style={styles.photoItem}
                                            onDoubleClick={() => openPhotoViewer(photo)}
                                        >
                                            <img
                                                src={photo.dataUrl}
                                                alt={displayFilename}
                                                style={styles.photoThumbnail}
                                            />
                                            <div style={styles.photoInfo}>
                                                <div style={styles.photoName}>{displayFilename}</div>
                                                <div style={styles.photoActions}>
                                                    <button
                                                        style={styles.smallButton}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            downloadPhoto(photo);
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        style={styles.smallButton}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deletePhoto(photo.id);
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
                <div style={styles.statusBar}>
                    {isStreaming ? 'Camera Active' : 'Camera Inactive'} | {savedPhotos.length} photo(s) saved
                </div>
            </div>
        </Window>
        
        {/* Photo Viewer Window */}
        {viewingPhoto && (
            <Window
                top={120}
                left={400}
                width={600}
                height={500}
                windowBarIcon="folderIcon"
                windowTitle={`photo.exe - ${viewingPhoto.filename}`}
                closeWindow={closePhotoViewer}
                onInteract={props.onInteract}
                minimizeWindow={() => {}}
            >
                <div style={styles.photoViewerContainer}>
                    <div style={styles.menuBar}>
                        <div style={styles.menuItem}>File</div>
                        <div style={styles.menuItem}>Edit</div>
                        <div style={styles.menuItem}>View</div>
                        <div style={styles.menuItem}>Help</div>
                    </div>
                    <div style={styles.photoViewerContent}>
                        <img
                            src={viewingPhoto.dataUrl}
                            alt={viewingPhoto.filename}
                            style={styles.fullPhoto}
                        />
                    </div>
                    <div style={styles.statusBar}>
                        {viewingPhoto.filename} | Double-click thumbnail to view
                    </div>
                </div>
            </Window>
        )}
        </>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#c0c0c0',
    },
    menuBar: {
        display: 'flex',
        padding: '2px 0',
        borderBottom: '1px solid #808080',
    },
    menuItem: {
        padding: '0 8px',
        cursor: 'default',
        fontSize: '12px',
    },
    main: {
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        gap: '4px',
        padding: '4px',
    },
    cameraSection: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        border: '1px solid #808080',
        padding: '8px',
    },
    videoContainer: {
        flex: 1,
        backgroundColor: '#000000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        minHeight: '300px',
    },
    video: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        filter: 'grayscale(100%) contrast(1.2)',
    },
    placeholder: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#808080',
    },
    placeholderText: {
        fontSize: '18px',
        marginBottom: '8px',
    },
    placeholderSubtext: {
        fontSize: '12px',
    },
    countdownOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 10,
    },
    countdownText: {
        fontSize: '72px',
        color: '#ffffff',
        fontWeight: 'bold',
        fontFamily: 'Arial',
    },
    controls: {
        display: 'flex',
        gap: '8px',
        padding: '8px',
        backgroundColor: '#c0c0c0',
        marginTop: '8px',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#c0c0c0',
        border: '2px outset #ffffff',
        borderTopColor: '#ffffff',
        borderLeftColor: '#ffffff',
        borderRightColor: '#808080',
        borderBottomColor: '#808080',
        cursor: 'pointer',
        padding: '4px 16px',
        fontSize: '12px',
        minWidth: '100px',
        height: '24px',
        userSelect: 'none',
        fontFamily: 'MS Sans Serif, sans-serif',
    },
    gallerySection: {
        width: '250px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        border: '1px solid #808080',
    },
    galleryHeader: {
        padding: '4px 8px',
        backgroundColor: '#c0c0c0',
        borderBottom: '1px solid #808080',
        fontSize: '12px',
        fontWeight: 'bold',
    },
    gallery: {
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '4px',
        display: 'flex',
        flexDirection: 'column',
    },
    emptyGallery: {
        padding: '16px',
        textAlign: 'center',
        color: '#808080',
        fontSize: '12px',
    },
    photoItem: {
        marginBottom: '8px',
        border: '1px solid #808080',
        padding: '4px',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    photoThumbnail: {
        width: '100%',
        maxHeight: '90px',
        objectFit: 'contain',
        display: 'block',
        imageRendering: 'pixelated',
        cursor: 'pointer',
        backgroundColor: '#000000',
    },
    photoInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    photoName: {
        fontSize: '10px',
        wordBreak: 'break-all',
    },
    photoActions: {
        display: 'flex',
        flexDirection: 'row',
        gap: '4px',
    },
    smallButton: {
        backgroundColor: '#c0c0c0',
        border: '1px outset #ffffff',
        borderTopColor: '#ffffff',
        borderLeftColor: '#ffffff',
        borderRightColor: '#808080',
        borderBottomColor: '#808080',
        cursor: 'pointer',
        padding: '2px 8px',
        fontSize: '10px',
        flex: 1,
        height: '24px',
        fontFamily: 'MS Sans Serif, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    statusBar: {
        padding: '2px 4px',
        borderTop: '1px solid #808080',
        fontSize: '12px',
    },
    photoViewerContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#c0c0c0',
    },
    photoViewerContent: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: '8px',
        overflow: 'auto',
    },
    fullPhoto: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        imageRendering: 'pixelated',
        filter: 'grayscale(100%) contrast(1.3) brightness(0.85)',
    },
} as const;

export default Camera;

