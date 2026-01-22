import Navigation from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Training Events', 'MT Meets', 'Workshops', 'Conferences'];

  const galleryImages = [
    {
      id: 1,
      title: 'Master Technician Training - Jan 2026',
      category: 'Training Events',
      date: '2026-01-15',
      location: 'Mumbai Technical Center',
      imageUrl: 'https://via.placeholder.com/400x300/4A9D5F/FFFFFF?text=MT+Training+Session'
    },
    {
      id: 2,
      title: 'Workshop System Survey Launch',
      category: 'Workshops',
      date: '2026-01-10',
      location: 'Delhi Regional Office',
      imageUrl: 'https://via.placeholder.com/400x300/1E5631/FFFFFF?text=Workshop+Event'
    },
    {
      id: 3,
      title: 'Annual Dealer Conference 2025',
      category: 'Conferences',
      date: '2025-12-20',
      location: 'Bangalore Convention Center',
      imageUrl: 'https://via.placeholder.com/400x300/4A9D5F/FFFFFF?text=Dealer+Conference'
    },
    {
      id: 4,
      title: 'EV Technical Awareness Session',
      category: 'Training Events',
      date: '2025-12-15',
      location: 'Pune Training Facility',
      imageUrl: 'https://via.placeholder.com/400x300/1E5631/FFFFFF?text=EV+Training'
    },
    {
      id: 5,
      title: 'MT Meet Q4 2025',
      category: 'MT Meets',
      date: '2025-11-25',
      location: 'Hyderabad Service Center',
      imageUrl: 'https://via.placeholder.com/400x300/4A9D5F/FFFFFF?text=MT+Meet+Q4'
    },
    {
      id: 6,
      title: 'Warranty Process Workshop',
      category: 'Workshops',
      date: '2025-11-10',
      location: 'Chennai Regional Hub',
      imageUrl: 'https://via.placeholder.com/400x300/1E5631/FFFFFF?text=Warranty+Workshop'
    },
    {
      id: 7,
      title: 'New Model Launch Training',
      category: 'Training Events',
      date: '2025-10-20',
      location: 'Kolkata Training Center',
      imageUrl: 'https://via.placeholder.com/400x300/4A9D5F/FFFFFF?text=Model+Launch'
    },
    {
      id: 8,
      title: 'Technical Excellence Awards',
      category: 'Conferences',
      date: '2025-10-05',
      location: 'New Delhi Grand Hotel',
      imageUrl: 'https://via.placeholder.com/400x300/1E5631/FFFFFF?text=Excellence+Awards'
    },
    {
      id: 9,
      title: 'MT Meet Q3 2025',
      category: 'MT Meets',
      date: '2025-09-18',
      location: 'Mumbai Technical Center',
      imageUrl: 'https://via.placeholder.com/400x300/4A9D5F/FFFFFF?text=MT+Meet+Q3'
    },
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Event Gallery</h1>
          <p className="text-gray-600">Visual documentation of training events, dealer meetings, and corporate activities</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-[#4A9D5F] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <Card key={image.id} className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
              <div className="relative">
                <img 
                  src={image.imageUrl} 
                  alt={image.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-[#4A9D5F] text-white text-xs px-3 py-1 rounded-full font-medium">
                    {image.category}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{image.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <span className="mr-2">📅</span>
                  <span>{image.date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">📍</span>
                  <span>{image.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#4A9D5F]">{galleryImages.length}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Events</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#4A9D5F]">
                    {galleryImages.filter(img => img.category === 'Training Events').length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Training Sessions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#4A9D5F]">
                    {galleryImages.filter(img => img.category === 'MT Meets').length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">MT Meets</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#4A9D5F]">
                    {galleryImages.filter(img => img.category === 'Conferences').length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Conferences</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
