import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dealerCode: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Contact Us</h1>
          <p className="text-gray-600">Get in touch with our support team for assistance and inquiries</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-t-4 border-t-[#4A9D5F]">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-[#4A9D5F]/10 rounded-lg">
                    <span className="text-3xl">📞</span>
                  </div>
                  <div>
                    <CardTitle className="text-[#4A9D5F]">Helpline</CardTitle>
                    <CardDescription>Direct phone support</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-800 mb-2">1800-XXX-XXXX</p>
                <p className="text-sm text-gray-600">Monday - Friday</p>
                <p className="text-sm text-gray-600">9:00 AM - 6:00 PM IST</p>
                <p className="text-xs text-gray-500 mt-3">Toll-free for all dealers</p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-[#4A9D5F]">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-[#4A9D5F]/10 rounded-lg">
                    <span className="text-3xl">📧</span>
                  </div>
                  <div>
                    <CardTitle className="text-[#4A9D5F]">Email</CardTitle>
                    <CardDescription>General inquiries</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-gray-800 mb-2 break-all">
                  support@skoda-vw-dealer.com
                </p>
                <p className="text-sm text-gray-600 mb-3">Response within 24 hours</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = 'mailto:support@skoda-vw-dealer.com'}
                >
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-[#4A9D5F]">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-[#4A9D5F]/10 rounded-lg">
                    <span className="text-3xl">🏢</span>
                  </div>
                  <div>
                    <CardTitle className="text-[#4A9D5F]">Office</CardTitle>
                    <CardDescription>Dealer support center</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Škoda | Volkswagen<br />
                  Dealer Support Division<br />
                  123 Auto Plaza<br />
                  New Delhi - 110001<br />
                  India
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#4A9D5F]/10 to-[#1E5631]/5">
              <CardHeader>
                <CardTitle className="text-gray-800">Business Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday:</span>
                    <span className="font-semibold text-gray-800">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday:</span>
                    <span className="font-semibold text-gray-800">9:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday:</span>
                    <span className="font-semibold text-gray-800">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-t-4 border-t-[#4A9D5F]">
              <CardHeader>
                <CardTitle className="text-2xl text-[#4A9D5F]">Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dealer Code <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="dealerCode"
                        value={formData.dealerCode}
                        onChange={handleChange}
                        placeholder="e.g., DLR12345"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A9D5F]"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="technical">Technical Support</option>
                      <option value="api">API Registration</option>
                      <option value="training">Training & Events</option>
                      <option value="survey">Survey Related</option>
                      <option value="account">Account & Access</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A9D5F]"
                      placeholder="Please provide detailed information about your inquiry..."
                      required
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Note:</strong> For urgent technical issues, please call our helpline number 
                      for immediate assistance during business hours.
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#4A9D5F] hover:bg-[#3A7D4F] text-white font-semibold py-6 text-lg"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quick Help Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center space-y-2">
                  <span className="text-2xl">❓</span>
                  <span className="text-sm">FAQs</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center space-y-2">
                  <span className="text-2xl">📚</span>
                  <span className="text-sm">User Guide</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center space-y-2">
                  <span className="text-2xl">🎥</span>
                  <span className="text-sm">Video Tutorials</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center space-y-2">
                  <span className="text-2xl">📖</span>
                  <span className="text-sm">Documentation</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
