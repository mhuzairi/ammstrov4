import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Plane, Wrench, BarChart3, Shield, Clock, CheckCircle, Menu, X } from 'lucide-react';
import ammstroLogo from '/assets/ammstro-logo.png';

const Button = ({ children, className, onClick, variant = "default" }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Blog = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isGetStartedModalOpen, setIsGetStartedModalOpen] = useState(false);

  const handlePricingClick = (e) => {
    e.preventDefault();
    // Navigate to main page pricing section
    window.location.href = '/#pricing';
  };

  return (
    <div className="min-h-screen bg-white text-slate-900" style={{marginTop: '-10px', paddingTop: '10px'}}>
      {/* Navigation - Same as main page */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.href = '/'}>
              <img src={ammstroLogo} alt="AMMSTRO Logo" className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">AMMSTRO</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {['Product', 'How it Works', 'Features', 'Pricing', 'Company', 'FAQ'].map((item, index) => {
                const sectionId = item.toLowerCase().replace(/\s+/g, '-')
                
                if (item === 'Pricing') {
                  return (
                    <button
                      key={index}
                      onClick={handlePricingClick}
                      className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                        activeSection === sectionId ? 'text-orange-500' : 'text-slate-600'
                      }`}
                    >
                      {item}
                    </button>
                  )
                }
                
                return (
                  <a
                    key={index}
                    href={`/#${sectionId}`}
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
              <Button 
                className="hidden md:flex bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                onClick={() => setIsGetStartedModalOpen(true)}
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
                {['Home', 'Product', 'How it Works', 'Features', 'Pricing', 'Company', 'FAQ'].map((item, index) => {
                  const sectionId = item === 'Home' ? 'hero' : item.toLowerCase().replace(/\s+/g, '-')
                  
                  if (item === 'Pricing') {
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setMobileMenuOpen(false)
                          handlePricingClick({ preventDefault: () => {} })
                        }}
                        className={`text-sm font-medium transition-colors hover:text-orange-500 text-left ${
                          activeSection === sectionId ? 'text-orange-500' : 'text-slate-600'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  }
                  
                  return (
                    <a
                      key={index}
                      href={item === 'Home' ? '/' : `/#${sectionId}`}
                      className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                        activeSection === sectionId ? 'text-orange-500' : 'text-slate-600'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                    </a>
                  )
                })}
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 w-full mt-2"
                  onClick={() => setIsGetStartedModalOpen(true)}
                >
                  Get Started
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        {/* Article Header */}
        <header className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 border-b border-gray-200 rounded-2xl mb-8">
          <div className="max-w-4xl mx-auto px-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                Industry Analysis
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                AMMS vs. AMOS: The Next Generation of Aviation Maintenance Management
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                How AMMS by Ammstro delivers a smarter, faster, and more adaptable alternative to traditional MRO systems through advanced data ingestion, proactive analytics, and intelligent automation.
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">A</span>
                </div>
                <span>AMMSTRO Team</span>
              </div>
              <span>•</span>
              <span>January 27, 2025</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
          </div>
        </header>

        {/* Main Article Content */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Introduction */}
            <section className="mb-12">
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                  AMMS by Ammstro offers a next-generation approach to aviation maintenance management, positioning itself as a smarter, faster, and more adaptable alternative to traditional MRO systems like AMOS. Unlike older platforms that rely heavily on clean, pre-structured data and manual processes, AMMS is engineered to thrive in the real-world complexity of aviation operations.
                </p>
              </div>
            </section>

            {/* Advanced Data Ingestion Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Advanced Data Ingestion and Digitization
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  AMMS is designed to handle the <em>messy reality</em> of aviation data—something legacy systems often struggle with.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    AI-Powered OCR
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    The built-in <em>OCR Wizard</em> can extract data directly from paper records, technician logs, 8130 forms, and delivery documentation, bridging the gap between physical and digital operations and eliminating manual transcription errors.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    Smart CSV Parsing
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Its intelligent data ingestion pipeline can detect file types, preprocess complex datasets, and clean data during import without human intervention, meaning faster load times and reduced preprocessing effort compared to rigid, legacy import routines.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <p className="text-blue-800 font-medium">
                  By automating digitization, AMMS drastically cuts down on manual data preparation, reducing costs and minimizing human error.
                </p>
              </div>
            </section>

            {/* Proactive Analytics Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                Proactive, Data-Driven Analytics & UX
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700 leading-relaxed">
                  Traditional BI-driven systems depend on users to ask the right questions—AMMS surfaces answers <em>before</em> you ask.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Purpose-Built Visualizations
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Components like the <em>Repeating Defects Card</em> turn maintenance data into instant, visual insights. Engineers can identify defect trends at a glance, enabling proactive maintenance decisions without running complex reports.
                </p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <p className="text-green-800 font-medium">
                  This intuitive design empowers teams to act quickly, promoting fleet reliability and lowering operational risk.
                </p>
              </div>
            </section>

            {/* Intelligent Automation Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                Intelligent Task & Workflow Automation
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700 leading-relaxed">
                  AMMS shifts from being a static <em>system of record</em> to an <em>active partner</em> in maintenance planning.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                  Task Engine
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Automatically generates work packages, schedules, and dependencies by processing real-world inputs like flight hours, defect data, and analytical trends. This reduces repetitive planning work, freeing engineers to focus on high-value problem-solving.
                </p>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                <p className="text-purple-800 font-medium">
                  By automating repetitive workflows, AMMS improves efficiency and reduces turnaround times, outperforming the manual, form-based processes of older MRO platforms.
                </p>
              </div>
            </section>

            {/* Why AMMS Wins Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why AMMS Wins
              </h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-6">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  While AMOS remains a proven legacy system, AMMS delivers a clear competitive edge with its <strong>data-centric design, proactive intelligence, and automation-first philosophy</strong>. It is purpose-built for modern aviation operations, where speed, accuracy, and adaptability are critical.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  If your operation values reduced data entry, smarter analytics, and automated task generation, AMMS is not just an upgrade—it's a transformation.
                </p>
              </div>
            </section>

            {/* Comparison Table */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                AMMS vs. AMOS: Side-by-Side Comparison
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                        Feature Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-blue-600 border-b border-gray-200">
                        AMMS by Ammstro
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b border-gray-200">
                        AMOS (Swiss-AS)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Data Ingestion</td>
                      <td className="px-6 py-4 text-sm text-gray-700">AI-powered OCR digitizes paper, images, and messy aviation records</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Expects pre-structured, clean data for import. Main use: structured XML via AIM interface</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">CSV/Data Parsing</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Intelligent parsing auto-detects, cleans, and structures complex aviation files</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Structured import/export with limited native handling of messy/unstructured files</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Manual Data Entry</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Minimizes manual entry via automation</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Reduces manual entry through interfaces and integrations, but still requires prep</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Analytics & Visualization</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Proactive, dashboard-first analytics (e.g., Repeating Defects Card) for at-a-glance trends</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Strong business intelligence modules, customizable dashboards, but often reactive; user must query for insights</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Workflow Automation</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Task Engine automates job package creation, schedules, and dependencies</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Automated scheduling and planning available, but less adaptive; relies on traditional processes</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Compliance & Regulation</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Automated record digitalization aids traceability</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Fully integrated compliance management, with strong regulatory tracking</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Integration Capabilities</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Modern, API-driven approach for flexibility</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Mature integration via AIM (Adaptive Integration Manager) and third-party modules</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">User Experience (UX)</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Designed to proactively surface problems and trends in real time; actionable UX</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Mature interface with customizable widgets and dashboards; some legacy workflows remain</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Target User</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Operators needing agility with complex, changing data and high automation</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Airlines, MROs, and CAMOs of all sizes prioritizing depth and regulatory compliance</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Innovation Focus</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Data aggregation and intelligent automation as core strengths</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Reliability, integration, compliance, and steady feature evolution</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Aircraft Maintenance Images */}
             <section className="mb-12">
               <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                 Real-World Aviation Maintenance
               </h2>
               <div className="grid md:grid-cols-3 gap-6">
                 <div className="relative overflow-hidden rounded-lg shadow-lg">
                   <img 
                     src="/assets/boeing-737-maintenance.jpg" 
                     alt="Boeing 737 Maintenance" 
                     className="w-full h-48 object-cover"
                   />
                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                     <p className="text-white text-sm font-medium">Boeing 737 Maintenance</p>
                   </div>
                 </div>
                 <div className="relative overflow-hidden rounded-lg shadow-lg">
                   <img 
                     src="/assets/airbus-a320-maintenance.jpg" 
                     alt="Airbus A320 Maintenance" 
                     className="w-full h-48 object-cover"
                   />
                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                     <p className="text-white text-sm font-medium">Airbus A320 Maintenance</p>
                   </div>
                 </div>
                 <div className="relative overflow-hidden rounded-lg shadow-lg">
                   <img 
                     src="/assets/hangar-maintenance.jpg" 
                     alt="Hangar Maintenance Operations" 
                     className="w-full h-48 object-cover"
                   />
                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                     <p className="text-white text-sm font-medium">Hangar Operations</p>
                   </div>
                 </div>
               </div>
             </section>
           </div>
         </article>
       </main>

      {/* Footer - Same as main page */}
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
               
               {/* Company Address */}
               <div className="mb-4">
                 <h4 className="text-white font-semibold mb-2">Our Office</h4>
                 <address className="text-slate-400 text-sm not-italic leading-relaxed">
                   Level 23, Premier Suite<br />
                   One Mont Kiara No 1<br />
                   Jalan Kiara, Mont Kiara<br />
                   50480 Kuala Lumpur<br />
                   Malaysia
                 </address>
                 <div className="mt-3">
                   <a href="mailto:business@ammstro.com" className="text-orange-400 hover:text-orange-300 text-sm">
                     business@ammstro.com
                   </a>
                 </div>
               </div>
               
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
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 715.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666z" clipRule="evenodd"></path>
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
                  <li><a href="mailto:business@ammstro.com?subject=Contact Inquiry" className="text-slate-400 hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="/blog" className="text-slate-400 hover:text-white">Blog</a></li>
                  <li><a href="/documentation" className="text-slate-400 hover:text-white">Documentation</a></li>
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

      {/* Get Started Modal */}
      {isGetStartedModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">Get Started with AMMS</h3>
              <button 
                onClick={() => setIsGetStartedModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-slate-600 mb-6">
              Ready to transform your aircraft maintenance operations? Contact us to schedule a demo.
            </p>
            <div className="space-y-4">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                Request Demo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;