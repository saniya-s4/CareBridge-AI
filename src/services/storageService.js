// Storage Service for CareBridge AI
// Handles local browser persistence without external database

import { DEMO_REPORTS } from '../data/demoReports.js';

const STORAGE_KEYS = {
  REPORTS: 'carebridge_reports',
  ACTIVE_REPORT_ID: 'carebridge_active_report_id',
  DOCTOR_NOTES: 'carebridge_doctor_notes',
  CHECKED_QUESTIONS: 'carebridge_checked_questions',
  CUSTOM_API_KEY: 'carebridge_gemini_api_key',
  HAS_INITIALIZED: 'carebridge_has_initialized'
};

export const storageService = {
  // Get all saved reports
  getReports() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (!stored) {
        // First-time load: initialize with the two fictional demo reports
        this.saveReports(DEMO_REPORTS);
        localStorage.setItem(STORAGE_KEYS.HAS_INITIALIZED, 'true');
        return DEMO_REPORTS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading reports from localStorage:', e);
      return DEMO_REPORTS;
    }
  },

  // Save all reports
  saveReports(reports) {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.error('Error saving reports to localStorage:', e);
    }
  },

  // Add a new analyzed report
  addReport(report) {
    const existing = this.getReports();
    // Check if ID exists, update or prepend
    const index = existing.findIndex(r => r.id === report.id);
    let updated;
    if (index >= 0) {
      updated = [...existing];
      updated[index] = report;
    } else {
      updated = [report, ...existing];
    }
    this.saveReports(updated);
    return updated;
  },

  // Delete a report by ID
  deleteReport(id) {
    const existing = this.getReports();
    const updated = existing.filter(r => r.id !== id);
    this.saveReports(updated);
    return updated;
  },

  // Reset to default demo reports
  resetToDemo() {
    this.saveReports(DEMO_REPORTS);
    localStorage.removeItem(STORAGE_KEYS.DOCTOR_NOTES);
    localStorage.removeItem(STORAGE_KEYS.CHECKED_QUESTIONS);
    return DEMO_REPORTS;
  },

  // Clear all data
  clearAll() {
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_REPORT_ID);
    localStorage.removeItem(STORAGE_KEYS.DOCTOR_NOTES);
    localStorage.removeItem(STORAGE_KEYS.CHECKED_QUESTIONS);
    return [];
  },

  // Doctor visit prep user notes
  getDoctorNotes() {
    return localStorage.getItem(STORAGE_KEYS.DOCTOR_NOTES) || '';
  },

  saveDoctorNotes(notes) {
    localStorage.setItem(STORAGE_KEYS.DOCTOR_NOTES, notes);
  },

  // Checked questions for visit
  getCheckedQuestions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHECKED_QUESTIONS);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  saveCheckedQuestions(checkedMap) {
    localStorage.setItem(STORAGE_KEYS.CHECKED_QUESTIONS, JSON.stringify(checkedMap));
  },

  // Optional client-side API Key override (kept strictly in browser)
  getCustomApiKey() {
    if (typeof localStorage === 'undefined') return '';
    return localStorage.getItem(STORAGE_KEYS.CUSTOM_API_KEY) || '';
  },

  saveCustomApiKey(key) {
    if (typeof localStorage === 'undefined') return;
    if (!key) {
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_API_KEY);
    } else {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_API_KEY, key.trim());
    }
  }
};
