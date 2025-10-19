import React from 'react';

const ImageTest: React.FC = () => {
  const testImages = [
    'https://images.unsplash.com/photo-1599550931215-c0529d3c509d?q=80&w=800',
    'https://placehold.co/400x400/F8E3D9/333333?text=Tattva+Co.',
    'https://via.placeholder.com/400x400/F8E3D9/333333?text=Test'
  ];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Image Loading Test</h2>
      {testImages.map((src, index) => (
        <div key={index} className="border p-4">
          <p className="text-sm mb-2">Image {index + 1}: {src}</p>
          <img 
            src={src} 
            alt={`Test image ${index + 1}`}
            className="w-32 h-32 object-cover border"
            onLoad={() => console.log(`Image ${index + 1} loaded:`, src)}
            onError={() => console.log(`Image ${index + 1} failed:`, src)}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageTest;