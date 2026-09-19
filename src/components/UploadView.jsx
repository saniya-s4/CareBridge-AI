import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Calendar,
  FileType,
  Loader2,
  FileCode,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Image as ImageIcon,
  X,
  Eye,
  Stethoscope
} from 'lucide-react';
import { DEMO_REPORTS } from '../data/demoReports';

export default function UploadView({ onAnalyze, isAnalyzing, error, onClearError }) {
  const [file, setFile] = useState(null);
  const [reportText, setReportText] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [selectedDemoId, setSelectedDemoId] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Multimodal image state
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMimeType, setImageMimeType] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const fileInputRef = useRef(null);

  // File selection handler
  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    onClearError?.();
    const fileName = selectedFile.name.toLowerCase();
    const isImg = /\.(png|jpe?g|webp|gif|bmp)$/i.test(fileName) || (selectedFile.type && selectedFile.type.startsWith('image/'));
    const isText = fileName.endsWith('.txt') || fileName.endsWith('.csv');

    if (!isImg && !isText && !fileName.endsWith('.pdf')) {
      alert('Please upload an image (.png, .jpg, .webp), text document (.txt), or PDF.');
      return;
    }

    setFile({
      name: selectedFile.name,
      type: selectedFile.type || (isImg ? 'image/jpeg' : 'document'),
      size: (selectedFile.size / 1024).toFixed(1) + ' KB',
      isImage: isImg
    });

    if (isImg) {
      // Convert image to Gemini-compatible base64 format
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        // Parse MIME type and pure base64
        const mimeMatch = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
        const mime = mimeMatch ? mimeMatch[1] : (selectedFile.type || 'image/jpeg');
        const base64Data = dataUrl.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

        setImageBase64(base64Data);
        setImageMimeType(mime);
        setImagePreviewUrl(dataUrl);

        if (!reportTitle) {
          setReportTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
        }
      };
      reader.readAsDataURL(selectedFile);
    } else if (isText) {
      // Plain text file
      setImageBase64(null);
      setImageMimeType(null);
      setImagePreviewUrl(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        setReportText(e.target.result || '');
        if (!reportTitle) {
          setReportTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
        }
      };
      reader.readAsText(selectedFile);
    } else {
      // PDF or other documents
      setImageBase64(null);
      setImageMimeType(null);
      setImagePreviewUrl(null);
      const notice = `[Document: ${selectedFile.name}]\nSpecimen Date: ${new Date().toISOString().split('T')[0]}\nPlease paste the lab values or clinical text below if not using direct image extraction.`;
      setReportText(notice);
      if (!reportTitle) {
        setReportTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Load one of the two fictional demo reports
  const loadDemoReport = (demoId) => {
    onClearError?.();
    const demo = DEMO_REPORTS.find(d => d.id === demoId);
    if (!demo) return;

    setSelectedDemoId(demoId);
    setImageBase64(null);
    setImageMimeType(null);
    setImagePreviewUrl(null);
    setFile({
      name: `${demo.title}.txt`,
      type: 'Fictional Demo Report',
      size: '1.8 KB',
      isImage: false
    });
    setReportTitle(demo.title);
    setReportDate(demo.date);
    setReportText(demo.rawText);
  };

  // Load sample medical image directly for testing Gemini Vision
  const loadSampleImage = async (url, title, date, docType) => {
    onClearError?.();
    setSelectedDemoId(url);
    try {
      const resp = await fetch(url);
      const blob = await resp.blob();
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const mimeMatch = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const base64Data = dataUrl.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

        setImageBase64(base64Data);
        setImageMimeType(mime);
        setImagePreviewUrl(dataUrl);
        setReportText('');
        setFile({
          name: url.split('/').pop(),
          type: mime,
          size: (blob.size / 1024).toFixed(1) + ' KB',
          isImage: true
        });
        setReportTitle(title);
        setReportDate(date);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Failed to load sample image:', err);
    }
  };

  // Clear loaded image
  const handleClearImage = () => {
    setImageBase64(null);
    setImageMimeType(null);
    setImagePreviewUrl(null);
    if (file?.isImage) {
      setFile(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasImage = Boolean(imageBase64);
    const hasText = Boolean(reportText.trim());

    if (!hasImage && !hasText) {
      alert('Please provide a medical report image, document file, or paste text to analyze.');
      return;
    }

    onAnalyze({
      imageBase64,
      imageMimeType,
      detectedFileType: file?.type || (hasImage ? imageMimeType : 'text/plain'),
      reportText,
      reportTitle: reportTitle || (hasImage ? 'Medical Report Image' : 'Medical Laboratory Report'),
      reportDate: reportDate || 'Date unavailable'
    });
  };

  const handleResetForm = () => {
    setFile(null);
    setReportText('');
    setReportTitle('');
    setReportDate('');
    setSelectedDemoId('');
    setImageBase64(null);
    setImageMimeType(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClearError?.();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Upload & Analyze Medical Document
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Supports image-based medical reports, prescriptions, clinical notes, and text fallback with Gemini Multimodal Vision.
        </p>
      </div>

      {/* Demo Selector Quick Action */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 border border-teal-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-teal-950">
                  Instant Hackathon Demo Mode
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300">
                  Fictional Data
                </span>
              </div>
              <p className="text-xs text-teal-800/80 mt-0.5">
                Test the complete flow immediately with consecutive baseline and follow-up lab panels.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => loadSampleImage('/test-samples/lab_report.jpg', 'MetroHealth Laboratory Report (Image)', '2025-10-14')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                selectedDemoId === '/test-samples/lab_report.jpg'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'bg-white text-teal-900 border-teal-300 hover:bg-teal-100/50'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Sample Lab Image
            </button>
            <button
              type="button"
              onClick={() => loadSampleImage('/test-samples/prescription.jpg', 'Valley Clinic Prescription (Image)', '2025-11-05')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                selectedDemoId === '/test-samples/prescription.jpg'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-indigo-900 border-indigo-300 hover:bg-indigo-100/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Sample Rx Image
            </button>
            <button
              type="button"
              onClick={() => loadDemoReport('demo-report-1')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                selectedDemoId === 'demo-report-1'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'bg-white text-teal-800 border-teal-300 hover:bg-teal-100/50'
              }`}
            >
              Demo 1: Baseline Panel
            </button>
            <button
              type="button"
              onClick={() => loadDemoReport('demo-report-2')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                selectedDemoId === 'demo-report-2'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'bg-white text-teal-800 border-teal-300 hover:bg-teal-100/50'
              }`}
            >
              Demo 2: Follow-up Panel
            </button>
          </div>
        </div>
      </div>

      {/* Error alert if any */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-semibold">Analysis Notice:</strong> {error}
          </div>
          <button
            onClick={onClearError}
            className="text-rose-600 hover:text-rose-800 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
        {/* Drag & Drop File Zone */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            1. Select Medical Document (Image, PDF, or Text)
          </label>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-teal-500 bg-teal-50/50 scale-[0.99]'
                : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.txt,.csv"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-2 border border-teal-100">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Click to browse or drag & drop medical report image / document
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports Medical Images (PNG, JPG, WebP), Text files (.txt), and Lab PDFs
            </p>
          </div>
        </div>

        {/* Multimodal Image Preview & Conversion Confirmation */}
        {imagePreviewUrl && (
          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-teal-200 shrink-0 bg-white">
                <img
                  src={imagePreviewUrl}
                  alt="Medical report preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{file?.name || 'medical_image.png'}</span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                    Multimodal Ready
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  MIME: <span className="font-mono">{imageMimeType}</span> • {file?.size || 'Image'}
                </p>
                <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Image converted to Gemini-compatible Base64 payload
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearImage}
              className="px-3 py-1.5 rounded-xl border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 transition"
            >
              <X className="w-3.5 h-3.5" />
              Remove Image
            </button>
          </div>
        )}

        {/* Non-image File Preview */}
        {file && !imagePreviewUrl && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{file.name}</p>
                <p className="text-[11px] text-slate-500">
                  {file.type} • {file.size}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg">
              Loaded & Ready
            </span>
          </div>
        )}

        {/* Metadata Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Report Title / Description (Optional)
            </label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder="e.g. Complete Blood Count & Metabolic Panel"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Report Date (Optional)
            </label>
            <div className="relative">
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Text Paste Fallback / Notes */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Text-Paste Fallback or Supplementary Clinical Notes
            </label>
            <span className="text-[11px] text-slate-500">
              {imageBase64 ? 'Optional supplementary notes' : 'Required if no image is uploaded'}
            </span>
          </div>
          <textarea
            rows={5}
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder={
              imageBase64
                ? 'Optional notes about this image (e.g. doctor name, specific symptoms, or test date)...'
                : `Paste your lab results or clinical notes here...\nExample:\n- Hemoglobin: 11.2 g/dL (Reference: 12.0 - 16.0 g/dL) [LOW]\n- Fasting Blood Glucose: 108 mg/dL (Reference: 70 - 99 mg/dL) [HIGH]\n- Serum Creatinine: 0.95 mg/dL (Reference: 0.60 - 1.20 mg/dL) [NORMAL]`
            }
            className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
          />
        </div>

        {/* Privacy Note */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <p>
            <strong className="font-semibold text-slate-800">Privacy Notice:</strong> This hackathon prototype processes data directly with your configured Gemini API key and stores reports locally in your browser. Avoid uploading sensitive personal identifying numbers.
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleResetForm}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Form
          </button>

          <button
            type="submit"
            disabled={isAnalyzing || (!imageBase64 && !reportText.trim())}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 ${
              isAnalyzing || (!imageBase64 && !reportText.trim())
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20 hover:scale-[1.01]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Document with Gemini Vision AI...
              </>
            ) : (
              <>
                Analyze Medical Document
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
