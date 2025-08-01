import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Plane, 
  BarChart3, 
  Smartphone, 
  Shield, 
  Zap, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play,
  MessageSquare,
  Link,
  Calendar,
  Target,
  Award,
  Globe,
  Menu,
  X
} from 'lucide-react'
import ammstroLogo from '/assets/ammstro-logo.png'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('hero')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  
  // Array of rotating announcements
  const announcements = [
    "✈️ Latest project bulletin: AI-powered predictive maintenance system deployed",
    "🚁 New helicopter maintenance module launched with 95% accuracy rate",
    "🛩️ Partnership with major airline for fleet-wide implementation announced",
    "📊 Cost reduction of 35% achieved across all client operations this quarter",
    "🔧 Advanced rotor blade inspection technology now available",
    "🌟 AMMSTRO wins Aviation Innovation Award 2024",
    "📈 Real-time analytics dashboard upgraded with new features",
    "🛡️ Enhanced security protocols implemented for military aircraft maintenance"
  ]
  
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'user',
      message: "What's the status of the Boeing 737-800 scheduled maintenance?"
    },
    {
      type: 'ai',
      message: "The Boeing 737-800 (Reg: N12345) is currently at 82% completion of its scheduled C-check. All critical systems have been inspected and approved. Estimated completion time is 14:30 today."
    }
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  // Completely removed all scroll-based effects to eliminate blur

  // Predefined AI responses for aviation maintenance queries
  const aiResponses = {
    'maintenance schedule': "Current maintenance schedule shows 15 aircraft due for inspection this week. Priority items include 3 A-checks and 2 B-checks. All scheduled within operational windows.",
    'fleet status': "Fleet status: 86% availability. 12 aircraft operational, 2 in scheduled maintenance, 1 in unscheduled repair. Average turnaround time: 4.2 hours.",
    'cost analysis': "Maintenance costs reduced by 35% this quarter through predictive analytics. Saved $2.3M in unscheduled repairs and optimized parts inventory by 28%.",
    'boeing 737': "Boeing 737-800 (N12345): C-check 82% complete. Engine inspection passed, avionics updated, landing gear serviced. ETA completion: 14:30 today.",
    'airbus a320': "Airbus A320 (N67890): Recently completed 100-hour inspection. All systems operational. Next scheduled maintenance in 450 flight hours.",
    'helicopter': "Helicopter fleet: 4 units operational, 1 in scheduled rotor blade inspection. Average availability: 92%. Next major overhaul scheduled for H-3 in 6 weeks.",
    'weather impact': "Current weather conditions favorable for maintenance operations. No delays expected. Hangar temperature optimal at 22°C, humidity 45%.",
    'parts inventory': "Parts inventory status: 94% stock availability. Critical items in stock. 3 back-ordered items expected delivery within 48 hours.",
    'technician schedule': "Maintenance team: 18 technicians on duty, 4 on standby. Shift coverage optimal. Specialized avionics team available for complex repairs.",
    'safety report': "Safety metrics: Zero incidents this month. All safety protocols followed. Recent safety training completion rate: 100%. Next audit scheduled for next week."
  }

  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase()
    
    for (const [key, response] of Object.entries(aiResponses)) {
      if (message.includes(key)) {
        return response
      }
    }
    
    // Default response if no match found
    return "I can help you with maintenance schedules, fleet status, cost analysis, aircraft-specific queries, parts inventory, technician schedules, and safety reports. Please ask me about any of these topics."
  }

  const typeMessage = (message, callback) => {
    setIsTyping(true)
    let currentText = ''
    let index = 0
    
    const typeInterval = setInterval(() => {
      if (index < message.length) {
        currentText += message[index]
        callback(currentText)
        index++
      } else {
        clearInterval(typeInterval)
        setIsTyping(false)
      }
    }, 30) // Typing speed: 30ms per character
  }

  const handleSendMessage = () => {
    if (!currentInput.trim()) return
    
    const userMessage = currentInput.trim()
    setCurrentInput('')
    
    // Add user message
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage }])
    
    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(userMessage)
      
      // Add empty AI message that will be typed
      setChatMessages(prev => [...prev, { type: 'ai', message: '', isTyping: true }])
      
      // Type the AI response
      typeMessage(aiResponse, (currentText) => {
        setChatMessages(prev => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          if (lastMessage.type === 'ai') {
            lastMessage.message = currentText
          }
          return newMessages
        })
      })
    }, 500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'product', 'how-it-works', 'features', 'pricing', 'faq']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Rotate announcements every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prevIndex) => 
        (prevIndex + 1) % announcements.length
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [announcements.length])

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
              {['Hero', 'Product', 'How it Works', 'Features', 'Company', 'FAQ'].map((item, index) => {
                const sectionId = item.toLowerCase().replace(/\s+/g, '-')
                return (
                  <a
                    key={index}
                    href={`#${sectionId}`}
                    className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                      activeSection === sectionId ? 'text-orange-500' : 'text-slate-600'
                    }`}
                  >
                    {item}
                  </a>
                )
              })}
            </nav>

            <div className="flex items-center space-x-4">
              <Button className="hidden md:flex bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                Get Started
              </Button>
              
              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-slate-700 hover:text-orange-500"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <nav className="flex flex-col space-y-4">
                {['Hero', 'Product', 'How it Works', 'Features', 'Company', 'FAQ'].map((item, index) => {
                  const sectionId = item.toLowerCase().replace(/\s+/g, '-')
                  return (
                    <a
                      key={index}
                      href={`#${sectionId}`}
                      className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                        activeSection === sectionId ? 'text-orange-500' : 'text-slate-600'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                    </a>
                  )
                })}
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 w-full mt-2">
                  Get Started
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Interactive Aviation Elements */}
              <div className="relative mb-8">
                <motion.div
                  className="absolute -top-10 -left-10 w-40 h-40 opacity-10"
                  animate={{ 
                    rotate: [0, 360],
                    opacity: [0.1, 0.15, 0.1]
                  }}
                  transition={{ 
                    duration: 30, 
                    repeat: Infinity,
                    ease: "linear" 
                  }}
                >
                  <div className="w-full h-full rounded-full border-4 border-dashed border-sky-500"></div>
                </motion.div>
                
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20 opacity-10"
                  animate={{ 
                    rotate: [0, -360],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity,
                    ease: "linear" 
                  }}
                >
                  <div className="w-full h-full rounded-full border-4 border-dashed border-orange-500"></div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  key={currentAnnouncementIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <Badge className="bg-sky-100 text-sky-700 border-sky-300 px-4 py-2 cursor-pointer shadow-sm">
                    {announcements[currentAnnouncementIndex]}
                  </Badge>
                </motion.div>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-6 mb-6 text-slate-800">
                  AI-Powered <span className="bg-gradient-to-r from-sky-600 to-orange-500 bg-clip-text text-transparent">Aviation</span> Maintenance
                </h1>
                <p className="text-xl text-slate-600 mb-8">
                  Revolutionize your aircraft maintenance operations with our AI-powered platform. 
                  Reduce downtime, increase efficiency, and enhance safety.
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button className="bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white px-8 py-6 text-lg">
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 px-8 py-6 text-lg"
                  onClick={() => setIsVideoModalOpen(true)}
                >
                  <Play className="w-5 h-5 mr-2" /> Watch Demo
                </Button>
              </motion.div>

              {/* Customer Logos */}
              <motion.div
                className="text-center px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <p className="text-slate-400 mb-6">Trusted by aviation companies worldwide</p>
                <div className="grid grid-cols-2 md:flex md:justify-center md:items-center gap-4 md:gap-8 opacity-60">
                  {/* Airline references removed */}
                </div>
              </motion.div>

              {/* Aviation Image Showcase */}
              <motion.div
                className="mt-12 relative px-4"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
              >
                <h3 className="text-xl font-semibold text-slate-700 mb-4 text-center">Powering Commercial Aviation Maintenance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    className="relative overflow-hidden rounded-xl shadow-lg"
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 10px 30px rgba(14, 165, 233, 0.3)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img 
                      src="/assets/hangar-maintenance.jpg" 
                      alt="Commercial Aircraft Maintenance" 
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end">
                      <div className="p-4 text-white">
                        <h4 className="font-bold">Advanced Maintenance Solutions</h4>
                        <p className="text-sm text-slate-200">Streamlining aircraft maintenance operations</p>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="relative overflow-hidden rounded-xl shadow-lg"
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 10px 30px rgba(14, 165, 233, 0.3)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img 
                      src="/assets/boeing-737-maintenance.jpg" 
                      alt="Boeing 737 Maintenance" 
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end">
                      <div className="p-4 text-white">
                        <h4 className="font-bold">Boeing 737 Maintenance Excellence</h4>
                        <p className="text-sm text-slate-200">Professional aircraft maintenance services</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Dashboard Preview */}
            <motion.div
              className="mt-8"
            >
              <div className="bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
                <div className="bg-slate-900 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-slate-400 text-sm">AMMSTRO Dashboard</div>
                  <div className="text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white text-lg font-bold">Fleet Overview</h3>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Data</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <motion.div 
                      className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-4"
                      whileHover={{ scale: 1.03 }}
                    >
                      <div className="text-sky-400 mb-2 text-sm font-medium">Fleet Availability</div>
                      <div className="text-2xl font-bold text-white">86%</div>
                      <div className="text-sky-400/70 text-xs mt-1">↑ 2.1% from last month</div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4"
                      whileHover={{ scale: 1.03 }}
                    >
                      <div className="text-emerald-400 mb-2 text-sm font-medium">Cost Reduction</div>
                      <div className="text-2xl font-bold text-white">35%</div>
                      <div className="text-emerald-400/70 text-xs mt-1">↑ 5% from last quarter</div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4"
                      whileHover={{ scale: 1.03 }}
                    >
                      <div className="text-orange-400 mb-2 text-sm font-medium">Active Projects</div>
                      <div className="text-2xl font-bold text-white">72</div>
                      <div className="text-orange-400/70 text-xs mt-1">↑ 12 new this month</div>
                    </motion.div>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-medium">Maintenance AI Assistant</h4>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Active</Badge>
                    </div>
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                      {chatMessages.map((msg, index) => (
                        <div key={index} className="flex items-start">
                          <div className={`rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-3 ${
                            msg.type === 'user' ? 'bg-slate-700' : 'bg-sky-500/20'
                          }`}>
                            {msg.type === 'user' ? (
                              <Plane className="w-4 h-4 text-sky-400" />
                            ) : (
                              <MessageSquare className="w-4 h-4 text-sky-400" />
                            )}
                          </div>
                          <div className={`rounded-lg p-3 text-slate-300 text-sm max-w-xs ${
                            msg.type === 'user' 
                              ? 'bg-slate-700/50' 
                              : 'bg-sky-500/10'
                          }`}>
                            {msg.message}
                            {msg.type === 'ai' && isTyping && index === chatMessages.length - 1 && (
                              <span className="inline-block w-2 h-4 bg-sky-400 ml-1 animate-pulse"></span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="text" 
                        placeholder="Ask about maintenance status..." 
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isTyping}
                        className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 flex-1 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-50"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={isTyping || !currentInput.trim()}
                        className="ml-2 bg-sky-500 hover:bg-sky-600 h-9 w-9 p-0 disabled:opacity-50"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="product" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-orange-500/20 text-orange-500 border-orange-500/30">Product</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Meet our AI-Powered
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Maintenance Assistant
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our intelligent system helps you predict maintenance needs, optimize schedules,
              and reduce aircraft downtime with advanced AI technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200 h-full hover:shadow-xl transition-shadow duration-300"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">Predictive Maintenance</h3>
                  <p className="text-slate-600 mb-6">
                    Our AI analyzes historical data and real-time inputs to predict when components will need maintenance before they fail.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-slate-600">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Reduce unscheduled maintenance by 35%</span>
                    </li>
                    <li className="flex items-center text-slate-600">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Extend component lifespan</span>
                    </li>
                    <li className="flex items-center text-slate-600">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Optimize maintenance schedules</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200 h-full hover:shadow-xl transition-shadow duration-300"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-sky-500/10 rounded-lg flex items-center justify-center mb-6">
                    <MessageSquare className="w-6 h-6 text-sky-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">Smart Documentation</h3>
                  <p className="text-slate-600 mb-6">
                    Automatically generate and organize maintenance documentation, making compliance easier than ever.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-slate-600">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Automated report generation</span>
                    </li>
                    <li className="flex items-center text-slate-600">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Regulatory compliance tracking</span>
                    </li>
                    <li className="flex items-center text-slate-600">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Digital record management</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200 h-full hover:shadow-xl transition-shadow duration-300"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6">
                    <Clock className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">Time Management</h3>
                  <p className="text-slate-600 mb-6">
                    Optimize maintenance schedules to minimize aircraft downtime and maximize operational efficiency.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-slate-600">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Reduce aircraft downtime by 28%</span>
                    </li>
                    <li className="flex items-center text-slate-600">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Intelligent task scheduling</span>
                    </li>
                    <li className="flex items-center text-slate-600">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Resource allocation optimization</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Commercial Aircraft & Private Jet Solutions */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Commercial Aircraft & Private Jet Maintenance Solutions
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                className="bg-white rounded-xl overflow-hidden shadow-xl border border-slate-200 hover:border-blue-500/30 transition-all duration-300"
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative h-64">
                  <img 
                    src="/assets/commercial-aircraft-1.jpg" 
                    alt="Commercial Aircraft Maintenance" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <Badge className="bg-blue-500/30 text-blue-300 border-blue-500/40 mb-2">Commercial Aviation</Badge>
                    <h4 className="text-xl font-bold text-white">Large Commercial Aircraft</h4>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      </div>
                      <p className="text-slate-700">Comprehensive maintenance tracking for Boeing and Airbus fleets</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      </div>
                      <p className="text-slate-700">Automated compliance monitoring for aviation regulations</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      </div>
                      <p className="text-slate-700">Real-time engine performance monitoring and analytics</p>
                    </li>
                  </ul>
                </div>
              </motion.div>
              
              <motion.div
                className="bg-white rounded-xl overflow-hidden shadow-xl border border-slate-200 hover:border-purple-500/30 transition-all duration-300"
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 20px 40px rgba(147, 51, 234, 0.2)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative h-64">
                  <img 
                    src="/assets/commercial-aircraft-2.jpg" 
                    alt="Private Jet Maintenance" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <Badge className="bg-purple-500/30 text-purple-300 border-purple-500/40 mb-2">Private Aviation</Badge>
                    <h4 className="text-xl font-bold text-white">Private Jet & Business Aircraft</h4>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-purple-500" />
                      </div>
                      <p className="text-slate-700">Personalized maintenance schedules for luxury aircraft</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-purple-500" />
                      </div>
                      <p className="text-slate-700">Premium support with 24/7 concierge maintenance services</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-purple-500" />
                      </div>
                      <p className="text-slate-700">Advanced cabin systems and avionics maintenance tracking</p>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Specialized Helicopter Maintenance Solutions */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-orange-500 bg-clip-text text-transparent">
              Specialized Helicopter Maintenance Solutions
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                className="bg-white rounded-xl overflow-hidden shadow-xl border border-slate-200 hover:border-green-500/30 transition-all duration-300"
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 20px 40px rgba(34, 197, 94, 0.2)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative h-64">
                  <img 
                    src="/assets/helicopter-1.jpg" 
                    alt="Helicopter Maintenance" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <Badge className="bg-green-500/30 text-green-300 border-green-500/40 mb-2">Rotorcraft</Badge>
                    <h4 className="text-xl font-bold text-white">Comprehensive Helicopter Maintenance</h4>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-slate-700">Specialized rotor system maintenance and inspection protocols</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-slate-700">Vibration analysis and dynamic component tracking</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-slate-700">Customized maintenance schedules for various helicopter models</p>
                    </li>
                  </ul>
                </div>
              </motion.div>
              
              <motion.div
                className="bg-white rounded-xl overflow-hidden shadow-xl border border-slate-200 hover:border-green-500/30 transition-all duration-300"
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 20px 40px rgba(34, 197, 94, 0.2)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative h-64">
                  <img 
                    src="/assets/helicopter-2.jpg" 
                    alt="Helicopter Systems" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <Badge className="bg-green-500/30 text-green-300 border-green-500/40 mb-2">Advanced Systems</Badge>
                    <h4 className="text-xl font-bold text-white">Helicopter Avionics & Systems</h4>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-slate-700">Integrated avionics diagnostics and troubleshooting</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-slate-700">Specialized tools for helicopter-specific maintenance tasks</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-slate-700">AI-powered predictive maintenance for critical components</p>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Military Aviation Showcase */}
          <motion.div
            className="mt-16 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              Military Aviation Excellence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                className="relative overflow-hidden rounded-xl shadow-lg"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  z: 10,
                  boxShadow: "0 20px 40px rgba(251, 146, 60, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <img 
                  src="/assets/military-maintenance.jpg" 
                  alt="Military Aircraft Maintenance" 
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent flex flex-col justify-end">
                  <div className="p-6">
                    <Badge className="mb-3 bg-orange-500/30 text-orange-300 border-orange-500/40">Military Grade</Badge>
                    <h4 className="text-2xl font-bold text-white mb-2">Tactical Aircraft Maintenance</h4>
                    <p className="text-slate-200 mb-4">Advanced solutions for military aviation maintenance with enhanced security protocols and mission-critical reliability.</p>
                    <motion.div
                      whileHover={{ scale: 1.05, x: 5 }}
                      className="flex items-center text-orange-300 text-sm font-medium"
                    >
                      <span>Explore Military Solutions</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="relative overflow-hidden rounded-xl shadow-lg"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: -5,
                  z: 10,
                  boxShadow: "0 20px 40px rgba(251, 146, 60, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <img 
                  src="/assets/military-aircraft.jpg" 
                  alt="Military Aircraft Systems" 
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent flex flex-col justify-end">
                  <div className="p-6">
                    <Badge className="mb-3 bg-orange-500/30 text-orange-300 border-orange-500/40">Defense Systems</Badge>
                    <h4 className="text-2xl font-bold text-white mb-2">Remote Aircraft Systems</h4>
                    <p className="text-slate-200 mb-4">Specialized maintenance solutions for remotely piloted aircraft with integrated AI diagnostics and predictive analytics.</p>
                    <motion.div
                      whileHover={{ scale: 1.05, x: 5 }}
                      className="flex items-center text-orange-300 text-sm font-medium"
                    >
                      <span>Discover Defense Solutions</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* First helicopter section removed - keeping specialized section */}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">How It Works</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Simplifying Aviation
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-sky-500 bg-clip-text text-transparent">
                Maintenance Workflows
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our platform integrates seamlessly with your existing systems to provide
              a comprehensive solution for all your maintenance needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="space-y-12">
                {[
                  {
                    number: "01",
                    title: "Data Collection",
                    description: "Our system collects data from various sources including aircraft sensors, maintenance logs, and historical records."
                  },
                  {
                    number: "02",
                    title: "AI Analysis",
                    description: "Advanced AI algorithms analyze the data to identify patterns and predict potential maintenance issues before they occur."
                  },
                  {
                    number: "03",
                    title: "Actionable Insights",
                    description: "The platform provides clear, actionable insights and recommendations to optimize your maintenance operations."
                  },
                  {
                    number: "04",
                    title: "Continuous Improvement",
                    description: "The system learns from each maintenance cycle, continuously improving its predictions and recommendations."
                  }
                ].map((step, index) => (
                  <motion.div 
                    key={index}
                    className="flex"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="mr-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 flex items-center justify-center text-white font-bold">
                        {step.number}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
                      <p className="text-slate-300">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-slate-400 text-sm">Maintenance Workflow</div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                          <Plane className="w-4 h-4 text-blue-400" />
                        </div>
                        <h4 className="font-medium text-white">Boeing 737-800</h4>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Maintenance Due</Badge>
                    </div>
                    <div className="pl-11">
                      <p className="text-slate-300 text-sm mb-2">Engine inspection recommended based on vibration analysis and operational hours.</p>
                      <div className="flex items-center text-slate-400 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Recommended within: 120 flight hours</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                          <Plane className="w-4 h-4 text-green-400" />
                        </div>
                        <h4 className="font-medium text-white">Airbus A320</h4>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>
                    </div>
                    <div className="pl-11">
                      <p className="text-slate-300 text-sm mb-2">Landing gear maintenance completed ahead of schedule. All systems operational.</p>
                      <div className="flex items-center text-slate-400 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Next check: 1,200 flight hours</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mr-3">
                          <Plane className="w-4 h-4 text-orange-400" />
                        </div>
                        <h4 className="font-medium text-white">Embraer E190</h4>
                      </div>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">In Progress</Badge>
                    </div>
                    <div className="pl-11">
                      <p className="text-slate-300 text-sm mb-2">Avionics system update in progress. Estimated completion in 4 hours.</p>
                      <div className="flex items-center text-slate-400 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Progress: 68% complete</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Explore features designed to enhance
              <br />
              <span className="bg-gradient-to-r from-green-400 to-orange-500 bg-clip-text text-transparent">
                your aviation maintenance operations
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Powerful tools designed for today's aviation challenges. Learn more about how we can 
              best support your needs — from small operators to major airlines.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Real-time data processing",
                description: "Handle and analyze maintenance data instantly, providing actionable insights without delays."
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Smart automation",
                description: "Automate repetitive maintenance tasks, freeing up time and boosting productivity across your team."
              },
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Natural language understanding",
                description: "Understands and responds to maintenance queries in human language, making interactions intuitive."
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Predictive analytics",
                description: "Anticipate maintenance needs with AI models, helping you make informed decisions before issues arise."
              },
              {
                icon: <Smartphone className="w-6 h-6" />,
                title: "Multi-platform integration",
                description: "Connect with existing aviation tools, ensuring smooth workflows and collaboration across systems."
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Continuous learning",
                description: "Our AI evolves with every maintenance interaction, becoming smarter and more accurate over time."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white shadow-lg border-slate-200 p-6 h-full hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 text-white">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-slate-800">{feature.title}</CardTitle>
                    <CardDescription className="text-slate-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Helicopter section moved above military section */}
        </div>
      </section>

      {/* Company & Leadership Section */}
      <section id="company" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Vision & Mission */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-blue-500/20 text-blue-500 border-blue-500/30">Our Vision</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Drive aviation excellence
              </span>
              <br />
              through intelligent automation
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our mission is to revamp aircraft maintenance with a unified, predictive platform that transforms how the aviation industry approaches maintenance operations.
            </p>
          </motion.div>

          {/* Leadership Team */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">Leadership Team</h3>
              <p className="text-lg text-slate-600">Experienced professionals driving aviation innovation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {[
                { name: "Sam", role: "CEO", initial: "S", color: "bg-blue-500" },
                { name: "Fahmi", role: "CDO", initial: "F", color: "bg-green-500" },
                { name: "Huzairi", role: "COO", initial: "H", color: "bg-purple-500" },
                { name: "Harrith", role: "CTO", initial: "H", color: "bg-orange-500" },
                { name: "Arman", role: "CIO", initial: "A", color: "bg-red-500" }
              ].map((member, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={`w-20 h-20 ${member.color} rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}>
                    {member.initial}
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">{member.name}</h4>
                  <p className="text-slate-600">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Company Achievements */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {[
              {
                metric: "$2.7M",
                label: "Revenue by Year 3",
                icon: TrendingUp,
                color: "text-green-500"
              },
              {
                metric: "68%",
                label: "Gross Margin",
                icon: BarChart3,
                color: "text-blue-500"
              },
              {
                metric: "18",
                label: "Months to Break-Even",
                icon: Clock,
                color: "text-purple-500"
              },
              {
                metric: "92%",
                label: "Customer Retention",
                icon: Award,
                color: "text-orange-500"
              }
            ].map((stat, index) => (
              <Card key={index} className="text-center p-6 bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                <stat.icon className={`w-12 h-12 ${stat.color} mx-auto mb-4`} />
                <div className="text-3xl font-bold text-slate-800 mb-2">{stat.metric}</div>
                <div className="text-slate-600">{stat.label}</div>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-500 border-purple-500/30">FAQ</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked
              <br />
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Find answers to common questions about our aviation maintenance platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "How does the AI predict maintenance needs?",
                answer: "Our AI analyzes historical maintenance data, real-time sensor information, and operational patterns to identify potential issues before they cause problems. The system continuously learns from each maintenance cycle, improving its predictions over time."
              },
              {
                question: "Is the platform compliant with aviation regulations?",
                answer: "Yes, our platform is designed to meet FAA, EASA, and other international aviation regulatory requirements. We regularly update our system to ensure continued compliance with changing regulations."
              },
              {
                question: "Can I integrate with my existing maintenance software?",
                answer: "Absolutely. Our platform is built with open APIs that allow seamless integration with most popular aviation maintenance management systems, ERP solutions, and other operational software."
              },
              {
                question: "How secure is my maintenance data?",
                answer: "We implement industry-leading security measures including end-to-end encryption, regular security audits, and compliance with SOC 2 and ISO 27001 standards to ensure your sensitive maintenance data remains protected."
              },
              {
                question: "Do you offer training for our maintenance team?",
                answer: "Yes, all plans include basic training. Professional and Enterprise plans include comprehensive onboarding and ongoing training sessions. We also offer customized training programs for specific needs."
              },
              {
                question: "How quickly can we implement the system?",
                answer: "Most customers are up and running within 2-4 weeks. Our implementation team works closely with you to ensure a smooth transition, including data migration, integration with existing systems, and staff training."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white shadow-lg border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-800">{faq.question}</CardTitle>
                    <CardDescription className="text-slate-600 text-base">
                      {faq.answer}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sky-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to transform your aviation
              <br />
              maintenance operations?
            </h2>
            <p className="text-xl text-sky-100 max-w-3xl mx-auto mb-8">
              Join hundreds of aviation companies already using our platform to reduce costs,
              improve efficiency, and enhance safety.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-sky-700 hover:bg-sky-50 px-8 py-6 text-lg">
                Start Free Trial
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-sky-700/30 px-8 py-6 text-lg">
                Schedule Demo
              </Button>
            </div>
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
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white">Features</a></li>
                <li><a href="#company" className="text-slate-400 hover:text-white">Company</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Case Studies</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Reviews</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Updates</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Press</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Partners</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Community</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Webinars</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <img src={ammstroLogo} alt="AMMSTRO Logo" className="w-8 h-8" />
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">AMMSTRO</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Advancing Aviation</span>
                </div>
              </div>
              <div className="text-slate-400 text-sm">
                © 2025 AMMSTRO SDN BHD All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <motion.div
            className="relative w-full max-w-4xl mx-4 bg-black rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Video Container */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/U8CswzvK9Zc?si=gKkkG2ior_5PNSdC&autoplay=1"
                title="AMMSTRO Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default App

