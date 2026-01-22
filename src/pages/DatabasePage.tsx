import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function DatabasePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const documentCategories = [
    {
      title: 'Technical Service Bulletins',
      description: 'Latest technical updates and service procedures',
      icon: '📋',
      count: 245,
      color: 'bg-blue-500'
    },
    {
      title: 'Workshop Manuals',
      description: 'Comprehensive repair and maintenance guides',
      icon: '🔧',
      count: 89,
      color: 'bg-green-500'
    },
    {
      title: 'Wiring Diagrams',
      description: 'Electrical system schematics and diagrams',
      icon: '⚡',
      count: 156,
      color: 'bg-yellow-500'
    },
    {
      title: 'Parts Catalogs',
      description: 'Original equipment parts and specifications',
      icon: '🔩',
      count: 342,
      color: 'bg-purple-500'
    },
    {
      title: 'Diagnostic Procedures',
      description: 'Troubleshooting guides and diagnostic codes',
      icon: '🔍',
      count: 198,
      color: 'bg-red-500'
    },
    {
      title: 'Training Materials',
      description: 'Technical training documents and presentations',
      icon: '📚',
      count: 76,
      color: 'bg-indigo-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Technical Database</h1>
          <p className="text-gray-600">Access comprehensive technical documentation and dealer resources</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Search documentation by keyword, part number, or model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button className="bg-[#4A9D5F] hover:bg-[#3A7D4F]">
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Document Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {documentCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 ${category.color} bg-opacity-10 rounded-lg`}>
                    <span className="text-4xl">{category.icon}</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-400">{category.count}</span>
                </div>
                <CardTitle className="text-[#4A9D5F]">{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Browse {category.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Updates */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Updates</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[
                  { title: 'TSB-2026-001: Battery Management System Update', date: '2026-01-20', category: 'Technical Bulletin' },
                  { title: 'Workshop Manual: New Model Year 2026 Procedures', date: '2026-01-18', category: 'Manual' },
                  { title: 'Diagnostic Update: OBD-II Code P0420 Procedure', date: '2026-01-15', category: 'Diagnostic' },
                  { title: 'Parts Catalog: Q1 2026 Updates', date: '2026-01-10', category: 'Parts' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.category} • {item.date}</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <div className="text-2xl mb-1">🆕</div>
                <div className="text-sm">New Documents</div>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <div className="text-2xl mb-1">⭐</div>
                <div className="text-sm">Favorites</div>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <div className="text-2xl mb-1">📥</div>
                <div className="text-sm">Downloads</div>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <div className="text-2xl mb-1">🕐</div>
                <div className="text-sm">Recent</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
