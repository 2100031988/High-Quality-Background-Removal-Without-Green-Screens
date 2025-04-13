import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2 } from 'lucide-react';

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setProcessedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      // Convert base64 to blob
      const response = await fetch(selectedImage);
      const blob = await response.blob();

      // Create form data
      const formData = new FormData();
      formData.append('image_file', blob);

      // Call remove.bg API
      const result = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': '4p1egj6fXnsT8AoGmvREnoDH', // Users need to replace this with their API key
        },
        body: formData,
      });

      if (!result.ok) throw new Error('Failed to process image');

      const processedBlob = await result.blob();
      const processedUrl = URL.createObjectURL(processedBlob);
      setProcessedImage(processedUrl);
    } catch (err) {
      setError('Failed to process image. Please make sure you have a valid API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setProcessedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Background Removal Tool</h1>
          <p className="text-gray-400">Remove backgrounds from your images instantly using AI</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Original Image</h2>
              <div 
                className={`border-2 border-dashed rounded-lg p-4 text-center ${
                  selectedImage ? 'border-green-500' : 'border-gray-600'
                }`}
              >
                {selectedImage ? (
                  <img 
                    src={selectedImage} 
                    alt="Selected" 
                    className="max-w-full h-auto rounded-lg"
                  />
                ) : (
                  <div className="py-12">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-500">Click or drag image here</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                  id="imageInput"
                />
              </div>
              <div className="flex justify-center gap-4">
                <label 
                  htmlFor="imageInput"
                  className="px-4 py-2 bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  Select Image
                </label>
                {selectedImage && (
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Processed Image</h2>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                {processedImage ? (
                  <img 
                    src={processedImage} 
                    alt="Processed" 
                    className="max-w-full h-auto rounded-lg"
                  />
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    {loading ? (
                      <div className="animate-pulse">Processing...</div>
                    ) : (
                      <p>Processed image will appear here</p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleRemoveBackground}
                  disabled={!selectedImage || loading}
                  className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${
                    !selectedImage || loading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {loading ? 'Processing...' : 'Remove Background'}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}

          <div className="mt-8 text-center text-sm text-gray-400">
            <p>
              This tool uses the remove.bg API. You'll need to{' '}
              <a 
                href="https://www.remove.bg/api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                get an API key
              </a>
              {' '}to use this tool.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;