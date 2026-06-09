import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useRef } from "react";

interface PhotosStepProps {
  photos: string[];
  setPhotos: (photos: string[]) => void;
  selectedCategory: string | null;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  selectedFiles: string[];
  setSelectedFiles: (files: string[] | ((prev: string[]) => string[])) => void;
  activeMenuIndex: number | null;
  setActiveMenuIndex: (index: number | null) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeSelectedFile: (index: number) => void;
  handleUpload: () => void;
  removePhoto: (index: number) => void;
  makeCoverPhoto: (index: number) => void;
  movePhoto: (index: number, direction: 'forward' | 'backward') => void;
  menuRef: React.RefObject<HTMLDivElement>;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const PhotosStep = ({
  photos,
  setPhotos,
  selectedCategory,
  isUploadModalOpen,
  setIsUploadModalOpen,
  selectedFiles,
  setSelectedFiles,
  activeMenuIndex,
  setActiveMenuIndex,
  handleFileChange,
  removeSelectedFile,
  handleUpload,
  removePhoto,
  makeCoverPhoto,
  movePhoto,
  menuRef,
  fileInputRef,
}: PhotosStepProps) => {

  const addPhoto = () => {
    setIsUploadModalOpen(true);
  };

  return (
    <motion.div
      key="photos"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col items-center px-6 py-8 md:p-10 overflow-y-auto"
    >
      <div className="max-w-2xl w-full">
{photos.length === 0 ? (
          <>
            <h1 className="text-[26px] md:text-4xl font-display font-[600] text-slate-900 leading-tight mb-3">
              Add some photos of your {selectedCategory === 'home' ? 'place' : selectedCategory}
            </h1>
            <p className="text-slate-500 text-lg mb-10 leading-relaxed">
              You'll need 5 photos to get started. You can add more or make changes later.
            </p>
            <div 
              onClick={addPhoto}
              className="aspect-[4/5] md:aspect-video w-full border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center p-10 group cursor-pointer hover:border-brand-500 transition-all bg-slate-50/30"
            >
              <div className="w-48 h-48 mb-6 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="ph-bold ph-images text-[100px] text-slate-200 group-hover:text-brand-100 transition-colors"></i>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Drag your photos here</h3>
                <p className="text-slate-500 mb-8">or browse from your device</p>
                <button className="px-8 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
                  Add photos
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-1">
              <h1 className="text-[26px] md:text-3xl font-display font-bold text-slate-900">
                Choose at least 5 photos
              </h1>
              <button 
                onClick={addPhoto}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-900 hover:bg-slate-50 transition-all"
              >
                <i className="ph-bold ph-plus text-xl"></i>
              </button>
            </div>
            <p className="text-slate-500 text-lg mb-10">Drag to reorder</p>
            
            <Reorder.Group 
              axis="y" 
              values={photos} 
              onReorder={setPhotos}
              className="space-y-6 pb-20"
            >
              {photos.map((photo, index) => (
                <Reorder.Item 
                  key={photo} 
                  value={photo}
                  className="relative group rounded-[32px] overflow-hidden border-2 border-slate-200 bg-slate-50 aspect-video cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
                >
                  <img src={photo} className="w-full h-full object-cover pointer-events-none" alt={`Listing ${index}`} />
                  
                  {index === 0 && (
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold shadow-md z-10 text-slate-900 border border-slate-100">
                      Cover Photo
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4 z-20">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuIndex(activeMenuIndex === index ? null : index);
                      }}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md text-slate-900 hover:bg-white transition-all"
                    >
                      <i className="ph-bold ph-dots-three text-xl"></i>
                    </button>
                    
                    {activeMenuIndex === index && (
                      <div 
                        ref={menuRef}
                        className="absolute top-12 right-0 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-[70] animate-in fade-in slide-in-from-top-2 duration-200"
                      >
                        <button className="w-full px-5 py-3 text-left hover:bg-slate-50 font-medium text-slate-700 transition-colors">Edit</button>
                        
                        <button 
                          disabled={index === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            movePhoto(index, 'backward');
                          }}
                          className={`w-full px-5 py-3 text-left font-medium transition-colors ${index === 0 ? 'text-slate-200 cursor-not-allowed' : 'hover:bg-slate-50 text-slate-700'}`}
                        >
                          Move backward
                        </button>
                        
                        <button 
                          disabled={index === photos.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            movePhoto(index, 'forward');
                          }}
                          className={`w-full px-5 py-3 text-left font-medium transition-colors ${index === photos.length - 1 ? 'text-slate-200 cursor-not-allowed' : 'hover:bg-slate-50 text-slate-700'}`}
                        >
                          Move forward
                        </button>
                        
                        {index !== 0 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              makeCoverPhoto(index);
                            }}
                            className="w-full px-5 py-3 text-left hover:bg-slate-50 font-medium text-slate-700 transition-colors"
                          >
                            Make cover photo
                          </button>
                        )}
                        <div className="h-px bg-slate-100 my-2"></div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removePhoto(index);
                          }}
                          className="w-full px-5 py-3 text-left hover:bg-red-50 font-medium text-red-500 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </>
        )}

