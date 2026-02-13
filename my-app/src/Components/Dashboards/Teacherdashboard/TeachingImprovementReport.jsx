import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TeachingImprovementReport = ({
  teacherName,
  positive_percent,
  neutral_percent,
  negative_percent,
  aoi_points,
  improvementAreas,
  recommendations,
  summary,
  totalFeedback,
}) => {
  const reportRef = useRef();

  const handleDownloadPdf = async () => {
    try {
      const container = reportRef.current;
      if (!container) return;

      const pdf = new (jsPDF.jsPDF || jsPDF)('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;

      // Capture each logical section separately so nothing gets cut across pages
      const sections = container.querySelectorAll('[data-pdf-section]');
      if (!sections.length) {
        throw new Error("Report sections not found for PDF export.");
      }

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const canvas = await html2canvas(section, {
          scale: Math.min(window.devicePixelRatio || 2, 3),
          useCORS: true,
          backgroundColor: '#ffffff',
          windowWidth: section.scrollWidth,
          windowHeight: section.scrollHeight
        });

        const imgData = canvas.toDataURL('image/png');

        // Fit the section to the page without splitting it
        let imgWidth = maxWidth;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (imgHeight > maxHeight) {
          imgHeight = maxHeight;
          imgWidth = (canvas.width * imgHeight) / canvas.height;
        }

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight, undefined, 'FAST');
      }

      const safeName = (teacherName || "Teacher").toString().replace(/\s+/g, '_');
      pdf.save(`EduFeed_Report_${safeName}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed:", error);
      alert(`Could not generate PDF: ${error.message}`);
    }
  };

  const parseList = (text) => {
    if (!text) return [];
    return text
      .split('\n')
      .map((item) => item.replace(/^- /, '').trim())
      .filter((item) => item);
  };

  const resolvedImprovementAreas = Array.isArray(improvementAreas)
    ? improvementAreas
    : parseList(aoi_points);

  const resolvedRecommendations =
    Array.isArray(recommendations) && recommendations.length > 0
      ? recommendations
      : resolvedImprovementAreas.slice(0, 3);

  return (
    <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-900 min-h-screen p-8">
      <div className="w-full max-w-5xl flex justify-end mb-4">
        <button
          onClick={handleDownloadPdf}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105 flex items-center gap-2"
        >
          <span>Download PDF Report</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        </button>
      </div>

      <div ref={reportRef} className="w-full max-w-5xl p-12 rounded-xl font-sans relative overflow-hidden" style={{ backgroundColor: '#ffffff', color: '#1f2937', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-2" style={{ background: 'linear-gradient(90deg, #3b82f6, #a855f7, #ec4899)' }}></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-50" style={{ backgroundColor: '#f3e8ff', filter: 'blur(64px)' }}></div>
        <div className="absolute top-20 -left-10 w-40 h-40 rounded-full opacity-50" style={{ backgroundColor: '#dbeafe', filter: 'blur(64px)' }}></div>

        {/* Header */}
        <div data-pdf-section className="flex justify-between items-end pb-6 mb-8 relative z-10" style={{ borderBottom: '1px solid #e5e7eb' }}>
          <div>
            <h1 className="text-5xl font-extrabold" style={{ color: '#2563eb' }}>
              EduFeed
            </h1>
            <p className="text-lg mt-1 tracking-wide" style={{ color: '#6b7280' }}>Teaching Quality Improvement Report</p>
          </div>
          <div className="text-right">
            <p className="text-sm uppercase tracking-wider font-semibold" style={{ color: '#9ca3af' }}>Faculty Name</p>
            <h2 className="text-3xl font-bold" style={{ color: '#1f2937' }}>{teacherName}</h2>
            <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* 1. Overall Sentiment */}
        <div data-pdf-section className="mb-10 relative z-10">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: '#1f2937' }}>
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: '#dbeafe', color: '#2563eb' }}>1</span>
            Overall Sentiment Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Positive', value: positive_percent, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
              { label: 'Neutral', value: neutral_percent, color: '#ca8a04', bg: '#fefce8', border: '#fef08a' },
              { label: 'Negative', value: negative_percent, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' }
            ].map((item, idx) => (
              <div key={idx} className={`rounded-xl p-6 text-center`} style={{ backgroundColor: item.bg, border: `1px solid ${item.border}`, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                <div className={`text-4xl font-extrabold mb-2`} style={{ color: item.color }}>{item.value}%</div>
                <div className="font-medium uppercase tracking-wider text-sm" style={{ color: '#4b5563' }}>{item.label}</div>
              </div>
            ))}
          </div>
          {typeof totalFeedback === 'number' && (
            <p className="mt-4 text-sm" style={{ color: '#6b7280' }}>
              Based on {totalFeedback} feedback submission{totalFeedback === 1 ? '' : 's'}.
            </p>
          )}
        </div>

        {/* 2. Areas of Improvement */}
        <div data-pdf-section className="mb-10 relative z-10">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: '#1f2937' }}>
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: '#ffedd5', color: '#ea580c' }}>2</span>
            Areas for Improvement
          </h3>
          <div className="rounded-xl p-6" style={{ backgroundColor: '#fff7ed', border: '1px solid #ffedd5' }}>
            {resolvedImprovementAreas.length === 0 ? (
              <p className="text-sm" style={{ color: '#6b7280' }}>
                Not enough feedback data to generate improvement areas yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resolvedImprovementAreas.map((point, i) => (
                  <div key={i} className="flex items-start p-3 rounded-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #ffedd5', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <span className="text-xl mr-3" style={{ color: '#f97316' }}>-</span>
                    <span className="font-medium" style={{ color: '#374151' }}>{point}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. Actionable Recommendations */}
        <div data-pdf-section className="relative z-10">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: '#1f2937' }}>
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: '#ccfbf1', color: '#0d9488' }}>3</span>
            Actionable Recommendations
          </h3>
          {resolvedRecommendations.length === 0 ? (
            <p className="text-sm" style={{ color: '#6b7280' }}>
              Recommendations will appear once more feedback is collected.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resolvedRecommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl transition"
                  style={{
                    backgroundColor: '#ffffff',
                    borderTop: `4px solid ${index % 3 === 0 ? '#14b8a6' : index % 3 === 1 ? '#3b82f6' : '#a855f7'}`,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <h4 className="font-bold text-lg mb-2" style={{ color: '#1f2937' }}>
                    Recommendation {index + 1}
                  </h4>
                  <p className="text-sm" style={{ color: '#4b5563' }}>{rec}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. AI Summary */}
        <div data-pdf-section className="mt-10 relative z-10">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1f2937' }}>
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>4</span>
            AI Summary
          </h3>
          <div className="rounded-xl p-6" style={{ backgroundColor: '#eef2ff', border: '1px solid #e0e7ff' }}>
            <p className="text-sm whitespace-pre-line" style={{ color: '#374151' }}>
              {summary || "AI summary unavailable for this report yet."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div data-pdf-section className="mt-12 pt-6 text-center" style={{ borderTop: '1px solid #e5e7eb' }}>
          <p className="text-sm font-medium" style={{ color: '#9ca3af' }}>Generated by EduFeed AI Analysis System</p>
        </div>
      </div>
    </div>
  );
};

export default TeachingImprovementReport;

