"use client";
import { useState, useEffect } from 'react';
import { supabase, ORG_ID } from '@/lib/supabase';
import {
  Search,
  Filter,
  Plus,
  Send,
  CheckCircle,
  AlertTriangle,
  X,
  ChevronDown,
  Clock,
  Users,
  Calendar,
  Phone,
  MessageSquare,
  Image,
  Bell,
  Zap,
  RefreshCw,
  MoreVertical,
  Paperclip,
  Smile,
  Archive,
  Tag,
} from 'lucide-react';

interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  phoneNumber: string;
  jobAddress: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar: string;
}

interface Message {
  id: string;
  sender: 'sent' | 'received';
  content: string;
  timestamp: string;
  deliveryStatus: 'sent' | 'delivered' | 'failed';
}

interface Campaign {
  id: string;
  name: string;
  recipients: number;
  sent: number;
  deliveryRate: number;
  responseRate: number;
  status: 'Active' | 'Scheduled' | 'Completed' | 'Draft';
}

interface Template {
  id: string;
  name: string;
  preview: string;
  usageCount: number;
  content: string;
}

export default function MessagingPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'conversations' | 'campaigns' | 'templates'>('conversations');
  const [loading, setLoading] = useState(true);

  const stats = {
    sentToday: 847,
    deliveryRate: 98.7,
    responseRate: 34.2,
    avgResponseTime: '2h 14m',
  };

  const mockConversations: Conversation[] = [
    {
      id: '1',
      customerId: 'cust_001',
      customerName: 'James Mitchell',
      phoneNumber: '+1 (555) 234-5678',
      jobAddress: '2847 Oak Ridge Drive, Denver, CO 80210',
      lastMessage: 'Thanks for the estimate. Can you do the work next week?',
      lastMessageTime: '2m ago',
      unreadCount: 2,
      avatar: 'JM',
    },
    {
      id: '2',
      customerId: 'cust_002',
      customerName: 'Sarah Johnson',
      phoneNumber: '+1 (555) 345-6789',
      jobAddress: '1203 Maple Avenue, Boulder, CO 80301',
      lastMessage: 'Looks great! When can your team start?',
      lastMessageTime: '15m ago',
      unreadCount: 0,
      avatar: 'SJ',
    },
    {
      id: '3',
      customerId: 'cust_003',
      customerName: 'Robert Chen',
      phoneNumber: '+1 (555) 456-7890',
      jobAddress: '5621 Summit Drive, Fort Collins, CO 80525',
      lastMessage: 'The roof is looking amazing! Thank you so much.',
      lastMessageTime: '1h ago',
      unreadCount: 0,
      avatar: 'RC',
    },
    {
      id: '4',
      customerId: 'cust_004',
      customerName: 'Patricia Davis',
      phoneNumber: '+1 (555) 567-8901',
      jobAddress: '890 Cherry Lane, Littleton, CO 80120',
      lastMessage: 'Still waiting to hear about financing options',
      lastMessageTime: '3h ago',
      unreadCount: 1,
      avatar: 'PD',
    },
    {
      id: '5',
      customerId: 'cust_005',
      customerName: 'Michael Rodriguez',
      phoneNumber: '+1 (555) 678-9012',
      jobAddress: '2156 Pine Street, Aurora, CO 80010',
      lastMessage: 'Can you provide a written estimate in PDF?',
      lastMessageTime: '4h ago',
      unreadCount: 0,
      avatar: 'MR',
    },
    {
      id: '6',
      customerId: 'cust_006',
      customerName: 'Angela Thompson',
      phoneNumber: '+1 (555) 789-0123',
      jobAddress: '4732 Elm Road, Lakewood, CO 80215',
      lastMessage: 'Our appointment is confirmed for Tuesday at 10am',
      lastMessageTime: '5h ago',
      unreadCount: 0,
      avatar: 'AT',
    },
    {
      id: '7',
      customerId: 'cust_007',
      customerName: 'David Williams',
      phoneNumber: '+1 (555) 890-1234',
      jobAddress: '7891 Spruce Avenue, Westminster, CO 80031',
      lastMessage: 'Insurance adjuster approved the full claim!',
      lastMessageTime: '6h ago',
      unreadCount: 0,
      avatar: 'DW',
    },
    {
      id: '8',
      customerId: 'cust_008',
      customerName: 'Lisa Anderson',
      phoneNumber: '+1 (555) 901-2345',
      jobAddress: '3245 Birch Court, Arvada, CO 80004',
      lastMessage: 'Can we schedule a follow-up inspection?',
      lastMessageTime: '8h ago',
      unreadCount: 0,
      avatar: 'LA',
    },
  ];

  const mockMessages: Message[] = [
    {
      id: 'm1',
      sender: 'received',
      content: 'Hi, I saw your company on Google and wanted to ask about roof repair.',
      timestamp: '9:45 AM',
      deliveryStatus: 'delivered',
    },
    {
      id: 'm2',
      sender: 'sent',
      content: 'Hi James! Thanks for reaching out. We specialize in roof repairs and replacements. What\'s the issue you\'re experiencing?',
      timestamp: '9:52 AM',
      deliveryStatus: 'delivered',
    },
    {
      id: 'm3',
      sender: 'received',
      content: 'We have some missing shingles and leaking in the master bedroom.',
      timestamp: '10:15 AM',
      deliveryStatus: 'delivered',
    },
    {
      id: 'm4',
      sender: 'sent',
      content: 'I\'d love to help! Can I schedule a free inspection? We can typically come out tomorrow or the next day.',
      timestamp: '10:22 AM',
      deliveryStatus: 'delivered',
    },
    {
      id: 'm5',
      sender: 'received',
      content: 'Tomorrow afternoon works great. What time?',
      timestamp: '10:45 AM',
      deliveryStatus: 'delivered',
    },
    {
      id: 'm6',
      sender: 'sent',
      content: 'Perfect! How about 2:00 PM? I\'ll send you a confirmation with our inspector\'s details and your job address.',
      timestamp: '11:02 AM',
      deliveryStatus: 'delivered',
    },
    {
      id: 'm7',
      sender: 'received',
      content: 'Sounds good! See you then.',
      timestamp: '11:08 AM',
      deliveryStatus: 'delivered',
    },
    {
      id: 'm8',
      sender: 'sent',
      content: '✓ Inspection confirmed for tomorrow at 2:00 PM at 2847 Oak Ridge Drive',
      timestamp: '11:10 AM',
      deliveryStatus: 'delivered',
    },
    {
      id: 'm9',
      sender: 'received',
      content: 'Thanks for the estimate. Can you do the work next week?',
      timestamp: '2:15 PM',
      deliveryStatus: 'delivered',
    },
    {
      id: 'm10',
      sender: 'sent',
      content: 'Absolutely! We have availability Tuesday through Friday next week. What works best for you?',
      timestamp: '2:28 PM',
      deliveryStatus: 'sent',
    },
  ];

  const mockCampaigns: Campaign[] = [
    {
      id: 'camp_1',
      name: 'Storm Follow-up',
      recipients: 342,
      sent: 342,
      deliveryRate: 99.1,
      responseRate: 28.4,
      status: 'Active',
    },
    {
      id: 'camp_2',
      name: 'Estimate Reminder',
      recipients: 156,
      sent: 156,
      deliveryRate: 98.7,
      responseRate: 31.9,
      status: 'Active',
    },
    {
      id: 'camp_3',
      name: 'Job Completion Survey',
      recipients: 89,
      sent: 89,
      deliveryRate: 100.0,
      responseRate: 44.3,
      status: 'Completed',
    },
    {
      id: 'camp_4',
      name: 'Referral Request',
      recipients: 124,
      sent: 0,
      deliveryRate: 0.0,
      responseRate: 0.0,
      status: 'Draft',
    },
  ];

  const mockTemplates: Template[] = [
    {
      id: 'tmpl_1',
      name: 'Appointment Confirmation',
      preview: 'Your appointment is confirmed for [DATE] at [TIME]...',
      usageCount: 234,
      content: 'Your appointment is confirmed for [DATE] at [TIME]. Our inspector will meet you at [ADDRESS]. Please call if you need to reschedule.',
    },
    {
      id: 'tmpl_2',
      name: 'Estimate Follow-up',
      preview: 'Following up on the estimate we provided on [DATE]...',
      usageCount: 156,
      content: 'Following up on the estimate we provided on [DATE]. Do you have any questions? We\'d love to discuss this project with you.',
    },
    {
      id: 'tmpl_3',
      name: 'Job Start Notification',
      preview: 'Great news! Your roofing project is scheduled to begin...',
      usageCount: 128,
      content: 'Great news! Your roofing project is scheduled to begin [DATE]. Our crew will arrive at [TIME]. Please secure any outdoor items.',
    },
    {
      id: 'tmpl_4',
      name: 'Completion Notice',
      preview: 'Your roof replacement has been completed successfully!',
      usageCount: 189,
      content: 'Your roof replacement has been completed successfully! The work passed all quality inspections. Paperwork and warranty details are enclosed.',
    },
    {
      id: 'tmpl_5',
      name: 'Review Request',
      preview: 'Thank you for choosing us! We\'d appreciate your feedback...',
      usageCount: 312,
      content: 'Thank you for choosing us for your roofing needs! We\'d love your feedback. Please leave us a review: [REVIEW_LINK]',
    },
    {
      id: 'tmpl_6',
      name: 'Payment Reminder',
      preview: 'This is a friendly reminder about your outstanding balance...',
      usageCount: 87,
      content: 'This is a friendly reminder that your balance of [AMOUNT] is due by [DATE]. Visit [PAYMENT_LINK] to pay online or call us.',
    },
  ];

  useEffect(() => {
    setConversations(mockConversations);
    if (mockConversations.length > 0) {
      setSelectedConversation(mockConversations[0]);
      setMessages(mockMessages);
    }
    setLoading(false);
  }, []);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `m${messages.length + 1}`,
      sender: 'sent',
      content: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryStatus: 'sent',
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // In a real app, fetch messages for this conversation
    setMessages(mockMessages);
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.phoneNumber.includes(searchQuery) ||
      conv.jobAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-teal-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Text Messaging</h1>
              <p className="text-blue-100 mt-1">Manage customer conversations and SMS campaigns</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-lg border border-green-400/50">
                <Bell className="w-4 h-4" />
                <span className="text-sm">RingCentral Connected</span>
              </div>
              <button
                onClick={() => setShowNewMessageModal(true)}
                className="flex items-center gap-2 bg-gold-500 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-semibold transition"
              >
                <Plus className="w-5 h-5" />
                New Message
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
              <p className="text-blue-100 text-sm font-medium">Messages Sent Today</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.sentToday.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
              <p className="text-blue-100 text-sm font-medium">Delivery Rate</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.deliveryRate}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
              <p className="text-blue-100 text-sm font-medium">Response Rate</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.responseRate}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
              <p className="text-blue-100 text-sm font-medium">Avg Response Time</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.avgResponseTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('conversations')}
              className={`py-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'conversations'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Conversations
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'campaigns'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Campaigns
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'templates'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Templates
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Conversations Tab */}
        {activeTab === 'conversations' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-300px)]">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-blue-50 border-l-4 border-l-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {conversation.avatar}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900 truncate">{conversation.customerName}</p>
                          {conversation.unreadCount > 0 && (
                            <span className="flex-shrink-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                          <Tag className="w-3 h-3 text-teal-600" />
                          <span className="text-xs text-teal-600 truncate max-w-[150px]">{conversation.jobAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Conversation */}
            {selectedConversation && (
              <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-300px)]">
                {/* Conversation Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedConversation.customerName}</h2>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {selectedConversation.phoneNumber}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {selectedConversation.jobAddress}
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Messages Thread */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-gray-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'sent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.sender === 'sent'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-900 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div
                          className={`flex items-center gap-1 mt-2 text-xs ${
                            message.sender === 'sent' ? 'text-blue-100' : 'text-gray-600'
                          }`}
                        >
                          <span>{message.timestamp}</span>
                          {message.sender === 'sent' && (
                            <div className="flex items-center gap-0.5">
                              <CheckCircle className="w-3 h-3" />
                              {message.deliveryStatus === 'delivered' && <CheckCircle className="w-3 h-3" />}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-200 bg-white rounded-b-xl">
                  <div className="flex items-end gap-3">
                    <div className="flex-1 relative">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type your message..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition">
                          <Paperclip className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition">
                          <Smile className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Use Template
                    </button>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="grid grid-cols-2 gap-6">
            {mockCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{campaign.name}</h3>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">Recipients</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">{campaign.recipients}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-green-700 font-medium">Sent</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">{campaign.sent}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm text-purple-700 font-medium">Delivery Rate</p>
                    <p className="text-2xl font-bold text-purple-900 mt-1">{campaign.deliveryRate}%</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                    <p className="text-sm text-orange-700 font-medium">Response Rate</p>
                    <p className="text-2xl font-bold text-orange-900 mt-1">{campaign.responseRate}%</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                    View Results
                  </button>
                  {campaign.status === 'Draft' && (
                    <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition">
                      Send Campaign
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-3 gap-6">
            {mockTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-1">{template.preview}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    <Users className="w-4 h-4 inline mr-1" />
                    Used {template.usageCount} times
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition text-sm">
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">New Message</h2>
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Search for a customer</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter name or phone number..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Use a template (optional)</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select a template...</option>
                  {mockTemplates.map((template) => (
                    <option key={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
                <textarea
                  placeholder="Type your message..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <input type="checkbox" id="schedule" className="rounded" />
                <label htmlFor="schedule" className="text-sm text-gray-700 font-medium">
                  Schedule for later
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewMessageModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// MapPin icon placeholder since it's not in the provided list
function MapPin({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
