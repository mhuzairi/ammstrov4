import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { 
  FileText,
  Download,
  BookOpen,
  Settings,
  Shield,
  Users,
  MessageSquare,
  Menu,
  X,
  LayoutGrid,
  Eye
} from 'lucide-react'
import ammstroLogo from '/assets/ammstro-logo.png'

function Documentation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [camoMatrixOpen, setCamoMatrixOpen] = useState(false)

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
              <a href="/documentation" className="text-sm font-medium transition-colors text-orange-500">
                Documentation
              </a>
            </nav>

            <Button 
              className="hidden md:flex bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
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
              <a href="/" className="text-sm font-medium transition-colors hover:text-orange-500 text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                Home
              </a>
              <a href="/#product" className="text-sm font-medium transition-colors hover:text-orange-500 text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                Product
              </a>
              <a href="/#how-it-works" className="text-sm font-medium transition-colors hover:text-orange-500 text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                How it Works
              </a>
              <a href="/#features" className="text-sm font-medium transition-colors hover:text-orange-500 text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                Features
              </a>
              <a href="/#company" className="text-sm font-medium transition-colors hover:text-orange-500 text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                Company
              </a>
              <a href="/#faq" className="text-sm font-medium transition-colors hover:text-orange-500 text-slate-600" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </a>
              <a href="/documentation" className="text-sm font-medium transition-colors text-orange-500" onClick={() => setMobileMenuOpen(false)}>
                Documentation
              </a>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 w-full mt-2"
              >
                Get Started
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Documentation Hero Section */}
      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-emerald-500/20 text-emerald-600 border-emerald-500/30">Documentation</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Technical
              <br />
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Documentation
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Access comprehensive guides, API documentation, and technical resources to help you implement and optimize AMMSTRO for your aviation maintenance operations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Documentation Categories */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: BookOpen,
                title: "User Guides",
                description: "Step-by-step guides for getting started",
                count: "12 guides",
                categoryId: "user-guides"
              },
              {
                icon: Settings,
                title: "API Reference",
                description: "Complete API documentation and examples",
                count: "45 endpoints",
                categoryId: "api-reference"
              },
              {
                icon: FileText,
                title: "Technical Specs",
                description: "Detailed technical specifications",
                count: "8 documents",
                categoryId: "technical-specs"
              },
              {
                icon: Shield,
                title: "Security & Compliance",
                description: "Security protocols and compliance guides",
                count: "6 documents",
                categoryId: "help-center"
              }
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className="bg-white shadow-lg border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => window.location.href = '/repository'}
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                      <category.icon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <CardTitle className="text-slate-800 mb-2">{category.title}</CardTitle>
                    <CardDescription className="text-slate-600">
                      {category.description}
                    </CardDescription>
                    <Badge variant="outline" className="mt-2 text-emerald-600 border-emerald-300">
                      {category.count}
                    </Badge>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Featured Documents */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Featured Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "CAMO Module Matrix",
                  description: "Comprehensive overview of 12 core CAMO modules with AI-powered features",
                  type: "Interactive",
                  size: "View Online",
                  updated: "1 day ago",
                  popular: true,
                  isMatrix: true
                },
                {
                  title: "Getting Started Guide",
                  description: "Complete setup and configuration guide for new users",
                  type: "PDF",
                  size: "2.4 MB",
                  updated: "2 days ago",
                  popular: true
                },
                {
                  title: "API Integration Manual",
                  description: "Comprehensive guide for integrating AMMSTRO APIs",
                  type: "PDF",
                  size: "3.1 MB",
                  updated: "1 week ago",
                  popular: true
                },
                {
                  title: "Maintenance Workflow Templates",
                  description: "Pre-built templates for common maintenance workflows",
                  type: "ZIP",
                  size: "1.8 MB",
                  updated: "3 days ago",
                  popular: false
                },
                {
                  title: "Security Implementation Guide",
                  description: "Best practices for secure deployment and configuration",
                  type: "PDF",
                  size: "1.9 MB",
                  updated: "1 week ago",
                  popular: false
                },
                {
                  title: "Troubleshooting Manual",
                  description: "Common issues and their solutions",
                  type: "PDF",
                  size: "2.7 MB",
                  updated: "4 days ago",
                  popular: true
                },
                {
                  title: "Advanced Configuration",
                  description: "Advanced setup options for enterprise deployments",
                  type: "PDF",
                  size: "3.5 MB",
                  updated: "1 week ago",
                  popular: false
                }
              ].map((doc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  {doc.isMatrix ? (
                    <Dialog open={camoMatrixOpen} onOpenChange={setCamoMatrixOpen}>
                      <DialogTrigger asChild>
                        <Card className="bg-white shadow-lg border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <LayoutGrid className="w-5 h-5 text-emerald-600" />
                                <Badge variant="outline" className="text-xs">
                                  {doc.type}
                                </Badge>
                                {doc.popular && (
                                  <Badge className="bg-orange-100 text-orange-600 border-orange-300 text-xs">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <Button size="sm" variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                            <CardTitle className="text-slate-800 text-lg mb-2">{doc.title}</CardTitle>
                            <CardDescription className="text-slate-600 mb-4">
                              {doc.description}
                            </CardDescription>
                            <div className="flex items-center justify-between text-sm text-slate-500">
                              <span>{doc.size}</span>
                              <span>Updated {doc.updated}</span>
                            </div>
                          </CardHeader>
                        </Card>
                      </DialogTrigger>
                    </Dialog>
                  ) : (
                    <Card 
                      className="bg-white shadow-lg border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                      onClick={() => window.location.href = '/repository'}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-emerald-600" />
                            <Badge variant="outline" className="text-xs">
                              {doc.type}
                            </Badge>
                            {doc.popular && (
                              <Badge className="bg-orange-100 text-orange-600 border-orange-300 text-xs">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <Button size="sm" variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                        <CardTitle className="text-slate-800 text-lg mb-2">{doc.title}</CardTitle>
                        <CardDescription className="text-slate-600 mb-4">
                          {doc.description}
                        </CardDescription>
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <span>{doc.size}</span>
                          <span>Updated {doc.updated}</span>
                        </div>
                      </CardHeader>
                    </Card>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CAMO Matrix Modal Content */}
          <Dialog open={camoMatrixOpen} onOpenChange={setCamoMatrixOpen}>
            <DialogContent className="w-[95vw] max-w-[95vw] max-h-[90vh] overflow-y-auto bg-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-800 mb-2">CAMO Module Matrix</DialogTitle>
                <DialogDescription className="text-slate-600">
                  Comprehensive Aviation Maintenance Management - 12 Core CAMO Modules
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-6">
                {/* Overview Section */}
                <div className="bg-slate-50 rounded-lg p-6 border border-slate-100 mb-8">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Overview</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    This matrix outlines the 12 core CAMO (Continuing Airworthiness Management Organization) modules 
                    integrated within the AMMS (Aviation Maintenance Management System) platform. Each module is designed 
                    to streamline aviation maintenance operations with AI-powered automation and intelligent workflows.
                  </p>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">12</div>
                      <div className="text-sm text-slate-500">Core Modules</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">AI</div>
                      <div className="text-sm text-slate-500">Powered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">100%</div>
                      <div className="text-sm text-slate-500">Compliance</div>
                    </div>
                  </div>
                </div>

                {/* Modules Table */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-slate-800 mb-6">CAMO Modules Specification</h3>
                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <div>
                      <table className="w-full table-fixed">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="w-16 px-3 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">Module</th>
                            <th className="w-1/4 px-3 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">Name</th>
                            <th className="w-5/12 px-3 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">Synopsis / Function</th>
                            <th className="w-1/3 px-3 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">AMMS Features</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                          {[
                            {
                              number: "01",
                              name: "Maintenance Program (AMP) Management",
                              synopsis: "Manages and updates the approved AMP, ensuring scheduling based on flight hours, cycles, and calendar. Supports MRB/MPD integration and revision control.",
                              features: "AMMS facilitates AMP revision based on updates from MPD by efficiently directing the user or TSE to the relevant affected tasks."
                            },
                            {
                              number: "02",
                              name: "AD/SB Management",
                              synopsis: "Tracks applicability and compliance of Airworthiness Directives and Service Bulletins. Manages records, tasks interval, its revision and new AD to ensures full regulatory compliance.",
                              features: "AMMS additional feature 'Publication Evaluation' to provide proper compliance and applicability evaluation from all mandatory publication (including CAAM-CAD) for better tracking and return records."
                            },
                            {
                              number: "03",
                              name: "Component Management & Tracking",
                              synopsis: "Monitor Hard Time and life-limited part interval. Tracks component removal & installation, records & certificate safekeep, On/Off movement history, and part utilization tracking.",
                              features: "AMMS provide Part No creation to establish new part record, full back-to-birth traceability, part requirement and assignment control, Part & NHA hierarchy tree. AMMS automatically part scheduling."
                            },
                            {
                              number: "04",
                              name: "Maintenance Planning",
                              synopsis: "Generates short- and long-term maintenance forecasts based on AMP, AD/SB, EO, SI, and component status, based to asset utilization.",
                              features: "AMMS uses machine learning to automate task scheduling, send alerts, and efficiently plan tasks for multiple check packages in optimal scenarios."
                            },
                            {
                              number: "05",
                              name: "Work Package Generation & Management",
                              synopsis: "Plan and compiles incoming due tasks into executable work packages. Includes task cards index, manhours, materials, and tools listing.",
                              features: "AMMS leverages machine learning to automate task planning and management, creating multiple work packages to optimize asset utilization, and minimize additional ground time."
                            },
                            {
                              number: "06",
                              name: "Technical Publication",
                              synopsis: "Centralized storage, access and control of OEM manuals, technical documentation and mandatory publications.",
                              features: "AMMS provide easy access for all the Authority Publications and manufacturer Manuals. Ensures easy update to the latest revisions."
                            },
                            {
                              number: "07",
                              name: "Engineering Order (EO) Management",
                              synopsis: "Creates EOs for modifications, inspection and repair from approved and justified sources. To safe-keep, record and track all EOs.",
                              features: "AMMS offers a streamlined and user-friendly interface for EOs generation, automated planning and call-up processes for repetitive EOs."
                            },
                            {
                              number: "08",
                              name: "Structural Damage & Repetitive Inspection Management",
                              synopsis: "Logs and monitors damages (e.g., dents, corrosion) and their repairs. Tracks repetitive inspections and compliance with SRM and OEM guidelines.",
                              features: "AMMS manages the integration of new structure repairs into the system database and automatically initiates EO generation for repeat inspections. AMMS also connects the relevant key user for approval."
                            },
                            {
                              number: "09",
                              name: "Aircraft Utilization & AJL/DDL Update",
                              synopsis: "Captures and updates Flight Hours, Cycles, and block times from Aircraft Journey Logs and Deferred Defect Logs. Feeds planning and component control.",
                              features: "AMMS easy interface to capture all AJL utilization data and its action logs. Captures Deferred Defect Logs data, time limit and due time."
                            },
                            {
                              number: "10",
                              name: "Reliability Performance Dashboard & Reporting",
                              synopsis: "Collects reliability data (e.g., withdrawals, delays completion, unscheduled removals, trends etc), and generates reports for compliance, analysis, and improvement.",
                              features: "AMMS provide BI Analytic performance report in interactive Dashboard for aircraft and whole assets, showing full data access, easy review for fast decision making."
                            },
                            {
                              number: "11",
                              name: "Defect & MEL/CDL Management",
                              synopsis: "Tracks open defects, deferred items under MEL/CDL, repetitive issue and rectification history data. Ensures timely action, proper operational control and avoids non-compliance or repetitive delays.",
                              features: "AMMS capable to suggest previous rectification data for repetitive defects for fast recovery. AMMS capable to manage deferable defects time limit, spares needs and auto-alert the MEL due time."
                            },
                            {
                              number: "12",
                              name: "Fleet Technical Status Dashboard",
                              synopsis: "Real-time dashboard view of airworthiness status across the fleet, including due maintenance, open defects, and compliance summaries.",
                              features: "AMMS Interactive Dashboard for easy overview for managers, ARC inspector, CAM post holder and Authority Auditors."
                            }
                          ].map((module, index) => (
                            <tr key={index} className="hover:bg-slate-50">
                              <td className="px-3 py-4 text-center">
                                <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mx-auto">
                                  {module.number}
                                </div>
                              </td>
                              <td className="px-3 py-4 font-medium text-slate-800 text-sm break-words">{module.name}</td>
                              <td className="px-3 py-4 text-slate-600 text-sm leading-relaxed break-words">{module.synopsis}</td>
                              <td className="px-3 py-4 text-slate-600 text-sm leading-relaxed break-words">{module.features}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Key Features */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-6">Key AMMS Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-orange-600 font-semibold">AI</span>
                      </div>
                      <h4 className="font-semibold text-slate-800 mb-2">Machine Learning Integration</h4>
                      <p className="text-slate-600 text-sm">Advanced AI algorithms for predictive maintenance and automated task scheduling.</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-orange-600 font-semibold">BI</span>
                      </div>
                      <h4 className="font-semibold text-slate-800 mb-2">Business Intelligence</h4>
                      <p className="text-slate-600 text-sm">Interactive dashboards and analytics for data-driven decision making.</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-orange-600 font-semibold">API</span>
                      </div>
                      <h4 className="font-semibold text-slate-800 mb-2">System Integration</h4>
                      <p className="text-slate-600 text-sm">Seamless integration with existing aviation management systems and databases.</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <p className="text-center text-slate-500 text-sm">
                    © 2025 AMMSTRO. All rights reserved. Advancing Aviation Maintenance Technology.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200"
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Quick Access</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Knowledge Base</h4>
                <p className="text-slate-600 text-sm mb-3">Search our comprehensive knowledge base</p>
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                  Browse Articles
                </Button>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Community Forum</h4>
                <p className="text-slate-600 text-sm mb-3">Connect with other AMMSTRO users</p>
                <Button variant="outline" size="sm" className="text-purple-600 border-purple-300 hover:bg-purple-50">
                  Join Discussion
                </Button>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Support Center</h4>
                <p className="text-slate-600 text-sm mb-3">Get help from our support team</p>
                <Button variant="outline" size="sm" className="text-green-600 border-green-300 hover:bg-green-50">
                  Contact Support
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-700">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Need help getting started?
            </h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
              Our technical team is here to help you implement AMMSTRO successfully.
              Get personalized support and training for your team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg">
                Contact Support
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-emerald-700/30 px-8 py-6 text-lg">
                Schedule Training
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
                <li><a href="mailto:business@ammstro.com?subject=Contact Inquiry" className="text-slate-400 hover:text-white">Contact</a></li>
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

export default Documentation