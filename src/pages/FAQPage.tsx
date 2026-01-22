import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

export default function FAQPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const faqCategories = [
    {
      category: 'Account & Access',
      icon: '🔐',
      questions: [
        {
          id: 1,
          question: 'How do I register for a dealer portal account?',
          answer: 'To register for a dealer portal account, contact your regional Škoda | Volkswagen representative with your dealer code and business details. They will initiate the registration process and provide you with your login credentials.'
        },
        {
          id: 2,
          question: 'I forgot my password. How can I reset it?',
          answer: 'Click on the "Forgot Password" link on the login page. Enter your registered email address, and you will receive a password reset link. Follow the instructions in the email to create a new password.'
        },
        {
          id: 3,
          question: 'Why am I unable to access certain modules?',
          answer: 'Module access is role-based and determined by your user permissions. If you need access to additional modules, please contact your dealer principal or submit a request through the Contact page.'
        },
      ],
    },
    {
      category: 'API Registration',
      icon: '🔗',
      questions: [
        {
          id: 4,
          question: 'What is API registration and why do I need it?',
          answer: 'API registration enables secure integration between your dealer management system and manufacturer platforms. This allows real-time data exchange for inventory, service records, warranty claims, and other critical information.'
        },
        {
          id: 5,
          question: 'How long does API approval take?',
          answer: 'API registration requests are typically reviewed within 2-3 business days. You will receive an email notification once your API credentials are approved and ready for use.'
        },
        {
          id: 6,
          question: 'Where can I find API documentation?',
          answer: 'Complete API documentation is available in the Database section under "API Resources." You can also download the API integration guide from the API Registration page after your credentials are approved.'
        },
      ],
    },
    {
      category: 'Training & Events',
      icon: '👨‍🏫',
      questions: [
        {
          id: 7,
          question: 'How do I register for Master Technician (MT) meets?',
          answer: 'Navigate to the MT Meet Registration page, select the upcoming event you wish to attend, fill in the participant details, and submit the registration form. You will receive a confirmation email with event details.'
        },
        {
          id: 8,
          question: 'Can I cancel or modify my event registration?',
          answer: 'Yes, you can modify or cancel registrations up to 48 hours before the event start time. Go to the MT Meet page, view your registered events, and select the modify/cancel option.'
        },
        {
          id: 9,
          question: 'Are training certificates provided after completion?',
          answer: 'Yes, digital certificates are issued automatically after successful completion of training programs. Certificates can be downloaded from your Dashboard under "My Certifications."'
        },
      ],
    },
    {
      category: 'Surveys',
      icon: '📊',
      questions: [
        {
          id: 10,
          question: 'How often should I complete surveys?',
          answer: 'Survey frequency varies by type. Workshop and Warranty surveys are typically quarterly, while Technical Awareness surveys are event-based. You will receive email notifications when new surveys are available.'
        },
        {
          id: 11,
          question: 'Are survey responses anonymous?',
          answer: 'Survey responses are confidential and used only for internal improvement purposes. While dealer information is tracked for statistical analysis, individual responses are not shared publicly.'
        },
        {
          id: 12,
          question: 'Can I save a survey and complete it later?',
          answer: 'Yes, surveys can be saved as drafts and completed later. Your progress is automatically saved, and you can resume from where you left off within the survey validity period.'
        },
      ],
    },
    {
      category: 'Technical Support',
      icon: '🛠️',
      questions: [
        {
          id: 13,
          question: 'Who do I contact for technical issues with the portal?',
          answer: 'For technical issues, use the Contact page to reach our support team. You can also call the helpline number provided in the Contact section for immediate assistance during business hours.'
        },
        {
          id: 14,
          question: 'What browsers are supported?',
          answer: 'The portal is optimized for the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, ensure your browser is updated to the latest version and JavaScript is enabled.'
        },
        {
          id: 15,
          question: 'How do I download documents from the Database?',
          answer: 'Navigate to the Database page, search or browse for the required document, click on the document title to view details, and then click the "Download" button. Downloaded files are available in your browser\'s download folder.'
        },
      ],
    },
  ];

  const toggleQuestion = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600">Find answers to common questions about the Škoda | Volkswagen Dealer Portal</p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category) => (
            <div key={category.category}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-[#4A9D5F]/10 rounded-lg">
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{category.category}</h2>
              </div>

              <div className="space-y-3">
                {category.questions.map((item) => (
                  <Card 
                    key={item.id}
                    className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => toggleQuestion(item.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg text-gray-800 pr-4">
                          {item.question}
                        </CardTitle>
                        <div className={`text-2xl transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`}>
                          ▼
                        </div>
                      </div>
                    </CardHeader>
                    {expandedId === item.id && (
                      <CardContent>
                        <CardDescription className="text-gray-700 text-base leading-relaxed">
                          {item.answer}
                        </CardDescription>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12">
          <Card className="border-t-4 border-t-[#4A9D5F] bg-gradient-to-r from-[#4A9D5F]/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-2xl text-[#4A9D5F]">Still Have Questions?</CardTitle>
              <CardDescription className="text-base">
                If you couldn't find the answer you're looking for, our support team is here to help.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-3xl">📧</span>
                      <div>
                        <h3 className="font-semibold text-gray-800">Email Support</h3>
                        <p className="text-sm text-gray-600">support@skoda-vw-dealer.com</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Response time: Within 24 hours
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-3xl">📞</span>
                      <div>
                        <h3 className="font-semibold text-gray-800">Helpline</h3>
                        <p className="text-sm text-gray-600">1800-XXX-XXXX</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Mon-Fri: 9:00 AM - 6:00 PM
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
