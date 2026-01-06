import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ImageSearch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const autoCaptureTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasCapturedRef = useRef<boolean>(false);
  const [textColor, setTextColor] = useState<'#FFF' | '#333333'>('#FFF');
  const brightnessCheckCanvasRef = useRef<HTMLCanvasElement>(null);

  // Check brightness of camera feed to determine text color
  const checkBrightness = () => {
    if (videoRef.current && brightnessCheckCanvasRef.current) {
      const video = videoRef.current;
      const canvas = brightnessCheckCanvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
        // Sample a small area from the top center where text is displayed
        const sampleWidth = Math.min(200, video.videoWidth);
        const sampleHeight = Math.min(100, video.videoHeight);
        
        canvas.width = sampleWidth;
        canvas.height = sampleHeight;
        ctx.drawImage(video, 0, 0, sampleWidth, sampleHeight, 0, 0, sampleWidth, sampleHeight);
        
        const imageData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
        const data = imageData.data;
        
        // Calculate average brightness
        let totalBrightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Calculate luminance
          const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          totalBrightness += brightness;
        }
        
        const averageBrightness = totalBrightness / (data.length / 4);
        
        // If brightness is above 0.5 (50%), use dark gray text; otherwise use white
        setTextColor(averageBrightness > 0.5 ? '#333333' : '#FFF');
      }
    }
  };

  // Start camera when component mounts
  useEffect(() => {
    hasCapturedRef.current = false;
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Check brightness periodically when video is ready
          videoRef.current.onloadedmetadata = () => {
            // Check brightness periodically
            const brightnessInterval = setInterval(() => {
              checkBrightness();
            }, 500); // Check every 500ms
            
            // Store interval ID for cleanup
            (videoRef.current as any).brightnessInterval = brightnessInterval;
          };
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        // Fallback to file input if camera access fails
        const fileInput = document.getElementById('image-upload') as HTMLInputElement;
        if (fileInput) {
          fileInput.click();
        }
      }
    };
    initializeCamera();

    return () => {
      if (autoCaptureTimerRef.current) {
        clearTimeout(autoCaptureTimerRef.current);
      }
      if (videoRef.current && (videoRef.current as any).brightnessInterval) {
        clearInterval((videoRef.current as any).brightnessInterval);
      }
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  // Stop camera stream
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Handle image from file or camera
  const handleImageFromFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('Image size must be less than 10MB');
      return;
    }

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);

    // Navigate back to home with image data
    // Note: FormData cannot be cloned in history state, so we'll recreate it when needed
    navigate('/', {
      state: {
        selectedImage: file,
        selectedImageUrl: imageUrl,
        openSearchFlow: true
      }
    });
  };

  // Capture image from camera - only the scan area (280x280px)
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
        const scanAreaSize = 280; // Size of the scan area in pixels
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Calculate the scale factor between video and screen
        // Video uses objectFit: 'cover', so it fills the screen
        const videoAspect = video.videoWidth / video.videoHeight;
        const screenAspect = screenWidth / screenHeight;
        
        let scaleX, scaleY, offsetX = 0, offsetY = 0;
        
        if (videoAspect > screenAspect) {
          // Video is wider - it's cropped on left/right
          scaleY = video.videoHeight / screenHeight;
          scaleX = scaleY;
          const scaledWidth = screenWidth * scaleX;
          offsetX = (video.videoWidth - scaledWidth) / 2;
        } else {
          // Video is taller - it's cropped on top/bottom
          scaleX = video.videoWidth / screenWidth;
          scaleY = scaleX;
          const scaledHeight = screenHeight * scaleY;
          offsetY = (video.videoHeight - scaledHeight) / 2;
        }
        
        // Calculate scan area position in video coordinates
        // Scan area is centered on screen
        const scanAreaScreenX = (screenWidth - scanAreaSize) / 2;
        const scanAreaScreenY = (screenHeight - scanAreaSize) / 2;
        
        // Convert screen coordinates to video coordinates
        const scanAreaX = scanAreaScreenX * scaleX + offsetX;
        const scanAreaY = scanAreaScreenY * scaleY + offsetY;
        const scanAreaWidth = scanAreaSize * scaleX;
        const scanAreaHeight = scanAreaSize * scaleY;
        
        // Set canvas to scan area size
        canvas.width = scanAreaSize;
        canvas.height = scanAreaSize;
        
        // Draw only the scan area portion
        ctx.drawImage(
          video,
          scanAreaX, scanAreaY, scanAreaWidth, scanAreaHeight,
          0, 0, scanAreaSize, scanAreaSize
        );

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            stopCamera();
            handleImageFromFile(file);
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  // Handle file input change
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      stopCamera();
      handleImageFromFile(file);
    }
    // Reset input value
    event.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#000', isolation: 'isolate' }}>
      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* Hidden canvas for brightness checking */}
      <canvas ref={brightnessCheckCanvasRef} style={{ display: 'none' }} />
      
      {/* Hidden file input for gallery */}
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
      
      {/* Camera View Area - Full Screen */}
      <div className="absolute inset-0" style={{ overflow: 'hidden', zIndex: 1 }}>
        {/* Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
        
        {/* Header - Overlay on camera */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4 pb-3" style={{ zIndex: 10, backgroundColor: 'transparent' }}>
          <h1 style={{ fontSize: '14px', fontWeight: 600, color: textColor, fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Search by image
          </h1>
          <div className="flex items-center gap-3">
            {/* Flash Icon */}
            <button
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </button>
            {/* Close Icon */}
            <button
              onClick={() => {
                stopCamera();
                navigate(-1); // Go back to previous page
              }}
              style={{ color: textColor, background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Scan Area Overlay - Corner Brackets */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
          <div
            style={{
              width: '280px',
              height: '280px',
              position: 'relative'
            }}
          >
            {/* Top-left corner */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '40px',
              height: '40px',
              borderTop: '3px solid #FFF',
              borderLeft: '3px solid #FFF',
              borderTopLeftRadius: '12px'
            }} />
            {/* Top-right corner */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '40px',
              height: '40px',
              borderTop: '3px solid #FFF',
              borderRight: '3px solid #FFF',
              borderTopRightRadius: '12px'
            }} />
            {/* Bottom-left corner */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '40px',
              height: '40px',
              borderBottom: '3px solid #FFF',
              borderLeft: '3px solid #FFF',
              borderBottomLeftRadius: '12px'
            }} />
            {/* Bottom-right corner */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '40px',
              height: '40px',
              borderBottom: '3px solid #FFF',
              borderRight: '3px solid #FFF',
              borderBottomRightRadius: '12px'
            }} />
          </div>
        </div>
        
        {/* Instruction Text */}
        <div
          style={{
            position: 'absolute',
            bottom: '140px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            color: '#FFF',
            fontSize: '11px',
            fontFamily: 'Poppins, sans-serif',
            padding: '0 20px',
            lineHeight: '1.3',
            maxWidth: '320px',
            zIndex: 3
          }}
        >
          Press the camera icon to start a{' '}<br />search for this product
        </div>
      </div>

      {/* Bottom Button - Overlay on camera */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-6" style={{ zIndex: 10, backgroundColor: 'transparent' }}>
        <button
          style={{
            width: 'auto',
            minWidth: '200px',
            height: '48px',
            borderRadius: '50px',
            backgroundColor: '#000',
            border: 'none',
            color: '#FFF',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '12px',
            padding: '0 8px 0 4px',
            margin: '0 auto'
          }}
        >
          <div
            onClick={() => {
              // Capture image from scan area when camera icon is clicked
              captureImage();
            }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              cursor: 'pointer'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
          <span 
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              stopCamera();
              // Trigger file input for gallery
              const fileInput = document.getElementById('image-upload') as HTMLInputElement;
              if (fileInput) {
                fileInput.click();
              }
            }}
          >
            Or browse your gallery
          </span>
        </button>
      </div>
    </div>
  );
};

export default ImageSearch;

