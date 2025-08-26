// Firestore service functions for admin settings and discount codes
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebase.js';

// Admin Settings Functions
export const adminSettingsService = {
  // Get all admin settings
  async getSettings() {
    try {
      const settingsRef = doc(db, 'admin-settings', 'config');
      const settingsSnap = await getDoc(settingsRef);
      
      if (settingsSnap.exists()) {
        return settingsSnap.data();
      } else {
        // Return default settings if none exist
        const defaultSettings = {
          modulePrices: {
            basicMaintenance: 0,
            predictiveAnalytics: 250,
            realTimeMonitoring: 350,
            advancedReporting: 200,
            apiIntegrations: 300,
            prioritySupport: 150,
            training: 400,
            customIntegrations: 750,
            dedicatedManager: 1000,
            premiumSupport: 500
          },
          moduleVisibility: {
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
          },
          moduleLabels: {
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
        };
        
        // Save default settings to Firestore
        await this.saveSettings(defaultSettings);
        return defaultSettings;
      }
    } catch (error) {
      console.error('Error getting admin settings:', error);
      throw error;
    }
  },

  // Save admin settings
  async saveSettings(settings) {
    try {
      console.log('🔥 Firebase saveSettings called with:', settings);
      const settingsRef = doc(db, 'admin-settings', 'config');
      console.log('📍 Document reference created:', settingsRef.path);
      await setDoc(settingsRef, settings, { merge: true });
      console.log('✅ Firebase setDoc completed successfully!');
    } catch (error) {
      console.error('❌ Error saving admin settings:', error);
      throw error;
    }
  },

  // Update specific setting
  async updateSetting(field, value) {
    try {
      const settingsRef = doc(db, 'admin-settings', 'config');
      await updateDoc(settingsRef, { [field]: value });
    } catch (error) {
      console.error('Error updating admin setting:', error);
      throw error;
    }
  },

  // Listen to settings changes in real-time
  onSettingsChange(callback) {
    const settingsRef = doc(db, 'admin-settings', 'config');
    return onSnapshot(settingsRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    });
  }
};

// Discount Codes Functions
export const discountCodesService = {
  // Get all discount codes
  async getDiscountCodes() {
    try {
      const codesRef = collection(db, 'discount-codes');
      const codesSnap = await getDocs(codesRef);
      const codes = [];
      
      codesSnap.forEach((doc) => {
        codes.push({ id: doc.id, ...doc.data() });
      });
      
      return codes;
    } catch (error) {
      console.error('Error getting discount codes:', error);
      throw error;
    }
  },

  // Add new discount code
  async addDiscountCode(code) {
    try {
      const codeRef = doc(db, 'discount-codes', code.code);
      await setDoc(codeRef, {
        code: code.code,
        type: code.type,
        value: code.value,
        active: code.active,
        isOneTime: code.isOneTime || false,
        validUntil: code.validUntil || null,
        description: code.description || '',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error adding discount code:', error);
      throw error;
    }
  },

  // Update discount code
  async updateDiscountCode(codeId, updates) {
    try {
      console.log('🔥 Firebase updateDiscountCode called with:', { codeId, updates });
      const codeRef = doc(db, 'discount-codes', codeId);
      console.log('📍 Document reference created:', codeRef.path);
      
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      console.log('📝 Update data prepared:', updateData);
      
      await updateDoc(codeRef, updateData);
      console.log('✅ Firebase updateDoc completed successfully!');
    } catch (error) {
      console.error('❌ Error updating discount code:', error);
      throw error;
    }
  },

  // Delete discount code
  async deleteDiscountCode(codeId) {
    try {
      const codeRef = doc(db, 'discount-codes', codeId);
      await deleteDoc(codeRef);
    } catch (error) {
      console.error('Error deleting discount code:', error);
      throw error;
    }
  },

  // Listen to discount codes changes in real-time
  onDiscountCodesChange(callback) {
    const codesRef = collection(db, 'discount-codes');
    return onSnapshot(codesRef, (snapshot) => {
      const codes = [];
      snapshot.forEach((doc) => {
        codes.push({ id: doc.id, ...doc.data() });
      });
      callback(codes);
    });
  }
};