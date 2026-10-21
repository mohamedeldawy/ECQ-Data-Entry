import React from 'react';
import { AlertTriangle, Clock, Mail, ChevronLeft, BellRing } from 'lucide-react';

export default function VisualAlertBanner({
  overdueCount = 0,
  approachingCount = 0,
  onOpenEmailModal,
  onFilterOverdue,
  onFilterApproaching,
}) {
  if (overdueCount === 0 && approachingCount === 0) {
    return null;
  }

  return (
    <div className="card border-0 shadow-sm mb-4 overflow-hidden" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#fff' }}>
      <div className="card-body p-3 px-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

          {/* Alert Title & Indicators */}
          <div className="d-flex align-items-center gap-3">
            <div className="p-2.5 rounded-3 bg-danger text-white d-flex align-items-center justify-content-center shadow-sm">
              <BellRing size={22} className="animate-bounce" />
            </div>

            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-danger rounded-pill px-2.5 py-1 text-white fw-bold d-flex align-items-center gap-1">
                  <span className="pulse-dot bg-white"></span>
                  تنبيهات تسليم عاجلة للمدير
                </span>
                <span className="text-indigo-200 small">تم توليد وإرسال إشعارات بريد إلكتروني تلقائية (محاكاة)</span>
              </div>

              <div className="d-flex flex-wrap align-items-center gap-3 text-white small">
                {overdueCount > 0 && (
                  <button
                    onClick={onFilterOverdue}
                    className="btn btn-sm btn-link text-decoration-none text-white p-0 d-flex align-items-center gap-1.5 hover:underline"
                  >
                    <span className="badge bg-danger fs-7">{overdueCount}</span>
                    <strong className="text-warning">مهام تجاوزت موعد التسليم المحدد!</strong>
                  </button>
                )}

                {approachingCount > 0 && (
                  <button
                    onClick={onFilterApproaching}
                    className="btn btn-sm btn-link text-decoration-none text-white p-0 d-flex align-items-center gap-1.5 hover:underline"
                  >
                    <span className="badge bg-warning text-dark fs-7">{approachingCount}</span>
                    <span className="text-light">مهام تقترب من الديدلاين خلال 48 ساعة</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={onOpenEmailModal}
              className="btn btn-sm btn-warning text-dark fw-bold d-flex align-items-center gap-2 px-3 py-2 rounded-3 shadow-sm hover:opacity-95"
            >
              <Mail size={16} />
              <span>صندوق بريد وتنبيهات المدير</span>
              <span className="badge bg-dark text-white rounded-pill ms-1">{overdueCount + approachingCount}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
