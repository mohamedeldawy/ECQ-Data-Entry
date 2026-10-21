import React, { useState } from 'react';
import {
  Mail,
  X,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Send,
  RefreshCw,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Inbox,
  Settings,
  Bell,
  User,
  Calendar,
  FileText
} from 'lucide-react';

export default function ManagerEmailModal({
  isOpen,
  onClose,
  emails = [],
  onMarkAsRead,
  onDeleteEmail,
  onTriggerCheck,
  onGoToTask,
  settings,
  onUpdateSettings,
}) {
  const [selectedEmailId, setSelectedEmailId] = useState(emails[0]?.id || null);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'overdue' | 'approaching'
  const [showSettingsTab, setShowSettingsTab] = useState(false);

  // Settings form state
  const [thresholdDays, setThresholdDays] = useState(settings?.approachingDaysThreshold || 2);
  const [managerEmailsInput, setManagerEmailsInput] = useState(
    (settings?.managerEmails || []).join(', ')
  );

  if (!isOpen) return null;

  const filteredEmails = emails.filter((e) => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || filteredEmails[0];

  const handleSelectEmail = (email) => {
    setSelectedEmailId(email.id);
    if (!email.read && onMarkAsRead) {
      onMarkAsRead(email.id);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const emailsList = managerEmailsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    onUpdateSettings({
      ...settings,
      approachingDaysThreshold: Number(thresholdDays),
      managerEmails: emailsList.length > 0 ? emailsList : settings.managerEmails,
    });
    setShowSettingsTab(false);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(3px)' }} tabIndex="-1">
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>

          {/* Header */}
          <div className="modal-header bg-dark text-white p-3 px-4 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 rounded-3 bg-primary text-white d-flex align-items-center justify-center">
                <Mail size={20} />
              </div>
              <div>
                <h5 className="modal-title fw-bold m-0 d-flex align-items-center gap-2">
                  صندوق بريد وتنبيهات المديرين (محاكاة آلية)
                  <span className="badge bg-danger rounded-pill fs-7">{emails.filter(e => !e.read).length} جديد</span>
                </h5>
                <span className="text-secondary small">
                  تنبيهات إلكترونية تلقائية ترسل للمدير عند اقتراب مواعيد التسليم أو تجاوز المهام للديدلاين
                </span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                onClick={onTriggerCheck}
                title="فحص فوري للمهام وتحديث التنبيهات"
              >
                <RefreshCw size={14} />
                <span>فحص وتوليد الإيميلات الآن</span>
              </button>

              <button
                className={`btn btn-sm ${showSettingsTab ? 'btn-primary' : 'btn-outline-secondary text-white'}`}
                onClick={() => setShowSettingsTab(!showSettingsTab)}
                title="إعدادات التنبيه التلقائي"
              >
                <Settings size={15} />
              </button>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-0">
            {showSettingsTab ? (
              /* Settings View */
              <div className="p-4 bg-light">
                <div className="card border-0 shadow-sm p-4 mx-auto" style={{ maxWidth: '650px', borderRadius: '16px' }}>
                  <h5 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                    <Settings size={20} />
                    إعدادات نظام التنبيهات التلقائية للمديرين
                  </h5>
                  <p className="text-muted small mb-4">
                    يمكنك تحديد المهلة الزمنية لإشعار اقتراب موعد التسليم وقائمة عناوين البريد الإلكتروني المعتمدة للمديرين.
                  </p>

                  <form onSubmit={handleSaveSettings}>
                    <div className="mb-3">
                      <label className="form-label fw-bold small">عناوين البريد الإلكتروني للمديرين (مفصولة بفواصل):</label>
                      <input
                        type="text"
                        className="form-control"
                        value={managerEmailsInput}
                        onChange={(e) => setManagerEmailsInput(e.target.value)}
                        placeholder="dawy@elkheta.com, admin@elkheta.com"
                        required
                        dir="ltr"
                      />
                      <span className="form-text text-muted small">سيتم إرسال كافة التنبيهات والتحذيرات التلقائية إلى هذه الحسابات.</span>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold small">مهلة إشعار اقتراب الموعد (قبل الموعد بـ):</label>
                      <select
                        className="form-select"
                        value={thresholdDays}
                        onChange={(e) => setThresholdDays(e.target.value)}
                      >
                        <option value="1">قبل موعد التسليم بـ 1 يوم (24 ساعة)</option>
                        <option value="2">قبل موعد التسليم بـ 2 يوم (48 ساعة) - مستحسن</option>
                        <option value="3">قبل موعد التسليم بـ 3 أيام</option>
                      </select>
                      <span className="form-text text-muted small">المهام التي يتبقى عليها هذه المدة ستُصدر فوراً تنبيهاً مرئياً وبريداً تلقائياً.</span>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setShowSettingsTab(false)}
                      >
                        إلغاء
                      </button>
                      <button type="submit" className="btn btn-primary btn-sm px-4 fw-bold">
                        حفظ الإعدادات
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              /* Email Inbox & Reader View */
              <div className="row g-0" style={{ minHeight: '520px' }}>

                {/* Email List Column */}
                <div className="col-md-5 border-start bg-light d-flex flex-column" style={{ maxHeight: '560px', overflowY: 'auto' }}>

                  {/* Filter Pills */}
                  <div className="p-3 bg-white border-bottom d-flex gap-2 justify-content-between align-items-center sticky-top">
                    <div className="btn-group btn-group-sm w-100" role="group">
                      <button
                        type="button"
                        className={`btn ${filterType === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setFilterType('all')}
                      >
                        الكل ({emails.length})
                      </button>
                      <button
                        type="button"
                        className={`btn ${filterType === 'overdue' ? 'btn-danger' : 'btn-outline-danger'}`}
                        onClick={() => setFilterType('overdue')}
                      >
                        تجاوز الموعد ({emails.filter(e => e.type === 'overdue').length})
                      </button>
                      <button
                        type="button"
                        className={`btn ${filterType === 'approaching' ? 'btn-warning text-dark' : 'btn-outline-warning text-dark'}`}
                        onClick={() => setFilterType('approaching')}
                      >
                        يقترب الموعد ({emails.filter(e => e.type === 'approaching').length})
                      </button>
                    </div>
                  </div>

                  {/* List Items */}
                  <div className="p-2 flex-grow-1">
                    {filteredEmails.length === 0 ? (
                      <div className="text-center py-5 text-muted">
                        <Inbox size={36} className="text-secondary mb-2" />
                        <p className="small m-0">لا توجد إشعارات بريد في هذا القسم حالياً.</p>
                      </div>
                    ) : (
                      filteredEmails.map((email) => {
                        const isSelected = selectedEmail?.id === email.id;
                        return (
                          <div
                            key={email.id}
                            className={`email-item p-3 mb-2 border ${isSelected ? 'active bg-white border-primary shadow-xs' : 'bg-white border-light'} ${!email.read ? 'unread' : ''}`}
                            onClick={() => handleSelectEmail(email)}
                          >
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="badge rounded-pill" style={{
                                backgroundColor: email.type === 'overdue' ? '#fee2e2' : '#fef3c7',
                                color: email.type === 'overdue' ? '#dc2626' : '#b45309',
                                fontSize: '10px'
                              }}>
                                {email.type === 'overdue' ? '🔴 تجاوز الموعد' : '🟡 اقتراب موعد التسليم'}
                              </span>
                              <span className="text-muted" style={{ fontSize: '11px' }}>{email.dateStr}</span>
                            </div>

                            <div className="fw-bold text-dark small text-truncate mb-1">
                              {email.subject}
                            </div>

                            <div className="text-muted small text-truncate" style={{ fontSize: '11px' }}>
                              المدرس: {email.taskDetails?.teacher} · {email.taskDetails?.subject}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Email Body Detail Column */}
                <div className="col-md-7 p-4 bg-white d-flex flex-column justify-content-between" style={{ maxHeight: '560px', overflowY: 'auto' }}>
                  {selectedEmail ? (
                    <div>
                      {/* Email Header */}
                      <div className="border-bottom pb-3 mb-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="fw-bold text-dark m-0">{selectedEmail.subject}</h5>
                          <span className={`badge ${selectedEmail.type === 'overdue' ? 'bg-danger' : 'bg-warning text-dark'} p-2`}>
                            {selectedEmail.type === 'overdue' ? 'تحذير تأخير عاجل' : 'تنبيه موعد تسليم'}
                          </span>
                        </div>

                        <div className="bg-light p-2 rounded-3 text-secondary small d-flex flex-column gap-1" dir="ltr">
                          <div><strong className="text-dark">From:</strong> {selectedEmail.from}</div>
                          <div><strong className="text-dark">To:</strong> {selectedEmail.to}</div>
                          <div><strong className="text-dark">Date:</strong> {new Date(selectedEmail.timestamp).toLocaleString('ar-EG')}</div>
                        </div>
                      </div>

                      {/* Email Content Box */}
                      <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: selectedEmail.type === 'overdue' ? '#fff1f2' : '#fffbeb', border: selectedEmail.type === 'overdue' ? '1px solid #fecdd3' : '1px solid #fef3c7' }}>
                        <div className="d-flex align-items-center gap-2 mb-2 font-semibold" style={{ color: selectedEmail.type === 'overdue' ? '#9f1239' : '#92400e' }}>
                          {selectedEmail.type === 'overdue' ? <AlertTriangle size={18} /> : <Clock size={18} />}
                          <span className="fw-bold">
                            {selectedEmail.type === 'overdue'
                              ? `⚠️ تنبيه تجاوز الديدلاين: تأخرت هذه المهمة بمقدار ${selectedEmail.taskDetails.overdueDays} يوم عن موعد التسليم المحدد.`
                              : `⏳ تنبيه متابعة: موعد التسليم المحدد لهذه المهمة ${selectedEmail.taskDetails.daysRemaining === 0 ? 'هو اليوم!' : `يتبقى عليه ${selectedEmail.taskDetails.daysRemaining} يوم فقط`}.`}
                          </span>
                        </div>
                        <p className="m-0 small text-dark leading-relaxed">
                          {selectedEmail.summary}
                        </p>
                      </div>

                      {/* Task Brief Table */}
                      <div className="card border p-3 mb-3" style={{ borderRadius: '12px' }}>
                        <h6 className="fw-bold text-secondary mb-3 small d-flex align-items-center gap-1">
                          <FileText size={16} />
                          بيانات المهمة المعنية بالتنبيه:
                        </h6>
                        <div className="row g-2 small">
                          <div className="col-6">
                            <span className="text-muted d-block">المدرس:</span>
                            <strong className="text-dark">{selectedEmail.taskDetails?.teacher}</strong>
                          </div>
                          <div className="col-6">
                            <span className="text-muted d-block">المادة والصف:</span>
                            <strong className="text-primary">{selectedEmail.taskDetails?.subject} ({selectedEmail.taskDetails?.grade})</strong>
                          </div>
                          <div className="col-6">
                            <span className="text-muted d-block">رقم الحصة:</span>
                            <span className="text-dark">{selectedEmail.taskDetails?.lecture}</span>
                          </div>
                          <div className="col-6">
                            <span className="text-muted d-block">تاريخ التسليم المحدد:</span>
                            <strong className="text-danger">{selectedEmail.taskDetails?.deliveryDate}</strong>
                          </div>
                          <div className="col-6">
                            <span className="text-muted d-block">مسؤول الجودة (Quality):</span>
                            <span className="text-dark">{selectedEmail.taskDetails?.qualityMember || '—'}</span>
                          </div>
                          <div className="col-6">
                            <span className="text-muted d-block">مسؤول الإدخال (Data Entry):</span>
                            <span className="text-dark">{selectedEmail.taskDetails?.dataEntryMember || '—'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="d-flex justify-content-between align-items-center pt-2">
                        <span className="text-muted small" style={{ fontSize: '11px' }}>
                          📩 نظام المحاكاة يقوم بإنشاء هذا السجل تلقائياً لتوثيق دورة الإنتاج والتنبيه.
                        </span>
                        <button
                          className="btn btn-primary btn-sm px-3 d-flex align-items-center gap-1 fw-bold"
                          onClick={() => {
                            if (onGoToTask) onGoToTask(selectedEmail.taskId);
                            onClose();
                          }}
                        >
                          <span>عرض المهمة في الجدول</span>
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-5 text-muted my-auto">
                      <Mail size={48} className="text-secondary mb-2" />
                      <p>اختر رسالة من القائمة لعرض تفاصيلها وبيانات المهمة.</p>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer bg-light p-2 px-3 d-flex justify-content-between align-items-center">
            <span className="text-muted small">
              🟢 يتم فحص مواعيد التسليم تلقائياً وإرسال الإشعارات إلى بريد المدير العام المعتمد.
            </span>
            <button type="button" className="btn btn-secondary btn-sm px-4" onClick={onClose}>
              إغلاق
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
