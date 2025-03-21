import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { tabVariants, contentVariants } from '../../utils';

export default function Carousel() {
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [models, setModels] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const videoRef = useRef([]);
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/media');
        
        
        setVideos(response.data.videos?.videos || []);

        setImages(response.data.images?.photos || response.data.images || []);
        setModels([]); 
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };
    fetchMedia();
  }, []);

  
  useEffect(() => {
    if (activeTab === 0 && videos.length > 0 && videoRef.current[currentIndex]) {
      const video = videoRef.current[currentIndex];
      video.play().catch((error) => console.error('Video playback error:', error));
      if (currentIndex + 1 < videos.length && videoRef.current[currentIndex + 1]) {
        videoRef.current[currentIndex + 1].load();
      }
    }
  }, [currentIndex, activeTab, videos]);

  
  const handleVerticalDragEnd = (event, info) => {
    setIsSwiping(true);
    const threshold = 80;
    const currentMedia = activeTab === 0 ? videos : activeTab === 1 ? images : models;

    if (info.offset.y < -threshold && currentIndex < currentMedia.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (info.offset.y > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }

    setTimeout(() => setIsSwiping(false), 100);
  };


  const handleTabDragEnd = (event, info) => {
    const threshold = 50;
    if (info.offset.x < -threshold && activeTab < 2) {
      setActiveTab((prev) => prev + 1);
      setCurrentIndex(0);
    } else if (info.offset.x > threshold && activeTab > 0) {
      setActiveTab((prev) => prev - 1);
      setCurrentIndex(0);
    }
  };

  return (
    <div className="h-screen w-full bg-black overflow-hidden">
      <motion.div
        className="relative h-full w-full pb-16"
        drag={!isSwiping ? 'y' : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0}
        onDragStart={() => setIsSwiping(true)}
        onDragEnd={handleVerticalDragEnd}
        style={{ touchAction: 'none' }}
      >
        <AnimatePresence mode="wait">

          {activeTab === 0 && videos.length > 0 && (
            <motion.video
              key={`video-${videos[currentIndex].id}`}
              ref={(el) => (videoRef.current[currentIndex] = el)}
              className="absolute w-full h-full object-cover"
              autoPlay
              loop
              muted
              controls={!isSwiping}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.1, ease: 'easeInOut' }}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            >
              <source
                src={
                  videos[currentIndex].video_files.find((file) => file.quality === 'hd')?.link ||
                  videos[currentIndex].video_files[0]?.link
                }
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </motion.video>
          )}


          {activeTab === 1 && images.length > 0 && (
            <motion.img
              key={`image-${images[currentIndex].id}`}
              src={images[currentIndex].src?.original || images[currentIndex].url} // Pexels Photos API uses src.original
              className="absolute w-full h-full object-cover"
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.05, ease: 'easeInOut' }}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          )}

  
          {activeTab === 2 && models.length > 0 && (
            <motion.div
              key={`model-${models[currentIndex].id}`}
              className="absolute w-full h-full flex items-center justify-center bg-gray-900"
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            >
              <div className="text-white text-center">
                3D Model: {models[currentIndex].src}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20 py-1 px-3 rounded-xl"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          width: '80%',
          maxWidth: '250px',
        }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          onDragEnd={handleTabDragEnd}
          style={{ width: '100%', height: '100%' }}
        >
          <div className="flex justify-center gap-4">
            {['Videos', 'Images', '3D Models'].map((tab, index) => (
              <motion.div
                key={tab}
                className={`text-white cursor-pointer p-1 text-sm rounded-lg ${
                  activeTab === index ? 'bg-white/20' : ''
                }`}
                variants={tabVariants}
                animate={activeTab === index ? 'active' : 'inactive'}
                whileHover={{ scale: 1.15 }}
                onTap={() => {
                  setActiveTab(index);
                  setCurrentIndex(0);
                }}
              >
                {tab}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}