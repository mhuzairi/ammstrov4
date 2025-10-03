import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import jsPDF from 'jspdf'
import { adminSettingsService, discountCodesService } from './lib/firestore'
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
  X,
  Edit,
  Plus,
  Mail,
  Phone,
} from 'lucide-react'
import ammstroLogo from '/assets/ammstro-logo.png'
import './App.css'

// Dynamic Pricing Calculator Component
function PricingCalculator() {
  const [aircraftCount, setAircraftCount] = useState(1)
  const [selectedModules, setSelectedModules] = useState({
    basicMaintenance: true,
    predictiveAnalytics: false,
    realTimeMonitoring: false,
    advancedReporting: false,
    apiIntegrations: false,
    prioritySupport: false,
    training: false,
    customIntegrations: false,
    dedicatedManager: false,
    premiumSupport: false
  })
  
  // Base pricing per aircraft
  const basePricePerAircraft = 5000
  
  // Module pricing
  const modulePrices = {
    basicMaintenance: 0, // included in base
    predictiveAnalytics: 250,
    realTimeMonitoring: 350,
    advancedReporting: 200,
    apiIntegrations: 300,
    prioritySupport: 150,
    training: 400,
    customIntegrations: 750,
    dedicatedManager: 1000,
    premiumSupport: 500
  }

  // Admin state
  const [showAccessModal, setShowAccessModal] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAddModuleModal, setShowAddModuleModal] = useState(false)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [newModuleName, setNewModuleName] = useState('')
  const [newModulePrice, setNewModulePrice] = useState('')
  
  // Discount code state
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(null)
  const [discountError, setDiscountError] = useState('')
  const [showDiscountInput, setShowDiscountInput] = useState(false)
  
  // Admin discount management
  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const [discountCodes, setDiscountCodes] = useState([])
  const [newDiscountCode, setNewDiscountCode] = useState('')
  const [newDiscountType, setNewDiscountType] = useState('percentage')
  const [newDiscountValue, setNewDiscountValue] = useState('')
  const [newDiscountIsOneTime, setNewDiscountIsOneTime] = useState(false)
  const [newDiscountValidUntil, setNewDiscountValidUntil] = useState('')
  const [usedOneTimeCodes, setUsedOneTimeCodes] = useState(new Set())
  
  // Editing state for discount codes
  const [editingDiscountCode, setEditingDiscountCode] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  
  // Admin pricing state - these will hold the editable values
  const [adminBasePricePerAircraft, setAdminBasePricePerAircraft] = useState(basePricePerAircraft)
  const [adminModulePrices, setAdminModulePrices] = useState(modulePrices)
  
  // Current pricing state - these are the actual values used by the calculator
  const [currentBasePricePerAircraft, setCurrentBasePricePerAircraft] = useState(basePricePerAircraft)
  const [currentModulePrices, setCurrentModulePrices] = useState(modulePrices)
  
  // Module visibility state - controls which modules are shown on the website
  const [moduleVisibility, setModuleVisibility] = useState({
    basicMaintenance: true,
    predictiveAnalytics: true,
    realTimeMonitoring: true,
    advancedReporting: true,
    apiIntegrations: true,
    prioritySupport: true,
    training: true,
    customIntegrations: true,
    dedicatedManager: true,
    premiumSupport: true
  })
  
  // Module order state - controls the order of modules displayed
  const [moduleOrder, setModuleOrder] = useState([
    'basicMaintenance',
    'predictiveAnalytics',
    'realTimeMonitoring',
    'advancedReporting',
    'apiIntegrations',
    'prioritySupport',
    'training',
    'customIntegrations',
    'dedicatedManager',
    'premiumSupport'
  ])
  
  const moduleLabels = {
    basicMaintenance: 'Basic Maintenance Scheduling',
    predictiveAnalytics: 'AI Predictive Analytics',
    realTimeMonitoring: 'Real-time Fleet Monitoring',
    advancedReporting: 'Advanced Reporting & Analytics',
    apiIntegrations: 'API Integrations',
    prioritySupport: 'Priority Support',
    training: 'Training & Onboarding',
    customIntegrations: 'Custom Integrations',
    dedicatedManager: 'Dedicated Account Manager',
    premiumSupport: '24/7 Premium Support'
  }

  // Dynamic module labels and prices (can be extended with new modules)
  const [dynamicModuleLabels, setDynamicModuleLabels] = useState(moduleLabels)
  const [dynamicModulePrices, setDynamicModulePrices] = useState(modulePrices)

  // Base plan features state
  const [basePlanFeatures, setBasePlanFeatures] = useState([
    'Basic Maintenance Scheduling',
    'Aircraft Status Tracking',
    'Maintenance History Records',
    'Standard Reporting Dashboard',
    'Email Notifications',
    'Basic User Management'
  ])
  const [newBasePlanFeature, setNewBasePlanFeature] = useState('')

  // Loading states
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [isLoadingDiscountCodes, setIsLoadingDiscountCodes] = useState(true)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [isAddingModule, setIsAddingModule] = useState(false)
  const [isDeletingModule, setIsDeletingModule] = useState(false)
  const [isAddingDiscount, setIsAddingDiscount] = useState(false)
  const [isUpdatingDiscount, setIsUpdatingDiscount] = useState(false)
  const [isDeletingDiscount, setIsDeletingDiscount] = useState(false)
  const [settingsError, setSettingsError] = useState(null)
  const [discountCodesError, setDiscountCodesError] = useState(null)

  // Load admin settings from Firestore on component mount
  useEffect(() => {
    const loadAdminSettings = async () => {
      try {
        setIsLoadingSettings(true)
        const settings = await adminSettingsService.getSettings()
        
        if (settings.modulePrices) {
          setAdminModulePrices(settings.modulePrices)
          setCurrentModulePrices(settings.modulePrices)
          setDynamicModulePrices(settings.modulePrices)
        }
        
        if (settings.moduleVisibility) {
          setModuleVisibility(settings.moduleVisibility)
        }
        
        if (settings.moduleLabels) {
          setDynamicModuleLabels(settings.moduleLabels)
          
          const existingModules = Object.keys(settings.moduleLabels)
          
          // Update moduleOrder - ensure ALL modules from moduleLabels are included
          if (settings.moduleOrder) {
            // Use the saved order from Firebase, but ensure all existing modules are included
            const savedOrder = settings.moduleOrder.filter(module => existingModules.includes(module))
            // Add any modules that exist in moduleLabels but are missing from saved order
            const missingModules = existingModules.filter(module => !settings.moduleOrder.includes(module))
            const finalOrder = [...savedOrder, ...missingModules]

            setModuleOrder(finalOrder)
          } else {
            // Fallback: use all modules from moduleLabels

            setModuleOrder(existingModules)
          }
          
          // Update selectedModules to include new modules (unselected by default)
          setSelectedModules(prevSelected => {
            const newSelected = { ...prevSelected }
            existingModules.forEach(module => {
              if (!(module in newSelected)) {
                newSelected[module] = false
              }
            })
            return newSelected
          })
        }
        
        setSettingsError(null)
      } catch (error) {
        console.error('Error loading admin settings:', error)
        setSettingsError('Failed to load admin settings')
      } finally {
        setIsLoadingSettings(false)
      }
    }

    loadAdminSettings()
  }, [])

  // Load discount codes from Firestore on component mount
  useEffect(() => {
    const loadDiscountCodes = async () => {
      try {
        setIsLoadingDiscountCodes(true)
        const codes = await discountCodesService.getDiscountCodes()
        setDiscountCodes(codes)
        setDiscountCodesError(null)
      } catch (error) {
        console.error('Error loading discount codes:', error)
        setDiscountCodesError('Failed to load discount codes')
        // Set default discount codes if loading fails
        setDiscountCodes([
          { code: 'SAVE10', type: 'percentage', value: 10, active: true, isOneTime: false, validUntil: null },
          { code: 'WELCOME50', type: 'fixed', value: 50, active: true, isOneTime: true, validUntil: new Date('2024-12-31') },
          { code: 'TRIAL20', type: 'percentage', value: 20, active: true, isOneTime: false, validUntil: new Date('2024-06-30') }
        ])
      } finally {
        setIsLoadingDiscountCodes(false)
      }
    }

    loadDiscountCodes()
  }, [])

  const calculateTotalPrice = () => {
    let total = currentBasePricePerAircraft * aircraftCount
    
    Object.entries(selectedModules).forEach(([module, isSelected]) => {
      if (isSelected) {
        total += currentModulePrices[module] * aircraftCount
      }
    })
    
    return total
  }
  
  const calculateDiscountedPrice = () => {
    const baseTotal = calculateTotalPrice()
    
    if (!appliedDiscount) {
      return baseTotal
    }
    
    let discountAmount = 0
    if (appliedDiscount.type === 'percentage') {
      discountAmount = (baseTotal * appliedDiscount.value) / 100
    } else {
      discountAmount = appliedDiscount.value * aircraftCount
    }
    
    return Math.max(0, baseTotal - discountAmount)
  }
  
  const getDiscountAmount = () => {
    const baseTotal = calculateTotalPrice()
    const discountedTotal = calculateDiscountedPrice()
    return baseTotal - discountedTotal
  }
  
  // Discount code functions
  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase()
    
    if (!code) {
      setDiscountError('Please enter a discount code')
      return
    }
    
    const discount = discountCodes.find(d => d.code === code)
    
    if (!discount) {
      setDiscountError('Invalid discount code')
      return
    }
    
    if (!discount.active) {
      setDiscountError('This discount code is no longer active')
      return
    }
    
    if (discount.validUntil && new Date() > new Date(discount.validUntil)) {
      setDiscountError('This discount code has expired')
      return
    }
    
    if (discount.isOneTime && usedOneTimeCodes.has(code)) {
      setDiscountError('This discount code has already been used')
      return
    }
    
    // Apply the discount
    setAppliedDiscount({ ...discount })
    setDiscountError('')
    
    // Mark one-time codes as used
    if (discount.isOneTime) {
      setUsedOneTimeCodes(prev => new Set([...prev, code]))
    }
  }
  
  const handleRemoveDiscount = () => {
    setAppliedDiscount(null)
    setDiscountCode('')
    setDiscountError('')
  }
  
  // Admin discount functions
  const handleAddDiscountCode = async () => {
    if (!newDiscountCode.trim() || !newDiscountValue) {
      alert('Please enter both discount code and value')
      return
    }
    
    const code = newDiscountCode.trim().toUpperCase()
    
    if (discountCodes.find(d => d.code === code)) {
      alert('This discount code already exists')
      return
    }
    
    const newDiscount = {
      code: code,
      type: newDiscountType,
      value: Number(newDiscountValue),
      active: true,
      isOneTime: newDiscountIsOneTime,
      validUntil: newDiscountValidUntil ? new Date(newDiscountValidUntil) : null
    }
    
    try {
      setIsAddingDiscount(true)
      setDiscountCodesError(null)
      
      // Save to Firestore
      await discountCodesService.addDiscountCode(newDiscount)
      
      // Update local state
      setDiscountCodes(prev => [...prev, { id: code, ...newDiscount }])
      
      // Reset form
      setNewDiscountCode('')
      setNewDiscountValue('')
      setNewDiscountIsOneTime(false)
      setNewDiscountValidUntil('')
      setShowDiscountModal(false)
      
      alert('Discount code created successfully!')
    } catch (error) {
      console.error('Error adding discount code:', error)
      setDiscountCodesError('Failed to create discount code. Please try again.')
      alert('Failed to create discount code. Please try again.')
    } finally {
      setIsAddingDiscount(false)
    }
  }
  
  const handleToggleDiscountStatus = async (code) => {
    try {
      setIsUpdatingDiscount(true)
      setDiscountCodesError(null)
      
      const discountToUpdate = discountCodes.find(d => d.code === code)
      
      if (!discountToUpdate) {
        console.error('Discount code not found:', code)
        return
      }
      
      // Only pass the fields that should be updated, excluding 'id'
      const updateData = {
        active: !discountToUpdate.active,
        updatedAt: new Date()
      }
      
      // Update in Firestore
      await discountCodesService.updateDiscountCode(code, updateData)
      
      // Update local state
      setDiscountCodes(prev => prev.map(discount => 
        discount.code === code 
          ? { ...discount, active: !discount.active }
          : discount
      ))
    } catch (error) {
      console.error('Error toggling discount status:', error)
      setDiscountCodesError('Failed to update discount code status. Please try again.')
      alert('Failed to update discount code status. Please try again.')
    } finally {
      setIsUpdatingDiscount(false)
    }
  }
  
  const handleDeleteDiscountCode = async (code) => {
    if (confirm(`Are you sure you want to delete the discount code "${code}"?`)) {
      try {
        setIsDeletingDiscount(true)
        setDiscountCodesError(null)
        
        // Delete from Firestore
        await discountCodesService.deleteDiscountCode(code)
        
        // Update local state
        setDiscountCodes(prev => prev.filter(discount => discount.code !== code))
        
        // Remove from applied discount if it's currently applied
        if (appliedDiscount && appliedDiscount.code === code) {
          handleRemoveDiscount()
        }
      } catch (error) {
        console.error('Error deleting discount code:', error)
        setDiscountCodesError('Failed to delete discount code. Please try again.')
        alert('Failed to delete discount code. Please try again.')
      } finally {
        setIsDeletingDiscount(false)
      }
    }
  }
  
  // Edit discount code functions
  const handleStartEditDiscount = (code) => {
    const discountToEdit = discountCodes.find(d => d.code === code)
    if (discountToEdit) {
      setEditingDiscountCode(code)
      setEditFormData({
        code: discountToEdit.code,
        type: discountToEdit.type,
        value: discountToEdit.value,
        isOneTime: discountToEdit.isOneTime,
        validUntil: discountToEdit.validUntil ? new Date(discountToEdit.validUntil).toISOString().split('T')[0] : ''
      })
    }
  }
  
  const handleSaveEditDiscount = async (originalCode) => {
    if (!editFormData.code.trim() || !editFormData.value) {
      alert('Please enter both discount code and value')
      return
    }
    
    const newCode = editFormData.code.trim().toUpperCase()
    
    // Check if the new code already exists (unless it's the same code)
    if (newCode !== originalCode && discountCodes.find(d => d.code === newCode)) {
      alert('This discount code already exists')
      return
    }
    
    try {
      const originalDiscount = discountCodes.find(d => d.code === originalCode)
      const updatedDiscount = {
        code: newCode,
        type: editFormData.type,
        value: Number(editFormData.value),
        isOneTime: editFormData.isOneTime,
        validUntil: editFormData.validUntil ? new Date(editFormData.validUntil) : null,
        active: originalDiscount ? originalDiscount.active : true
      }
      
      // If code changed, delete old and create new
      if (newCode !== originalCode) {
        await discountCodesService.deleteDiscountCode(originalCode)
        await discountCodesService.addDiscountCode(updatedDiscount)
      } else {
        // Just update existing
        await discountCodesService.updateDiscountCode(originalCode, updatedDiscount)
      }
      
      // Update local state
      setDiscountCodes(prev => prev.map(discount => 
        discount.code === originalCode 
          ? {
              ...discount,
              code: newCode,
              type: editFormData.type,
              value: Number(editFormData.value),
              isOneTime: editFormData.isOneTime,
              validUntil: editFormData.validUntil ? new Date(editFormData.validUntil) : null,
              active: discount.active
            }
          : discount
      ))
      
      // Update applied discount if it's currently applied
      if (appliedDiscount && appliedDiscount.code === originalCode) {
        setAppliedDiscount({
          code: newCode,
          type: editFormData.type,
          value: Number(editFormData.value),
          isOneTime: editFormData.isOneTime,
          validUntil: editFormData.validUntil ? new Date(editFormData.validUntil) : null
        })
      }
      
      setEditingDiscountCode(null)
      setEditFormData({})
    } catch (error) {
      console.error('Error updating discount code:', error)
      alert('Failed to update discount code. Please try again.')
    }
  }
  
  const handleCancelEditDiscount = () => {
    setEditingDiscountCode(null)
    setEditFormData({})
  }
  
  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleModuleChange = (module) => {
    if (module === 'basicMaintenance') return // Can't uncheck basic maintenance
    
    setSelectedModules(prev => ({
      ...prev,
      [module]: !prev[module]
    }))
  }

  // Admin functions
  const handleAdminClick = () => {
    setShowAccessModal(true)
  }

  const handleAccessSubmit = () => {
    if (accessCode === '007') {
      setIsAdmin(true)
      setShowAccessModal(false)
      setShowAdminModal(true)
      setAccessCode('')
    } else {
      alert('Invalid access code')
      setAccessCode('')
    }
  }

  const handleCloseModals = () => {
    setShowAccessModal(false)
    setShowAdminModal(false)
    setAccessCode('')
  }

  const handleSaveChanges = async () => {
    try {
      setIsSavingSettings(true)
      setSettingsError(null)
      
      // Prepare settings object
      const settings = {
        modulePrices: adminModulePrices,
        moduleVisibility: moduleVisibility,
        moduleLabels: dynamicModuleLabels,
        moduleOrder: moduleOrder
      }
      
      // Save to Firestore
      await adminSettingsService.saveSettings(settings)
      
      // Update the current pricing with admin values
      setCurrentBasePricePerAircraft(adminBasePricePerAircraft)
      setCurrentModulePrices(adminModulePrices)
      
      // Close the admin modal
      setShowAdminModal(false)
      
      // Show success message
      alert('Pricing changes saved successfully!')
    } catch (error) {
      console.error('Error saving admin settings:', error)
      setSettingsError('Failed to save changes. Please try again.')
      alert('Failed to save changes. Please try again.')
    } finally {
      setIsSavingSettings(false)
    }
  }

  const handleAdminBasePriceChange = (value) => {
    setAdminBasePricePerAircraft(Number(value))
  }

  const handleAdminModulePriceChange = (module, value) => {
    setAdminModulePrices(prev => ({
      ...prev,
      [module]: Number(value)
    }))
  }

  const handleAddNewModule = () => {
    setShowAddModuleModal(true)
  }

  const handleSaveNewModule = async () => {
    if (!newModuleName.trim() || !newModulePrice) {
      alert('Please enter both module name and price')
      return
    }

    try {
      setIsAddingModule(true)
      setSettingsError(null)
      
      // Create a unique key for the new module
      const moduleKey = newModuleName.toLowerCase().replace(/[^a-z0-9]/g, '')
      
      // Check if module key already exists
      if (dynamicModuleLabels[moduleKey]) {
        alert('A module with this name already exists. Please choose a different name.')
        return
      }
      
      // Prepare updated data
      const updatedModuleLabels = {
        ...dynamicModuleLabels,
        [moduleKey]: newModuleName.trim()
      }
      
      const updatedModulePrices = {
        ...adminModulePrices,
        [moduleKey]: Number(newModulePrice)
      }
      
      const updatedModuleVisibility = {
        ...moduleVisibility,
        [moduleKey]: true
      }
      
      // Add to module order (at the end)
      const updatedModuleOrder = [...moduleOrder, moduleKey]
      
      // Save to Firebase
      const settings = {
        modulePrices: updatedModulePrices,
        moduleVisibility: updatedModuleVisibility,
        moduleLabels: updatedModuleLabels,
        moduleOrder: updatedModuleOrder
      }
      
      await adminSettingsService.saveSettings(settings)
      
      // Update local state after successful save
      setDynamicModuleLabels(updatedModuleLabels)
      setDynamicModulePrices(updatedModulePrices)
      setAdminModulePrices(updatedModulePrices)
      setCurrentModulePrices(updatedModulePrices)
      setModuleVisibility(updatedModuleVisibility)
      setModuleOrder(updatedModuleOrder)
      
      // Add to selected modules (unselected by default)
      setSelectedModules(prev => ({
        ...prev,
        [moduleKey]: false
      }))
      
      // Reset form and close modal
      setNewModuleName('')
      setNewModulePrice('')
      setShowAddModuleModal(false)
      
      alert('New module added successfully!')
    } catch (error) {
      console.error('Error adding new module:', error)
      setSettingsError('Failed to add new module. Please try again.')
      alert('Failed to add new module. Please try again.')
    } finally {
      setIsAddingModule(false)
    }
  }

  const handleToggleModuleVisibility = (module) => {
    setModuleVisibility(prev => ({
      ...prev,
      [module]: !prev[module]
    }))
  }

  const handleCloseAddModuleModal = () => {
    setShowAddModuleModal(false)
    setNewModuleName('')
    setNewModulePrice('')
  }

  // Base plan features management functions
  const handleAddBasePlanFeature = () => {
    if (!newBasePlanFeature.trim()) {
      alert('Please enter a feature name')
      return
    }
    
    setBasePlanFeatures(prev => [...prev, newBasePlanFeature.trim()])
    setNewBasePlanFeature('')
  }

  const handleRemoveBasePlanFeature = (index) => {
    setBasePlanFeatures(prev => prev.filter((_, i) => i !== index))
  }

  // Module reordering functions
  const handleMoveModuleUp = async (moduleKey) => {
    const currentIndex = moduleOrder.indexOf(moduleKey)
    if (currentIndex > 0) {
      const newOrder = [...moduleOrder]
      const temp = newOrder[currentIndex]
      newOrder[currentIndex] = newOrder[currentIndex - 1]
      newOrder[currentIndex - 1] = temp
      
      try {
        // Save updated order to Firebase
        const settings = {
          modulePrices: adminModulePrices,
          moduleVisibility: moduleVisibility,
          moduleLabels: dynamicModuleLabels,
          moduleOrder: newOrder
        }
        
        await adminSettingsService.saveSettings(settings)
        setModuleOrder(newOrder)
      } catch (error) {
        console.error('Error saving module order:', error)
        alert('Failed to save module order. Please try again.')
      }
    }
  }

  const handleMoveModuleDown = async (moduleKey) => {
    const currentIndex = moduleOrder.indexOf(moduleKey)
    if (currentIndex < moduleOrder.length - 1) {
      const newOrder = [...moduleOrder]
      const temp = newOrder[currentIndex]
      newOrder[currentIndex] = newOrder[currentIndex + 1]
      newOrder[currentIndex + 1] = temp
      
      try {
        // Save updated order to Firebase
        const settings = {
          modulePrices: adminModulePrices,
          moduleVisibility: moduleVisibility,
          moduleLabels: dynamicModuleLabels,
          moduleOrder: newOrder
        }
        
        await adminSettingsService.saveSettings(settings)
        setModuleOrder(newOrder)
      } catch (error) {
        console.error('Error saving module order:', error)
        alert('Failed to save module order. Please try again.')
      }
    }
  }

  const handleDeleteModule = async (moduleKey) => {
    console.log('🚨🚨🚨 CRITICAL: handleDeleteModule FUNCTION CALLED! 🚨🚨🚨')
    console.log('🗑️ handleDeleteModule called with moduleKey:', moduleKey)
    console.log('🔍 Current dynamicModuleLabels:', dynamicModuleLabels)
    console.log('🔍 Current moduleOrder:', moduleOrder)
    
    // Prevent deletion of basic maintenance module
    if (moduleKey === 'basicMaintenance') {
      alert('Cannot delete the Basic Maintenance module as it is required.')
      return
    }

    // Confirm deletion
    if (!confirm(`Are you sure you want to delete the "${dynamicModuleLabels[moduleKey]}" module? This action cannot be undone.`)) {
      console.log('❌ User cancelled deletion')
      return
    }

    try {
      console.log('🔄 Starting module deletion process...')
      setIsDeletingModule(true)
      setSettingsError(null)
      
      // Prepare updated data with module removed (same as discount code pattern)
      const updatedModuleLabels = { ...dynamicModuleLabels }
      delete updatedModuleLabels[moduleKey]
      
      const updatedModulePrices = { ...adminModulePrices }
      delete updatedModulePrices[moduleKey]
      
      const updatedModuleVisibility = { ...moduleVisibility }
      delete updatedModuleVisibility[moduleKey]
      
      // Remove from module order
      const updatedModuleOrder = moduleOrder.filter(module => module !== moduleKey)
      
      console.log('📝 Prepared updated data:', {
        moduleLabels: Object.keys(updatedModuleLabels),
        moduleOrder: updatedModuleOrder,
        modulePrices: Object.keys(updatedModulePrices)
      })
      
      // Use direct Firebase delete (same pattern as discount codes)
      console.log('💾 Calling adminSettingsService.deleteModule...')
      await adminSettingsService.deleteModule(moduleKey)
      
      // Update moduleOrder separately
      console.log('💾 Updating moduleOrder...')
      await adminSettingsService.updateSetting('moduleOrder', updatedModuleOrder)
      console.log('✅ Firebase updates completed successfully!')
      
      // Update local state immediately (same as discount codes)
      console.log('🔄 Updating local state...')
      setDynamicModuleLabels(updatedModuleLabels)
      setDynamicModulePrices(updatedModulePrices)
      setAdminModulePrices(updatedModulePrices)
      setCurrentModulePrices(updatedModulePrices)
      setModuleVisibility(updatedModuleVisibility)
      setModuleOrder(updatedModuleOrder)
      
      // Remove from selected modules
      setSelectedModules(prev => {
        const updated = { ...prev }
        delete updated[moduleKey]
        return updated
      })

      console.log('🎉 Module deletion completed successfully!')
      alert('Module deleted successfully!')
    } catch (error) {
      console.error('❌ Error deleting module:', error)
      setSettingsError('Failed to delete module. Please try again.')
      alert('Failed to delete module. Please try again.')
    } finally {
      setIsDeletingModule(false)
    }
  }

  const totalPrice = calculateTotalPrice()
  const discountedPrice = calculateDiscountedPrice()
  const discountAmount = getDiscountAmount()
  const selectedModuleCount = Object.values(selectedModules).filter(Boolean).length

  return (
    <motion.div
      className="max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 group">
            <h3 className="text-2xl font-bold text-slate-800">Configure Your Plan</h3>
            <button
              onClick={handleAdminClick}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-slate-100 rounded-lg"
              title="Admin Settings"
            >
              <Edit className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          </div>
          
          {/* Aircraft Count Selector */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Number of Aircraft
            </label>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAircraftCount(Math.max(1, aircraftCount - 1))}
                className="w-10 h-10 p-0"
              >
                -
              </Button>
              <div className="flex-1">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={aircraftCount}
                  onChange={(e) => setAircraftCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAircraftCount(Math.min(100, aircraftCount + 1))}
                className="w-10 h-10 p-0"
              >
                +
              </Button>
              <div className="min-w-[3rem] text-center">
                <span className="text-2xl font-bold text-orange-500">{aircraftCount}</span>
              </div>
            </div>
          </div>

          {/* Module Selection */}
          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-semibold text-slate-700 mb-4">
              Select Modules ({selectedModuleCount} selected)
            </label>
            <div className="space-y-2 overflow-y-auto mb-4 flex-1" style={{minHeight: '200px', maxHeight: '70vh'}}>
              {moduleOrder
                .filter(module => moduleVisibility[module] && dynamicModuleLabels[module])
                .map(module => {
                const label = dynamicModuleLabels[module]
                const isBasic = module === 'basicMaintenance'
                const isSelected = selectedModules[module]
                const price = currentModulePrices[module]
                
                return (
                  <div
                    key={module}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      isSelected 
                        ? 'bg-orange-50 border-orange-200' 
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    } ${isBasic ? 'opacity-75' : 'cursor-pointer'}`}
                    onClick={() => !isBasic && handleModuleChange(module)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected 
                          ? 'bg-orange-500 border-orange-500' 
                          : 'border-slate-300'
                      }`}>
                        {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-800">{label}</span>
                        {isBasic && <span className="text-xs text-slate-500 block">Included in base plan</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-700">
                        {price === 0 ? 'Included' : `$${price}/aircraft`}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Professional Disclaimer - Always at bottom */}
            <div className="mt-auto p-4 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg shadow-sm">
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-800">Pricing Estimate:</strong> The above pricing is a recommended estimate based on standard configurations and may vary depending on specific implementation requirements, customization needs, and enterprise-level integrations. Final pricing will be confirmed during the consultation phase and may be subject to adjustment based on your organization's unique operational requirements and compliance standards.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">Your Custom Plan</h3>
          
          <div className="space-y-4 mb-8">
            <div className="pb-4 border-b border-white/20">
              <div className="flex justify-between items-center mb-3">
                <span>Base Plan ({aircraftCount} aircraft)</span>
                <span className="font-semibold">${currentBasePricePerAircraft * aircraftCount}</span>
              </div>
              <div className="text-xs text-white/80 space-y-1">
                <div className="font-medium mb-2">Includes:</div>
                {basePlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {Object.entries(selectedModules).map(([module, isSelected]) => {
              if (!isSelected || currentModulePrices[module] === 0) return null
              
              return (
                <div key={module} className="flex justify-between items-center">
                  <span className="text-sm">{dynamicModuleLabels[module]}</span>
                  <span className="font-semibold">${currentModulePrices[module] * aircraftCount}</span>
                </div>
              )
            })}
          </div>
          
          {/* Discount Code Section */}
          <div className="border-t border-white/20 pt-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Have a discount code?</span>
              <button
                onClick={() => setShowDiscountInput(!showDiscountInput)}
                className="text-xs text-white/80 hover:text-white underline"
              >
                {showDiscountInput ? 'Hide' : 'Add Code'}
              </button>
            </div>
            
            {showDiscountInput && (
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => {
                      setDiscountCode(e.target.value)
                      setDiscountError('')
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
                    placeholder="Enter discount code"
                    className="flex-1 px-3 py-2 text-sm text-slate-800 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <Button
                    onClick={handleApplyDiscount}
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                  >
                    Apply
                  </Button>
                </div>
                
                {discountError && (
                  <p className="text-xs text-red-200">{discountError}</p>
                )}
                
                {appliedDiscount && (
                  <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                    <div>
                      <span className="text-sm font-medium">{appliedDiscount.code}</span>
                      <p className="text-xs text-white/80">
                        {appliedDiscount.type === 'percentage' 
                          ? `${appliedDiscount.value}% off` 
                          : `$${appliedDiscount.value} off per aircraft`
                        }
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveDiscount}
                      className="text-white/60 hover:text-white text-xs"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="border-t border-white/20 pt-6 mb-8">
            {appliedDiscount && (
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-green-200">
                  <span>Discount ({appliedDiscount.code})</span>
                  <span>-${discountAmount.toLocaleString()}</span>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg">Total Monthly Cost</span>
              <span className="text-4xl font-bold">${discountedPrice.toLocaleString()}</span>
            </div>
            <p className="text-white/80 text-sm">
              ${(discountedPrice / aircraftCount).toFixed(0)} per aircraft per month
            </p>
            
            {appliedDiscount && (
              <p className="text-green-200 text-xs mt-2">
                You save ${discountAmount.toLocaleString()} per month!
              </p>
            )}
          </div>
          
          <div className="space-y-3">
            <Button className="w-full bg-white text-orange-500 hover:bg-slate-100 font-semibold">
              Start 7-Day Free Trial
            </Button>
            <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
              Contact Sales Team
            </Button>
            <button 
              onClick={() => setShowQuoteModal(true)}
              className="w-full text-center text-white/80 hover:text-white text-sm underline underline-offset-2 hover:underline-offset-4 transition-all duration-200 mt-2"
            >
              Export Quote
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center space-x-2 text-sm text-white/80">
              <CheckCircle className="w-4 h-4" />
              <span>7-day free trial</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-white/80 mt-1">
              <CheckCircle className="w-4 h-4" />
              <span>No setup fees • Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Access Code Modal */}
      {showAccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Admin Access Required</h3>
            <p className="text-slate-600 mb-4">Please enter the access code to continue:</p>
            <input
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAccessSubmit()}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
              placeholder="Enter access code"
              autoFocus
            />
            <div className="flex space-x-3">
              <Button onClick={handleAccessSubmit} className="flex-1 bg-orange-500 hover:bg-orange-600">
                Submit
              </Button>
              <Button onClick={handleCloseModals} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <h3 className="text-2xl font-bold text-slate-800">Admin Panel - Pricing Management</h3>
              <button onClick={handleCloseModals} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* Base Pricing Settings */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-slate-800">Base Pricing</h4>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Base Price per Aircraft ($/month)
                  </label>
                  <input
                    type="number"
                    value={adminBasePricePerAircraft}
                    onChange={(e) => handleAdminBasePriceChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                {/* Base Plan Features Management */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h5 className="text-md font-medium text-slate-700 mb-3">Base Plan Features</h5>
                  <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                    {basePlanFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded border group">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...basePlanFeatures]
                            newFeatures[index] = e.target.value
                            setBasePlanFeatures(newFeatures)
                          }}
                          className="flex-1 text-sm text-slate-700 bg-transparent border-none outline-none focus:bg-slate-50 focus:px-2 focus:py-1 focus:rounded transition-all"
                        />
                        <div className="flex items-center space-x-1">
                          <button
                            className="text-slate-400 hover:text-slate-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Edit feature"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleRemoveBasePlanFeature(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove feature"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newBasePlanFeature}
                      onChange={(e) => setNewBasePlanFeature(e.target.value)}
                      placeholder="Add new feature"
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddBasePlanFeature()}
                    />
                    <Button
                      onClick={handleAddBasePlanFeature}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
                {/* Module Pricing Settings */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-slate-800">Module Pricing, Visibility & Order</h4>
                  {settingsError && (
                    <div className="text-red-600 text-xs mb-2 p-2 bg-red-50 rounded">
                      {settingsError}
                    </div>
                  )}
                  <div className="space-y-2 overflow-y-auto bg-slate-50 p-4 rounded-lg" style={{maxHeight: '60vh'}}>
                  {isLoadingSettings ? (
                    <div className="text-center py-4">
                      <div className="text-xs text-slate-500">Loading admin settings...</div>
                    </div>
                  ) : (
                  moduleOrder.map((module, index) => {
                    // Skip modules that don't have labels or have empty labels
                    if (!dynamicModuleLabels[module] || !dynamicModuleLabels[module].trim()) {
                      return null
                    }
                    const label = dynamicModuleLabels[module]
                    return (
                      <div key={module} className="bg-white p-3 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-slate-700">
                            {label}
                          </label>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleMoveModuleUp(module)}
                                disabled={index === 0}
                                className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Move up"
                              >
                                ↑
                              </button>
                              <button
                                onClick={() => handleMoveModuleDown(module)}
                                disabled={index === moduleOrder.length - 1}
                                className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Move down"
                              >
                                ↓
                              </button>
                              <button
                                onClick={() => handleDeleteModule(module)}
                                disabled={module === 'basicMaintenance' || isDeletingModule}
                                className="p-1 text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                title={module === 'basicMaintenance' ? 'Cannot delete required module' : 'Delete module'}
                              >
                                {isDeletingModule ? <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin"></div> : <X className="w-3 h-3" />}
                              </button>
                            </div>
                            <span className="text-xs text-slate-500">Visible:</span>
                            <input
                              type="checkbox"
                              checked={moduleVisibility[module]}
                              onChange={() => handleToggleModuleVisibility(module)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <input
                          type="number"
                          value={adminModulePrices[module]}
                          onChange={(e) => handleAdminModulePriceChange(module, e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Price per aircraft"
                        />
                      </div>
                    )
                  }).filter(Boolean))
                }
                </div>
                </div>
                
                {/* Third Column - Discount Code Management */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-slate-800">Discount Code Management</h4>
                  
                  {/* Existing Discount Codes */}
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <h5 className="text-sm font-medium text-slate-700 mb-2">Existing Discount Codes</h5>
                    {discountCodesError && (
                      <div className="text-red-600 text-xs mb-2 p-2 bg-red-50 rounded">
                        {discountCodesError}
                      </div>
                    )}
                    <div className="space-y-1 mb-3 max-h-48 overflow-y-auto">
                      {isLoadingDiscountCodes ? (
                        <div className="text-center py-4">
                          <div className="text-xs text-slate-500">Loading discount codes...</div>
                        </div>
                      ) : discountCodes.length === 0 ? (
                        <div className="text-center py-4">
                          <div className="text-xs text-slate-500">No discount codes found</div>
                        </div>
                      ) : (
                        discountCodes.map((code) => (
                        <div key={code.code} className="bg-white p-2 rounded border text-xs">
                          {editingDiscountCode === code.code ? (
                            // Edit Mode
                            <div className="space-y-2">
                              <div className="grid grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  value={editFormData.code || ''}
                                  onChange={(e) => handleEditFormChange('code', e.target.value.toUpperCase())}
                                  className="px-2 py-1 border rounded text-xs font-mono"
                                  placeholder="CODE"
                                />
                                <select
                                  value={editFormData.type || 'percentage'}
                                  onChange={(e) => handleEditFormChange('type', e.target.value)}
                                  className="px-2 py-1 border rounded text-xs"
                                >
                                  <option value="percentage">%</option>
                                  <option value="fixed">$</option>
                                </select>
                                <input
                                  type="number"
                                  value={editFormData.value || ''}
                                  onChange={(e) => handleEditFormChange('value', e.target.value)}
                                  className="px-2 py-1 border rounded text-xs"
                                  placeholder="Value"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="date"
                                  value={editFormData.validUntil || ''}
                                  onChange={(e) => handleEditFormChange('validUntil', e.target.value)}
                                  className="px-2 py-1 border rounded text-xs"
                                />
                                <label className="flex items-center space-x-1">
                                  <input
                                    type="checkbox"
                                    checked={editFormData.isOneTime || false}
                                    onChange={(e) => handleEditFormChange('isOneTime', e.target.checked)}
                                    className="w-3 h-3"
                                  />
                                  <span className="text-xs">One-time</span>
                                </label>
                              </div>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleSaveEditDiscount(code.code)}
                                  className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEditDiscount}
                                  className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-1 mb-1">
                                  <span className="font-mono font-medium">{code.code}</span>
                                  <span className={`px-1 py-0.5 rounded text-xs ${
                                    code.type === 'percentage' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    {code.type === 'percentage' ? `${code.value}%` : `$${code.value}`}
                                  </span>
                                  {code.isOneTime && (
                                    <span className="px-1 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">
                                      One-time
                                    </span>
                                  )}
                                  <span className={`px-1 py-0.5 rounded text-xs ${
                                    code.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {code.active ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                                {code.validUntil && (
                                  <div className="text-xs text-slate-500">
                                    Until {new Date(code.validUntil).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-1 ml-2">
                                <button
                                  onClick={() => handleStartEditDiscount(code.code)}
                                  className="p-1 text-blue-500 hover:text-blue-700"
                                  title="Edit code"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleToggleDiscountStatus(code.code)}
                                  disabled={isUpdatingDiscount || isDeletingDiscount}
                                  className={`px-1 py-0.5 text-xs rounded disabled:opacity-50 disabled:cursor-not-allowed ${
                                    code.active ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  }`}>
                                  {isUpdatingDiscount ? 'Updating...' : (code.active ? 'Deactivate' : 'Reactivate')}
                                </button>
                                <button
                                  onClick={() => handleDeleteDiscountCode(code.code)}
                                  disabled={isUpdatingDiscount || isDeletingDiscount}
                                  className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Delete code"
                                >
                                  {isDeletingDiscount ? <div className="w-3 h-3 border border-red-500 border-t-transparent rounded-full animate-spin"></div> : <X className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  {/* Add New Discount Code */}
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <h5 className="text-sm font-medium text-slate-700 mb-2">Add New Discount Code</h5>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={newDiscountCode}
                          onChange={(e) => setNewDiscountCode(e.target.value.toUpperCase())}
                          className="px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                          placeholder="CODE"
                        />
                        <select
                          value={newDiscountType}
                          onChange={(e) => setNewDiscountType(e.target.value)}
                          className="px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                        >
                          <option value="percentage">%</option>
                          <option value="fixed">$</option>
                        </select>
                        <input
                          type="number"
                          value={newDiscountValue}
                          onChange={(e) => setNewDiscountValue(e.target.value)}
                          className="px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                          placeholder="Value"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={newDiscountValidUntil}
                          onChange={(e) => setNewDiscountValidUntil(e.target.value)}
                          className="px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                          placeholder="Valid until"
                        />
                        <label className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={newDiscountIsOneTime}
                            onChange={(e) => setNewDiscountIsOneTime(e.target.checked)}
                            className="w-3 h-3 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-xs text-slate-600">One-time</span>
                        </label>
                      </div>
                      
                      <Button
                        onClick={handleAddDiscountCode}
                        size="sm"
                        className="w-full bg-green-500 hover:bg-green-600 text-xs py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!newDiscountCode || !newDiscountValue || isAddingDiscount}
                      >
                        {isAddingDiscount ? 'Adding...' : 'Add Code'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-200 p-6 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <Button 
                    onClick={handleSaveChanges} 
                    disabled={isSavingSettings}
                    className="bg-green-500 hover:bg-green-600 px-6 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingSettings ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    onClick={handleAddNewModule} 
                    disabled={isSavingSettings || isAddingModule}
                    className="bg-blue-500 hover:bg-blue-600 px-6 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add New Module
                  </Button>
                </div>
                <Button onClick={handleCloseModals} variant="outline" className="px-6">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add New Module Modal */}
      {showAddModuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Add New Module</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Module Name
                </label>
                <input
                  type="text"
                  value={newModuleName}
                  onChange={(e) => setNewModuleName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter module name"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price per Aircraft ($/month)
                </label>
                <input
                  type="number"
                  value={newModulePrice}
                  onChange={(e) => setNewModulePrice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter price"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button 
                onClick={handleSaveNewModule} 
                disabled={isAddingModule}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingModule ? 'Adding...' : 'Add Module'}
              </Button>
              <Button 
                onClick={handleCloseAddModuleModal} 
                variant="outline" 
                className="flex-1"
                disabled={isAddingModule}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-2xl font-bold text-slate-800">Quote Summary</h3>
              <button 
                onClick={() => setShowQuoteModal(false)}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {/* Company Info */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <img src={ammstroLogo} alt="AMMSTRO Logo" className="w-10 h-10" />
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">AMMSTRO SDN BHD</h4>
                    <p className="text-sm text-slate-600">Aviation Maintenance Management Solutions</p>
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  <p>Quote Date: {new Date().toLocaleDateString()}</p>
                  <p>Valid Until: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* Configuration Summary */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-slate-800 mb-3">Configuration</h5>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-700">Fleet Size:</span>
                    <span className="font-semibold">{aircraftCount} aircraft</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">Selected Modules:</span>
                    <span className="font-semibold">{Object.values(selectedModules).filter(Boolean).length} modules</span>
                  </div>
                </div>
              </div>
              
              {/* Pricing Breakdown */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-slate-800 mb-3">Pricing Breakdown</h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-700">Base Plan ({aircraftCount} aircraft)</span>
                    <span className="font-semibold">${(currentBasePricePerAircraft * aircraftCount).toLocaleString()}</span>
                  </div>
                  
                  {Object.entries(selectedModules).map(([module, isSelected]) => {
                    if (!isSelected || currentModulePrices[module] === 0) return null
                    
                    return (
                      <div key={module} className="flex justify-between items-center py-2">
                        <span className="text-slate-700">{dynamicModuleLabels[module]}</span>
                        <span className="font-semibold">${(currentModulePrices[module] * aircraftCount).toLocaleString()}</span>
                      </div>
                    )
                  })}
                  
                  {/* Subtotal */}
                  <div className="flex justify-between items-center py-2 border-t-2 border-slate-300">
                    <span className="font-semibold text-slate-700">Subtotal</span>
                    <span className="font-semibold text-slate-700">${calculateTotalPrice().toLocaleString()}</span>
                  </div>
                  
                  {/* Discount if applied */}
                  {appliedDiscount && getDiscountAmount() > 0 && (
                    <div className="flex justify-between items-center py-2">
                      <span className="font-semibold text-pink-600">Discount ({appliedDiscount.code})</span>
                      <span className="font-semibold text-pink-600">-${getDiscountAmount().toLocaleString()}</span>
                    </div>
                  )}
                  
                  {/* Final Total */}
                  <div className="flex justify-between items-center py-3 border-t-2 border-slate-300 text-lg">
                    <span className="font-bold text-slate-800">Total Monthly Cost</span>
                    <span className="font-bold text-orange-600">${calculateDiscountedPrice().toLocaleString()}</span>
                  </div>
                  
                  <div className="text-center text-sm text-slate-600">
                    ${(calculateDiscountedPrice() / aircraftCount).toFixed(0)} per aircraft per month
                  </div>
                  
                  {/* Savings message */}
                  {appliedDiscount && getDiscountAmount() > 0 && (
                    <div className="text-center text-sm text-green-600 font-medium mt-2">
                      You save ${getDiscountAmount().toLocaleString()} per month!
                    </div>
                  )}
                </div>
              </div>
              
              {/* Included Features */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-slate-800 mb-3">Included Features</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {basePlanFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Terms */}
              <div className="bg-slate-50 rounded-lg p-4 text-xs text-slate-600">
                <p className="mb-2"><strong>Terms & Conditions:</strong></p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>7-day free trial included with all plans</li>
                  <li>No setup fees or cancellation charges</li>
                  <li>Monthly billing with 30-day payment terms</li>
                  <li>24/7 technical support included</li>
                  <li>Pricing subject to final configuration and requirements</li>
                </ul>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex justify-between items-center p-6 border-t border-slate-200 bg-slate-50">
              <button 
                onClick={() => setShowQuoteModal(false)}
                className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Close
              </button>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 px-6"
                onClick={async () => {
                  try {
                    // Create minimal PDF document
                    const doc = new jsPDF();
                    
                    // Add company logo
                    const logoImg = new Image();
                    logoImg.crossOrigin = 'anonymous';
                    logoImg.src = ammstroLogo;
                    
                    logoImg.onload = () => {
                      // Add logo to PDF (smaller)
                      doc.addImage(logoImg, 'PNG', 20, 15, 20, 20);
                      
                      // Simple company header
                      doc.setFontSize(18);
                      doc.setTextColor(0, 0, 0);
                      doc.setFont('helvetica', 'bold');
                      doc.text('AMMSTRO', 45, 25);
                      
                      doc.setFontSize(10);
                      doc.setTextColor(100, 100, 100);
                      doc.setFont('helvetica', 'normal');
                      doc.text('Aircraft Maintenance Management System', 45, 30);
                      
                      // Simple separator line
                      doc.setDrawColor(0, 0, 0);
                      doc.setLineWidth(0.5);
                      doc.line(20, 38, 190, 38);
                      
                      // Quote title
                      doc.setFontSize(14);
                      doc.setTextColor(0, 0, 0);
                      doc.setFont('helvetica', 'bold');
                      doc.text('QUOTATION', 20, 50);
                      
                      // Quote details (compact)
                      let yPos = 60;
                      doc.setFontSize(9);
                      doc.setTextColor(0, 0, 0);
                      doc.setFont('helvetica', 'normal');
                      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos);
                      doc.text(`Quote ID: AMM-${Date.now().toString().slice(-6)}`, 100, yPos);
                      
                      yPos += 8;
                      const validDate = new Date();
                      validDate.setDate(validDate.getDate() + 30);
                      doc.text(`Valid Until: ${validDate.toLocaleDateString()}`, 20, yPos);
                      doc.text(`Aircraft Count: ${aircraftCount}`, 100, yPos);
                      
                      // Pricing table (minimal)
                      yPos += 20;
                      doc.setFontSize(12);
                      doc.setFont('helvetica', 'bold');
                      doc.text('Pricing', 20, yPos);
                      
                      yPos += 10;
                      // Table headers
                      doc.setFontSize(9);
                      doc.setFont('helvetica', 'bold');
                      doc.text('Service', 20, yPos);
                      doc.text('Unit Price', 120, yPos);
                      doc.text('Total', 160, yPos);
                      
                      // Line under headers
                      doc.setLineWidth(0.3);
                      doc.line(20, yPos + 2, 190, yPos + 2);
                      
                      yPos += 8;
                      
                      // Base price row
                      doc.setFont('helvetica', 'normal');
                      doc.text('Base Maintenance System', 20, yPos);
                      doc.text(`$${currentBasePricePerAircraft.toLocaleString()}`, 120, yPos);
                      doc.text(`$${(currentBasePricePerAircraft * aircraftCount).toLocaleString()}`, 160, yPos);
                      yPos += 6;
                      
                      // Selected modules pricing (compact)
                      Object.entries(selectedModules).forEach(([key, value]) => {
                        if (value && key !== 'basicMaintenance') {
                          const moduleName = dynamicModuleLabels[key] || key;
                          const modulePrice = currentModulePrices[key] || 0;
                          doc.text(moduleName, 20, yPos);
                          doc.text(`$${modulePrice.toLocaleString()}`, 120, yPos);
                          doc.text(`$${(modulePrice * aircraftCount).toLocaleString()}`, 160, yPos);
                          yPos += 6;
                        }
                      });
                      
                      // Subtotal and discount calculation
                      const subtotal = calculateTotalPrice();
                      const discountAmount = getDiscountAmount();
                      const finalTotal = calculateDiscountedPrice();
                      
                      // Subtotal line
                      yPos += 5;
                      doc.setLineWidth(0.3);
                      doc.line(120, yPos - 2, 190, yPos - 2);
                      
                      doc.setFontSize(10);
                      doc.setFont('helvetica', 'normal');
                      doc.text(`Subtotal: $${subtotal.toLocaleString()}`, 120, yPos + 5);
                      
                      // Show discount if applied
                      if (appliedDiscount && discountAmount > 0) {
                        yPos += 12; // Increased spacing
                        doc.setTextColor(220, 38, 127); // Pink color for discount
                        doc.text(`Discount (${appliedDiscount.code}): -$${discountAmount.toLocaleString()}`, 120, yPos);
                        doc.setTextColor(0, 0, 0); // Reset to black
                      }
                      
                      // Final total line
                      yPos += 8;
                      doc.setLineWidth(0.5);
                      doc.line(120, yPos - 2, 190, yPos - 2);
                      
                      doc.setFontSize(11);
                      doc.setFont('helvetica', 'bold');
                      doc.text(`Total Monthly: $${finalTotal.toLocaleString()}`, 120, yPos + 5);
                      
                      doc.setFontSize(8);
                      doc.setFont('helvetica', 'normal');
                      doc.text(`($${(finalTotal / aircraftCount).toFixed(0)} per aircraft/month)`, 120, yPos + 12);
                      
                      // Terms & Conditions (two lines)
                        yPos += 15;
                        doc.setFontSize(10);
                        doc.setFont('helvetica', 'bold');
                        doc.text('Terms & Conditions', 20, yPos);
                        
                        yPos += 8;
                        doc.setFontSize(8);
                        doc.setFont('helvetica', 'normal');
                        doc.text('Includes 7-day free trial, monthly billing with 30-day payment terms, 24/7 support, no setup fees.', 20, yPos);
                        yPos += 5;
                        doc.text('Implementation: 2-4 weeks, quote valid 30 days.', 20, yPos);
                       
                       // Footer
                       yPos += 15;
                       doc.setLineWidth(0.3);
                       doc.line(20, yPos, 190, yPos);
                       
                       yPos += 8;
                       doc.setFontSize(8);
                       doc.setFont('helvetica', 'normal');
                       doc.text('Contact: sales@ammstro.com | www.ammstro.com', 20, yPos);
                      
                      // Save the PDF
                      doc.save(`AMMSTRO-Quote-${Date.now()}.pdf`);
                      
                      // Close modal after download
                      setShowQuoteModal(false);
                    };
                    
                    // Fallback if logo fails to load
                    logoImg.onerror = () => {
                      console.warn('Logo failed to load, generating PDF without logo');
                      
                      // Generate complete PDF without logo
                      doc.setFontSize(18);
                      doc.setTextColor(0, 0, 0);
                      doc.setFont('helvetica', 'bold');
                      doc.text('AMMSTRO', 20, 25);
                      
                      doc.setFontSize(10);
                      doc.setTextColor(100, 100, 100);
                      doc.setFont('helvetica', 'normal');
                      doc.text('Aircraft Maintenance Management System', 20, 30);
                      
                      // Simple separator line
                      doc.setDrawColor(0, 0, 0);
                      doc.setLineWidth(0.5);
                      doc.line(20, 38, 190, 38);
                      
                      // Quote title
                      doc.setFontSize(14);
                      doc.setTextColor(0, 0, 0);
                      doc.setFont('helvetica', 'bold');
                      doc.text('QUOTATION', 20, 50);
                      
                      // Quote details (compact)
                      let yPos = 60;
                      doc.setFontSize(9);
                      doc.setTextColor(0, 0, 0);
                      doc.setFont('helvetica', 'normal');
                      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos);
                      doc.text(`Quote ID: AMM-${Date.now().toString().slice(-6)}`, 100, yPos);
                      
                      yPos += 8;
                      const validDate = new Date();
                      validDate.setDate(validDate.getDate() + 30);
                      doc.text(`Valid Until: ${validDate.toLocaleDateString()}`, 20, yPos);
                      doc.text(`Aircraft Count: ${aircraftCount}`, 100, yPos);
                      
                      // Pricing table (minimal)
                      yPos += 20;
                      doc.setFontSize(12);
                      doc.setFont('helvetica', 'bold');
                      doc.text('Pricing', 20, yPos);
                      
                      yPos += 10;
                      // Table headers
                      doc.setFontSize(9);
                      doc.setFont('helvetica', 'bold');
                      doc.text('Service', 20, yPos);
                      doc.text('Unit Price', 120, yPos);
                      doc.text('Total', 160, yPos);
                      
                      yPos += 8;
                      doc.setFont('helvetica', 'normal');
                      
                      // Base maintenance (always included)
                      doc.text('Base Maintenance & Scheduling', 20, yPos);
                      doc.text(`$${currentBasePricePerAircraft.toLocaleString()}`, 120, yPos);
                      doc.text(`$${(currentBasePricePerAircraft * aircraftCount).toLocaleString()}`, 160, yPos);
                      yPos += 6;
                      
                      // Selected modules
                      Object.entries(selectedModules).forEach(([key, value]) => {
                        if (value && key !== 'basicMaintenance') {
                          const moduleName = dynamicModuleLabels[key] || key;
                          const modulePrice = currentModulePrices[key] || 0;
                          doc.text(moduleName, 20, yPos);
                          doc.text(`$${modulePrice.toLocaleString()}`, 120, yPos);
                          doc.text(`$${(modulePrice * aircraftCount).toLocaleString()}`, 160, yPos);
                          yPos += 6;
                        }
                      });
                      
                      // Subtotal and discount calculation
                      const subtotal = calculateTotalPrice();
                      const discountAmount = getDiscountAmount();
                      const finalTotal = calculateDiscountedPrice();
                      
                      // Subtotal line
                      yPos += 5;
                      doc.setLineWidth(0.3);
                      doc.line(120, yPos - 2, 190, yPos - 2);
                      
                      doc.setFontSize(10);
                      doc.setFont('helvetica', 'normal');
                      doc.text(`Subtotal: $${subtotal.toLocaleString()}`, 120, yPos + 5);
                      
                      // Show discount if applied
                       if (appliedDiscount && discountAmount > 0) {
                         yPos += 12; // Increased spacing
                         doc.setTextColor(220, 38, 127); // Pink color for discount
                         doc.text(`Discount (${appliedDiscount.code}): -$${discountAmount.toLocaleString()}`, 120, yPos);
                         doc.setTextColor(0, 0, 0); // Reset to black
                       }
                      
                      // Final total line
                      yPos += 8;
                      doc.setLineWidth(0.5);
                      doc.line(120, yPos - 2, 190, yPos - 2);
                      
                      doc.setFontSize(11);
                      doc.setFont('helvetica', 'bold');
                      doc.text(`Total Monthly: $${finalTotal.toLocaleString()}`, 120, yPos + 5);
                      
                      doc.setFontSize(8);
                      doc.setFont('helvetica', 'normal');
                      doc.text(`($${(finalTotal / aircraftCount).toFixed(0)} per aircraft/month)`, 120, yPos + 12);
                      
                      // Terms & Conditions
                      yPos += 15;
                      doc.setFontSize(10);
                      doc.setFont('helvetica', 'bold');
                      doc.text('Terms & Conditions', 20, yPos);
                      
                      yPos += 8;
                      doc.setFontSize(8);
                      doc.setFont('helvetica', 'normal');
                      doc.text('Includes 7-day free trial, monthly billing with 30-day payment terms, 24/7 support, no setup fees.', 20, yPos);
                      yPos += 5;
                      doc.text('Implementation: 2-4 weeks, quote valid 30 days.', 20, yPos);
                     
                     // Footer
                     yPos += 15;
                     doc.setLineWidth(0.3);
                     doc.line(20, yPos, 190, yPos);
                     
                     yPos += 8;
                     doc.setFontSize(8);
                     doc.setFont('helvetica', 'normal');
                     doc.text('Contact: sales@ammstro.com | www.ammstro.com', 20, yPos);
                      
                      doc.save(`AMMSTRO-Quote-${Date.now()}.pdf`);
                      setShowQuoteModal(false);
                    };
                    
                  } catch (error) {
                    console.error('Error generating PDF:', error);
                    alert('Error generating PDF. Please try again.');
                  }
                }}
              >
                Download PDF
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState('hero')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [isGetStartedModalOpen, setIsGetStartedModalOpen] = useState(false)
  
  // Access code state for pricing section
  const [isPricingAccessGranted, setIsPricingAccessGranted] = useState(false)
  const [isAccessCodeModalOpen, setIsAccessCodeModalOpen] = useState(false)
  const [accessCodeInput, setAccessCodeInput] = useState('')
  const [accessCodeError, setAccessCodeError] = useState('')
  
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

  // Access code handling functions
  const handlePricingClick = (e) => {
    e.preventDefault()
    if (!isPricingAccessGranted) {
      setIsAccessCodeModalOpen(true)
      setAccessCodeInput('')
      setAccessCodeError('')
    } else {
      // Scroll to pricing section if access is granted
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleAccessCodeSubmit = () => {
    if (accessCodeInput === '007') {
      setIsPricingAccessGranted(true)
      setIsAccessCodeModalOpen(false)
      setAccessCodeError('')
      // Scroll to pricing section after successful authentication
      setTimeout(() => {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      setAccessCodeError('Invalid access code. Please try again.')
    }
  }

  const handleAccessCodeKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAccessCodeSubmit()
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
              {['Home', 'Product', 'How it Works', 'Features', 'Pricing', 'Company', 'FAQ'].map((item, index) => {
                const sectionId = item === 'Home' ? 'hero' : item.toLowerCase().replace(/\s+/g, '-')
                
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
                  className="flex justify-center px-4"
                >
                  <Badge className="bg-sky-100 text-sky-700 border-sky-300 px-3 py-2 cursor-pointer shadow-sm text-xs sm:text-sm text-center max-w-full break-words leading-relaxed sm:leading-normal min-h-[3rem] sm:min-h-[auto] flex items-center justify-center">
                    <span className="whitespace-normal max-w-[280px] sm:max-w-none">
                      {announcements[currentAnnouncementIndex]}
                    </span>
                  </Badge>
                </motion.div>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-6 mb-6 text-slate-800 text-center lg:text-left px-4 lg:px-0">
                  AI-Powered <span className="bg-gradient-to-r from-sky-600 to-orange-500 bg-clip-text text-transparent">Aviation</span> Maintenance
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 mb-8 text-center lg:text-left px-4 lg:px-0 leading-relaxed">
                  Revolutionize your aircraft maintenance operations with our AI-powered platform. 
                  Reduce downtime, increase efficiency, and enhance safety.
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center px-4 lg:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button 
                  className="bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg w-full sm:w-auto"
                  onClick={() => setIsGetStartedModalOpen(true)}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg w-full sm:w-auto"
                  onClick={() => setIsVideoModalOpen(true)}
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Watch Demo
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
                <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-4 text-center">Powering Commercial Aviation Maintenance</h3>
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
              className="mt-8 px-4 lg:px-0"
            >
              <div className="bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
                <div className="bg-slate-900 px-4 sm:px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-slate-400 text-xs sm:text-sm">AMMSTRO Dashboard</div>
                  <div className="text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white text-base sm:text-lg font-bold">Fleet Overview</h3>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Live Data</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                    <motion.div 
                      className="bg-sky-500/10 border border-sky-500/20 rounded-lg p-3 sm:p-4"
                      whileHover={{ scale: 1.03 }}
                    >
                      <div className="text-sky-400 mb-2 text-xs sm:text-sm font-medium">Fleet Availability</div>
                      <div className="text-xl sm:text-2xl font-bold text-white">86%</div>
                      <div className="text-sky-400/70 text-xs mt-1">↑ 2.1% from last month</div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 sm:p-4"
                      whileHover={{ scale: 1.03 }}
                    >
                      <div className="text-emerald-400 mb-2 text-xs sm:text-sm font-medium">Cost Reduction</div>
                      <div className="text-xl sm:text-2xl font-bold text-white">35%</div>
                      <div className="text-emerald-400/70 text-xs mt-1">↑ 5% from last quarter</div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 sm:p-4"
                      whileHover={{ scale: 1.03 }}
                    >
                      <div className="text-orange-400 mb-2 text-xs sm:text-sm font-medium">Active Projects</div>
                      <div className="text-xl sm:text-2xl font-bold text-white">72</div>
                      <div className="text-orange-400/70 text-xs mt-1">↑ 12 new this month</div>
                    </motion.div>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-3 sm:p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-medium text-sm sm:text-base">Maintenance AI Assistant</h4>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Active</Badge>
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
                          <div className={`rounded-lg p-2 sm:p-3 text-slate-300 text-xs sm:text-sm max-w-xs ${
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
                    
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder="Ask about maintenance..." 
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isTyping}
                        className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-white placeholder-slate-400 flex-1 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-50"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        disabled={isTyping || !currentInput.trim()}
                        className="bg-sky-500 hover:bg-sky-600 h-8 w-8 sm:h-9 sm:w-9 p-0 disabled:opacity-50 flex-shrink-0"
                      >
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
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


        </div>
      </section>

      {/* Pricing Section */}
      {isPricingAccessGranted ? (
        <section id="pricing" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-orange-500/20 text-orange-500 border-orange-500/30">Dynamic Pricing Calculator</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Calculate your custom
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  aviation maintenance plan
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Customize your plan based on fleet size and required modules. Get real-time pricing updates as you adjust your configuration.
              </p>
            </motion.div>

            {/* Dynamic Pricing Calculator */}
            <PricingCalculator />

            {/* Additional Info */}
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">All Plans Include</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="flex items-start">
                    <Shield className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Security & Compliance</h4>
                      <p className="text-slate-600 text-sm">SOC 2, ISO 27001 certified with aviation regulatory compliance</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Globe className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Global Access</h4>
                      <p className="text-slate-600 text-sm">Access your data anywhere with 99.9% uptime guarantee</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="w-6 h-6 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Team Collaboration</h4>
                      <p className="text-slate-600 text-sm">Unlimited users with role-based access controls</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <p className="text-slate-600 text-sm">
                    <strong>30-day free trial</strong> • No setup fees • Cancel anytime • Migration assistance included
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      ) : (
        <section id="pricing" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-orange-500/20 text-orange-500 border-orange-500/30">Custom Pricing Solutions</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Get a personalized quote for
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  your aviation maintenance needs
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Every aviation operation is unique. Our pricing is tailored to your specific fleet size, operational requirements, and maintenance complexity. Connect with our aviation experts to discover the perfect solution for your organization.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
              {/* Left Column - Contact Information */}
              <motion.div
                className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 flex flex-col"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Why Choose Custom Pricing?</h3>
                <div className="space-y-4 flex-grow">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Fleet-Specific Configuration</h4>
                      <p className="text-slate-600 text-sm">Pricing based on your exact aircraft types, quantities, and operational patterns</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Modular Solutions</h4>
                      <p className="text-slate-600 text-sm">Pay only for the modules you need - from basic tracking to advanced predictive analytics</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Volume Discounts</h4>
                      <p className="text-slate-600 text-sm">Significant savings for larger fleets and multi-year commitments</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Implementation Support</h4>
                      <p className="text-slate-600 text-sm">Dedicated onboarding, training, and migration assistance included</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Ready to Get Started */}
              <motion.div
                className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 p-8 flex flex-col"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold text-slate-800 mb-4">Ready to Get Started?</h3>
                <p className="text-slate-600 mb-6 flex-grow">
                  Schedule a consultation with our aviation maintenance experts. We'll analyze your current operations and provide a detailed proposal within 24 hours.
                </p>
                <div className="mt-auto">
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 w-full"
                    onClick={() => window.open('mailto:sales@ammstro.com?subject=Pricing Inquiry&body=Hello, I would like to learn more about AMMSTRO pricing for my aviation maintenance needs.', '_blank')}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Sales Team
                  </Button>
                  
                  {/* Hidden access code trigger */}
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setIsAccessCodeModalOpen(true)}
                      className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                      style={{ opacity: 0.1 }}
                    >
                      •
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom Section - Trust Indicators */}
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Trusted by Aviation Leaders Worldwide</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
                  <div className="flex items-start">
                    <Shield className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Security & Compliance</h4>
                      <p className="text-slate-600 text-sm">SOC 2, ISO 27001 certified with full aviation regulatory compliance</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Globe className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Global Availability</h4>
                      <p className="text-slate-600 text-sm">24/7 access with 99.9% uptime guarantee and worldwide support</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="w-6 h-6 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Team Collaboration</h4>
                      <p className="text-slate-600 text-sm">Unlimited users with advanced role-based access controls</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-6 h-6 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">Quick Implementation</h4>
                      <p className="text-slate-600 text-sm">30-day free trial with full migration assistance and training</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <p className="text-slate-600 text-sm">
                    <strong>Risk-free evaluation</strong> • No setup fees • Cancel anytime • Dedicated customer success manager
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

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

      {/* Access Code Modal */}
      {isAccessCodeModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setIsAccessCodeModalOpen(false)}
        >
          <motion.div
            className="relative w-full max-w-md mx-4 bg-white rounded-lg overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsAccessCodeModalOpen(false)}
              className="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Modal Content */}
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Enter Access Code</h3>
                <p className="text-slate-600">Please enter the access code to view pricing information.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={accessCodeInput}
                    onChange={(e) => setAccessCodeInput(e.target.value)}
                    onKeyPress={handleAccessCodeKeyPress}
                    placeholder="Enter access code"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    autoFocus
                  />
                  {accessCodeError && (
                    <p className="text-red-500 text-sm mt-2">{accessCodeError}</p>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={() => setIsAccessCodeModalOpen(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAccessCodeSubmit}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

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

      {/* Get Started Modal */}
      {isGetStartedModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setIsGetStartedModalOpen(false)}
        >
          <motion.div
            className="relative w-full max-w-6xl mx-4 bg-white rounded-lg overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            style={{ height: '90vh' }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsGetStartedModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white p-2">
              <p className="text-sky-100 text-sm">Begin your aviation maintenance transformation</p>
            </div>
            
            {/* Website Container */}
            <div className="relative w-full h-full">
              <iframe
                className="w-full h-full"
                src="https://getstarted.ammstro.com"
                title="AMMSTRO Get Started"
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                style={{ height: 'calc(90vh - 40px)' }}
              ></iframe>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default App

