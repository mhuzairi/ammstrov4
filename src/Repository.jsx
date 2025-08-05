import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  FileText,
  Download,
  Upload,
  BookOpen,
  Settings,
  Shield,
  Users,
  MessageSquare,
  Menu,
  X,
  Search,
  Filter,
  FolderOpen,
  File,
  Calendar,
  Eye,
  Trash2,
  Edit,
  Plus,
  LogOut,
  User
} from 'lucide-react'
import ammstroLogo from '/assets/ammstro-logo.png'
import { useAuth } from '@/hooks/use-auth.js'

function Repository() {
  const { isAuthenticated, user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const fileInputRef = useRef(null)

  // Documentation categories based on the main documentation page
  const categories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      description: 'Quick start guides and initial setup documentation',
      icon: BookOpen,
      color: 'blue',
      count: 8
    },
    {
      id: 'api-reference',
      name: 'API Reference',
      description: 'Complete API documentation and endpoints',
      icon: Settings,
      color: 'green',
      count: 15
    },
    {
      id: 'user-guides',
      name: 'User Guides',
      description: 'Step-by-step user manuals and tutorials',
      icon: Users,
      color: 'purple',
      count: 12
    },
    {
      id: 'technical-specs',
      name: 'Technical Specs',
      description: 'Technical specifications and system requirements',
      icon: Shield,
      color: 'orange',
      count: 6
    },
    {
      id: 'help-center',
      name: 'Help Center',
      description: 'FAQ and troubleshooting guides',
      icon: MessageSquare,
      color: 'teal',
      count: 20
    },
    {
      id: 'training',
      name: 'Training Materials',
      description: 'Training videos, presentations, and materials',
      icon: FileText,
      color: 'indigo',
      count: 10
    }
  ]

  // Sample files for each category
  const sampleFiles = [
    {
      id: 1,
      name: 'AMMSTRO Quick Start Guide.pdf',
      category: 'getting-started',
      size: '2.4 MB',
      uploadDate: '2025-01-05',
      downloads: 156,
      type: 'pdf'
    },
    {
      id: 2,
      name: 'API Authentication Guide.pdf',
      category: 'api-reference',
      size: '1.8 MB',
      uploadDate: '2025-01-04',
      downloads: 89,
      type: 'pdf'
    },
    {
      id: 3,
      name: 'User Manual v2.1.pdf',
      category: 'user-guides',
      size: '5.2 MB',
      uploadDate: '2025-01-03',
      downloads: 234,
      type: 'pdf'
    },
    {
      id: 4,
      name: 'System Requirements.docx',
      category: 'technical-specs',
      size: '890 KB',
      uploadDate: '2025-01-02',
      downloads: 67,
      type: 'docx'
    },
    {
      id: 5,
      name: 'Troubleshooting FAQ.pdf',
      category: 'help-center',
      size: '1.2 MB',
      uploadDate: '2025-01-01',
      downloads: 178,
      type: 'pdf'
    },
    {
      id: 6,
      name: 'Training Presentation.pptx',
      category: 'training',
      size: '12.5 MB',
      uploadDate: '2024-12-30',
      downloads: 45,
      type: 'pptx'
    }
  ]

  const [files, setFiles] = useState(sampleFiles)

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0]
    if (uploadedFile) {
      const newFile = {
        id: Date.now(),
        name: uploadedFile.name,
        category: selectedCategory === 'all' ? 'getting-started' : selectedCategory,
        size: `${(uploadedFile.size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        downloads: 0,
        type: uploadedFile.name.split('.').pop().toLowerCase()
      }
      setFiles(prev => [newFile, ...prev])
      setUploadedFiles(prev => [...prev, newFile])
    }
  }

  const handleDownload = (file) => {
    // Simulate file download
    const link = document.createElement('a')
    link.href = '#'
    link.download = file.name
    link.click()
    
    // Update download count
    setFiles(prev => prev.map(f => 
      f.id === file.id ? { ...f, downloads: f.downloads + 1 } : f
    ))
  }

  const filteredFiles = files.filter(file => {
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      teal: 'bg-teal-100 text-teal-600 border-teal-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <img src={ammstroLogo} alt="AMMSTRO Logo" className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">AMMSTRO</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-sm font-medium transition-colors hover:text-orange-500 text-slate-600">
                Home
              </a>
              <a href="/#product" className="text-sm font-medium transition-colors hover:text-orange-500 text-slate-600">
                Product
              </a>
              <a href="/#how-it-works" className="text-sm font-medium transition-colors hover:text-orange-500 text-slate-600">
                How it Works
              </a>
              <a href="/#features" className="text-sm font-medium transition-colors hover:text-orange-500 text-slate-600">
                Features
              </a>
              <a href="/#company" className="text-sm font-medium transition-colors hover:text-orange-500 text-slate-600">
                Company
              </a>
              <a href="/#faq" className="text-sm font-medium transition-colors hover:text-orange-500 text-slate-600">
                FAQ
              </a>
              <a href="/documentation" className="text-sm font-medium transition-colors hover:text-orange-500 text-slate-600">
                Documentation
              </a>
              <a href="/repository" className="text-sm font-medium transition-colors hover:text-orange-500 text-orange-500">
                Repository
              </a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-slate-100 rounded-lg">
                    <User className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">{user?.name || user?.email}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={logout}
                    className="text-slate-600 hover:text-red-600 hover:border-red-300"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/login'}
                  >
                    Sign In
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    Get Started
                  </Button>
                </>
              )}
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <div className="flex flex-col space-y-4">
                <a href="/" className="text-sm font-medium text-slate-600">Home</a>
                <a href="/#product" className="text-sm font-medium text-slate-600">Product</a>
                <a href="/#how-it-works" className="text-sm font-medium text-slate-600">How it Works</a>
                <a href="/#features" className="text-sm font-medium text-slate-600">Features</a>
                <a href="/#company" className="text-sm font-medium text-slate-600">Company</a>
                <a href="/#faq" className="text-sm font-medium text-slate-600">FAQ</a>
                <a href="/documentation" className="text-sm font-medium text-slate-600">Documentation</a>
                <a href="/repository" className="text-sm font-medium text-orange-500">Repository</a>
                <div className="flex flex-col space-y-2 pt-4">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center space-x-2 px-3 py-2 bg-slate-100 rounded-lg">
                        <User className="w-4 h-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">{user?.name || user?.email}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={logout}
                        className="text-slate-600 hover:text-red-600 hover:border-red-300"
                      >
                        <LogOut className="w-4 h-4 mr-1" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.href = '/login'}
                      >
                        Sign In
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500">Get Started</Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Documentation
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"> Repository</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Access, download, and upload documentation files. Comprehensive resource library for AMMSTRO users, developers, and administrators.
            </p>
            
            {/* Upload Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8 py-6 text-lg"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Document
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md"
                  />
                  <div className="text-sm text-slate-500">
                    Supported formats: PDF, DOC, DOCX, PPT, PPTX, TXT, MD
                  </div>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => window.location.href = '/login'}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8 py-6 text-lg"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Sign In to Upload
                  </Button>
                  <div className="text-sm text-slate-500">
                    Please sign in to upload documents
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-slate-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-4">Documentation Categories</h2>
            <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">
              Browse our comprehensive documentation library organized by category
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => {
                const IconComponent = category.icon
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                        selectedCategory === category.id ? 'border-orange-500 shadow-lg' : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(category.color)}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <Badge variant="secondary">{category.count} files</Badge>
                        </div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Files Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                {selectedCategory === 'all' ? 'All Documents' : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <div className="text-slate-600">
                {filteredFiles.length} document{filteredFiles.length !== 1 ? 's' : ''} found
              </div>
            </div>

            <div className="grid gap-4">
              {filteredFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            <File className="w-6 h-6 text-slate-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{file.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                              <span>{file.size}</span>
                              <span>•</span>
                              <span>{file.downloads} downloads</span>
                              <span>•</span>
                              <span>Uploaded {file.uploadDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(file)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredFiles.length === 0 && (
              <div className="text-center py-12">
                <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No documents found</h3>
                <p className="text-slate-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src={ammstroLogo} alt="AMMSTRO Logo" className="w-8 h-8" />
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">AMMSTRO</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Advancing Aviation</span>
                </div>
              </div>
              <p className="text-slate-400 mb-4">
                AI-powered aviation maintenance solutions for the modern fleet.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Documentation</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white">Getting Started</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">API Reference</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">User Guides</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Technical Specs</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Community Forum</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Contact Support</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Training</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-slate-400 hover:text-white">Home</a></li>
                <li><a href="/#company" className="text-slate-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 pt-8 text-center">
            <p className="text-slate-400">
              © 2025 AMMSTRO. All rights reserved. Advancing Aviation Maintenance Technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Repository