        {photos.length > 0 && photos.length < 5 && (
          <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
            <i className="ph-bold ph-info text-amber-500 text-xl"></i>
            <p className="text-sm text-amber-700 font-medium">
              Add {5 - photos.length} more photo{5 - photos.length === 1 ? '' : 's'} to continue.
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center p-0 md:p-6"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-2xl rounded-t-[32px] md:rounded-[32px] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
                <button 
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setSelectedFiles([]);
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-all"
                >
                  <i className="ph-bold ph-x text-xl"></i>
                </button>
                <div className="text-center">
                  <h2 className="text-lg font-bold text-slate-900">Upload photos</h2>
                  <p className="text-sm text-slate-500">
                    {selectedFiles.length === 0 ? "No items selected" : `${selectedFiles.length} item${selectedFiles.length === 1 ? '' : 's'} selected`}
                  </p>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50 transition-all"
                >
                  <i className="ph-bold ph-plus text-xl"></i>
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 min-h-[400px]">
                {selectedFiles.length === 0 ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-full border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center p-12 group cursor-pointer hover:border-brand-500 transition-all bg-slate-50/50"
                  >
                    <i className="ph ph-plus text-4xl text-slate-300 mb-4 group-hover:text-brand-500 transition-colors"></i>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Select photos</h3>
                    <p className="text-slate-500">Drag or click to add</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative aspect-video rounded-[28px] overflow-hidden border border-slate-100 group shadow-sm bg-slate-50">
                        <img src={file} className="w-full h-full object-cover" alt={`Selected ${index}`} />
                        <button 
                          onClick={() => removeSelectedFile(index)}
                          className="absolute top-3 right-3 w-10 h-10 bg-black/60 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black transition-all"
                        >
                          <i className="ph-bold ph-trash text-lg"></i>
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-video rounded-[28px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-brand-500 hover:bg-slate-50 transition-all"
                    >
                      <i className="ph ph-plus text-2xl text-slate-400"></i>
                      <span className="font-bold text-slate-400">Add more</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-8 border-t border-slate-100 flex items-center justify-between bg-white">
                <button 
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setSelectedFiles([]);
                  }}
                  className="text-lg font-bold text-slate-900 hover:opacity-70 transition-opacity"
                >
                  Cancel
                </button>
                <button 
                  disabled={selectedFiles.length === 0}
                  onClick={handleUpload}
                  className={`px-12 py-4 rounded-[18px] font-bold text-lg transition-all active:scale-95 ${
                    selectedFiles.length === 0 
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed" 
                      : "bg-slate-900 text-white hover:bg-black shadow-lg"
                  }`}
                >
                  Upload
                </button>
              </div>
            </motion.div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              multiple 
              onChange={handleFileChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

