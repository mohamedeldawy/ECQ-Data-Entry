import React, { useState, useEffect } from 'react';
import {
  Bell,
  Mail,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ListTodo,
  Calendar,
  Users,
  Settings,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  ExternalLink,
  Shield,
  FileText
} from 'lucide-react';
import {
  INITIAL_TASKS,
  INITIAL_SETTINGS,
  getTaskDeliveryStatus,
  generateSimulatedEmails
} from './data/taskStore';
import VisualAlertBanner from './components/VisualAlertBanner';
import TasksTable from './components/TasksTable';
import ManagerEmailModal from './components/ManagerEmailModal';
import NewTaskModal from './components/NewTaskModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://MohamedEldawy.pythonanywhere.com';

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('elkheta_tasks_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_TASKS;
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('elkheta_notification_settings_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_SETTINGS;
  });

  const [emails, setEmails] = useState(() => {
    try {
      const saved = localStorage.getItem('elkheta_manager_emails_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return generateSimulatedEmails(INITIAL_TASKS, INITIAL_SETTINGS);
  });

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'tasks' | 'emails' | 'settings'
  const [tableFilterPreset, setTableFilterPreset] = useState('all');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [backendStatus, setBackendStatus] = useState('جاري التحقق من الاتصال...');

  // Persist tasks and settings
  useEffect(() => {
    try {
      localStorage.setItem('elkheta_tasks_v2', JSON.stringify(tasks));
    } catch (e) {
      console.warn(e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('elkheta_notification_settings_v2', JSON.stringify(settings));
    } catch (e) {
      console.warn(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('elkheta_manager_emails_v2', JSON.stringify(emails));
    } catch (e) {
      console.warn(e);
    }
  }, [emails]);

  // Check health on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Health check failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.status === 'ok') {
          setBackendStatus('متصل بالسيرفر بنجاح 🟢');
        } else {
          setBackendStatus('السيرفر متاح لكن فحص API لم ينجح ⚠️');
        }
      })
      .catch(() => setBackendStatus('تعذر الاتصال بالـ Backend 🔴'));
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 4500);
  };

  // Automated Alert & Email scan
  const runAlertScan = () => {
    const generated = generateSimulatedEmails(tasks, settings);

    // Merge without duplicating
    setEmails((prev) => {
      const existingIds = new Set(prev.map((e) => e.id));
      const newItems = generated.filter((g) => !existingIds.has(g.id));
      if (newItems.length > 0) {
        showToast(`🔔 تم إرسال ${newItems.length} تنبيه بريد تلقائي جديد للمدير: ${settings.managerEmails[0]}`);
      } else {
        showToast('✅ تم فحص المواعيد: صندوق بريد المدير محدّث بالكامل.');
      }
      return [...newItems, ...prev];
    });
  };

  useEffect(() => {
    if (!settings.autoEmailSimulation) return undefined;

    const scanForAlerts = () => {
      const generated = generateSimulatedEmails(tasks, settings);
      setEmails((prev) => {
        const existingIds = new Set(prev.map((email) => email.id));
        const newItems = generated.filter((email) => !existingIds.has(email.id));
        return [...newItems, ...prev];
      });
    };

    scanForAlerts();
    const intervalId = window.setInterval(scanForAlerts, 60_000);
    return () => window.clearInterval(intervalId);
  }, [tasks, settings]);

  // Calculate task counts
  const overdueTasks = tasks.filter((t) => getTaskDeliveryStatus(t).isOverdue);
  const approachingTasks = tasks.filter((t) => getTaskDeliveryStatus(t).isApproaching);
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const unreadEmailsCount = emails.filter((e) => !e.read).length;

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    showToast('تم تحديث حالة المهمة بنجاح.');
  };

  const handleAddTask = (newTask) => {
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);

    // Check if new task triggers an alert
    const deliveryStatus = getTaskDeliveryStatus(newTask, settings.approachingDaysThreshold);
    if (settings.autoEmailSimulation && (deliveryStatus.isOverdue || deliveryStatus.isApproaching)) {
      showToast(`⚠️ تنبيه: تم رصد موعد التسليم وإرسال بريد إلكتروني تلقائي (محاكاة) للمدير.`);
    } else {
      showToast('تمت إضافة المهمة بنجاح وبدء تتبع موعد التسليم.');
    }
  };

  const handleSendManualAlertEmail = (task) => {
    const deliveryStatus = getTaskDeliveryStatus(task);
    const newEmail = {
      id: `manual-email-${Date.now()}`,
      taskId: task.id,
      type: deliveryStatus.isOverdue ? 'overdue' : 'approaching',
      priority: 'urgent',
      subject: `[إشعار متابعة فوري للمدير] مهمة: ${task.teacher} - ${task.subject} (${task.lecture})`,
      from: `${settings.senderName} <${settings.senderEmail}>`,
      to: settings.managerEmails.join(', '),
      dateStr: 'الآن',
      timestamp: Date.now(),
      read: false,
      summary: `تنبيه مرسل يدوياً لمتابعة حالة المهمة وموعد التسليم (${task.delivery_date}).`,
      taskDetails: {
        title: task.title,
        teacher: task.teacher,
        subject: task.subject,
        grade: task.grade,
        lecture: task.lecture,
        deliveryDate: task.delivery_date,
        qualityMember: task.quality_name,
        dataEntryMember: task.data_entry_name,
        daysRemaining: deliveryStatus.daysDiff,
        overdueDays: deliveryStatus.overdueDays || 0,
        status: task.status,
        notes: task.notes,
      },
    };

    setEmails((prev) => [newEmail, ...prev]);
    showToast(`✉️ تم إرسال بريد إلكتروني (محاكاة) للمدير: ${settings.managerEmails[0]}`);
    setIsEmailModalOpen(true);
  };

  const handleMarkEmailAsRead = (emailId) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, read: true } : e))
    );
  };

  const handleDeleteEmail = (emailId) => {
    setEmails((prev) => prev.filter((e) => e.id !== emailId));
  };

  return (
    <div className="container-fluid p-0 min-vh-100 bg-[#f6f8fb]">
      <div className="row g-0">

        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-[#171d39] text-white p-3 min-vh-100 d-flex flex-column justify-content-between shadow-lg">
          <div>
            {/* Brand Logo */}
            <div className="d-flex align-items-center gap-2.5 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  fontSize: '22px',
                }}
              >
                خ
              </div>
              <div>
                <h5 className="fw-bold m-0 text-white leading-tight">الخطة</h5>
                <span className="text-secondary small" style={{ fontSize: '11px' }}>إدارة الجودة ومتابعة التسليم</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="nav flex-column gap-1">
              <button
                className={`sidebar-link ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                <Calendar size={18} />
                <span>الرئيسية والتنبيهات</span>
              </button>

              <button
                className={`sidebar-link ${activeTab === 'tasks' ? 'active' : ''}`}
                onClick={() => { setActiveTab('tasks'); setTableFilterPreset('all'); }}
              >
                <ListTodo size={18} />
                <span>جدول المهام والتسليم</span>
                {overdueTasks.length > 0 && (
                  <span className="badge bg-danger rounded-pill ms-auto small">{overdueTasks.length}</span>
                )}
              </button>

              <button
                className={`sidebar-link ${activeTab === 'emails' ? 'active' : ''}`}
                onClick={() => setIsEmailModalOpen(true)}
              >
                <Mail size={18} />
                <span>صندوق إيميلات المدير</span>
                {unreadEmailsCount > 0 && (
                  <span className="badge bg-danger rounded-pill ms-auto">{unreadEmailsCount}</span>
                )}
              </button>

              <button
                className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={18} />
                <span>إعدادات التنبيه التلقائي</span>
              </button>
            </nav>
          </div>

          {/* Manager Account Profile Card */}
          <div className="pt-3 border-top border-secondary border-opacity-25 mt-4">
            <div className="d-flex align-items-center gap-2.5 p-2 rounded-3 bg-white bg-opacity-10">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '34px', height: '34px', fontSize: '13px' }}>
                أ
              </div>
              <div className="overflow-hidden">
                <span className="d-block fw-bold text-white small text-truncate">أحمد داوي</span>
                <span className="d-block text-secondary small text-truncate" style={{ fontSize: '10px' }}>dawy@elkheta.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-md-9 col-lg-10 p-3 p-md-4">

          {/* Top Bar Header */}
          <header className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 bg-white p-3 px-4 rounded-4 shadow-sm border border-slate-100">
            <div>
              <div className="d-flex align-items-center gap-2">
                <h4 className="fw-bold m-0 text-dark">نظام تتبع المهام ومواعيد التسليم (ECQ)</h4>
              </div>
              <span className="text-muted small">
                متابعة مواعيد تسليم ملخصات الأوراق والاختبارات مع إشعار المديرين تلقائياً
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              {/* Notification Bell Icon */}
              <button
                className="btn btn-light position-relative p-2 rounded-circle border"
                onClick={() => setIsEmailModalOpen(true)}
                title="صندوق تنبيهات وإيميلات المدير"
              >
                <Bell size={20} className="text-secondary" />
                {(overdueTasks.length > 0 || unreadEmailsCount > 0) && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {overdueTasks.length + approachingTasks.length}
                  </span>
                )}
              </button>

              {/* Instant Check Button */}
              <button
                className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1.5 px-3 py-2 rounded-3 fw-bold"
                onClick={runAlertScan}
                title="فحص فوري لكافة المواعيد وإرسال إيميلات المحاكاة"
              >
                <RefreshCw size={14} />
                <span>فحص التنبيهات الآن</span>
              </button>

              {/* Add Task Button */}
              <button
                className="btn btn-primary btn-sm d-flex align-items-center gap-1.5 px-3 py-2 rounded-3 fw-bold shadow-sm"
                onClick={() => setIsNewTaskModalOpen(true)}
              >
                <Plus size={16} />
                <span>مهمة جديدة</span>
              </button>
            </div>
          </header>

          {/* Visual Alert Banner for Approaching or Overdue Tasks */}
          <VisualAlertBanner
            overdueCount={overdueTasks.length}
            approachingCount={approachingTasks.length}
            onOpenEmailModal={() => setIsEmailModalOpen(true)}
            onFilterOverdue={() => {
              setActiveTab('tasks');
              setTableFilterPreset('overdue');
            }}
            onFilterApproaching={() => {
              setActiveTab('tasks');
              setTableFilterPreset('approaching');
            }}
          />

          {/* TAB 1: HOME & OVERVIEW */}
          {activeTab === 'home' && (
            <div>
              {/* Stat Cards */}
              <div className="row g-3 mb-4">
                <div className="col-6 col-lg-3">
                  <div className="card-stat p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted small fw-semibold">إجمالي المهام</span>
                      <div className="p-2 rounded-3 bg-primary-subtle text-primary">
                        <ListTodo size={18} />
                      </div>
                    </div>
                    <h2 className="fw-bold text-dark mt-2 mb-1">{tasks.length}</h2>
                    <span className="text-secondary small">مهام مسجلة على النظام</span>
                  </div>
                </div>

                <div className="col-6 col-lg-3">
                  <div className="card-stat p-3" style={{ borderRight: '4px solid #ef4444' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-danger small fw-bold">تجاوزت موعد التسليم 🔴</span>
                      <div className="p-2 rounded-3 bg-danger-subtle text-danger">
                        <AlertTriangle size={18} />
                      </div>
                    </div>
                    <h2 className="fw-bold text-danger mt-2 mb-1">{overdueTasks.length}</h2>
                    <span className="text-danger small fw-semibold">تتطلب تدخلاً فورياً وإيميل عاجل</span>
                  </div>
                </div>

                <div className="col-6 col-lg-3">
                  <div className="card-stat p-3" style={{ borderRight: '4px solid #f59e0b' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-warning small fw-bold">يقترب الموعد (48 ساعة) 🟡</span>
                      <div className="p-2 rounded-3 bg-warning-subtle text-warning">
                        <Clock size={18} />
                      </div>
                    </div>
                    <h2 className="fw-bold text-warning mt-2 mb-1">{approachingTasks.length}</h2>
                    <span className="text-secondary small">تم إرسال إشعارات مسبقة</span>
                  </div>
                </div>

                <div className="col-6 col-lg-3">
                  <div className="card-stat p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-success small fw-semibold">تم التسليم بنجاح 🟢</span>
                      <div className="p-2 rounded-3 bg-success-subtle text-success">
                        <CheckCircle2 size={18} />
                      </div>
                    </div>
                    <h2 className="fw-bold text-success mt-2 mb-1">{completedTasks.length}</h2>
                    <span className="text-secondary small">ملفات معتمدة ومسلمة</span>
                  </div>
                </div>
              </div>

              {/* Tasks Table on Home */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="fw-bold m-0 text-dark">متابعة تسليمات المهام ومواعيد الاستحقاق</h5>
                  <button
                    className="btn btn-sm btn-link text-primary fw-bold text-decoration-none"
                    onClick={() => setIsEmailModalOpen(true)}
                  >
                    عرض سجل التنبيهات المرسلة ({emails.length}) ←
                  </button>
                </div>
                <TasksTable
                  tasks={tasks}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                  onNewTask={() => setIsNewTaskModalOpen(true)}
                  onSendManualAlertEmail={handleSendManualAlertEmail}
                  filterPreset={tableFilterPreset}
                  onClearFilter={() => setTableFilterPreset('all')}
                />
              </div>
            </div>
          )}

          {/* TAB 2: TASKS LIST */}
          {activeTab === 'tasks' && (
            <div>
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold text-dark m-0">جدول مواعيد التسليم وتنبيهات الجودة</h4>
                  <span className="text-muted small">فرز وبحث وإدارة حالة المهام والتنبيهات المرئية</span>
                </div>
              </div>
              <TasksTable
                tasks={tasks}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onNewTask={() => setIsNewTaskModalOpen(true)}
                onSendManualAlertEmail={handleSendManualAlertEmail}
                filterPreset={tableFilterPreset}
                onClearFilter={() => setTableFilterPreset('all')}
              />
            </div>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="card border-0 shadow-sm p-4 mx-auto" style={{ maxWidth: '750px', borderRadius: '16px' }}>
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <Settings size={20} className="text-primary" />
                إعدادات تنبيهات المواعيد والبريد الإلكتروني التلقائي
              </h5>
              <p className="text-muted small mb-4">
                هذه الإعدادات تحدد القواعد التي يقوم النظام بناءً عليها بفحص المواعيد وتوليد الإشعارات المرئية والإيميلات لمحاكاة بريد المديرين.
              </p>

              <div className="mb-3">
                <label className="form-label fw-bold small">عناوين البريد الإلكتروني للمديرين:</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.managerEmails.join(', ')}
                  onChange={(e) => {
                    const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                    setSettings({ ...settings, managerEmails: list });
                  }}
                  dir="ltr"
                />
                <span className="form-text text-muted small">يتم إرسال كافة التنبيهات المرئية ومحاكاة الإيميلات إلى هذه الحسابات.</span>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold small">فترة إشعار اقتراب موعد التسليم:</label>
                <select
                  className="form-select"
                  value={settings.approachingDaysThreshold}
                  onChange={(e) => setSettings({ ...settings, approachingDaysThreshold: Number(e.target.value) })}
                >
                  <option value="1">قبل موعد التسليم بـ 1 يوم (24 ساعة)</option>
                  <option value="2">قبل موعد التسليم بـ 2 يوم (48 ساعة) - موصى به</option>
                  <option value="3">قبل موعد التسليم بـ 3 أيام</option>
                </select>
              </div>

              <div className="form-check form-switch mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="autoEmailSwitch"
                  checked={settings.autoEmailSimulation}
                  onChange={(e) => setSettings({ ...settings, autoEmailSimulation: e.target.checked })}
                />
                <label className="form-check-label fw-semibold small" htmlFor="autoEmailSwitch">
                  تفعيل المحاكاة التلقائية لإرسال الإيميلات عند كل فحص دوري
                </label>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                <button className="btn btn-outline-primary btn-sm fw-bold" onClick={runAlertScan}>
                  فحص المواعيد وتوليد الإيميلات الآن 🔄
                </button>
                <button
                  className="btn btn-primary btn-sm px-4 fw-bold"
                  onClick={() => showToast('تم حفظ إعدادات التنبيه التلقائي بنجاح.')}
                >
                  حفظ التعديلات
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Manager Email Modal & Alert Center */}
      <ManagerEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        emails={emails}
        onMarkAsRead={handleMarkEmailAsRead}
        onDeleteEmail={handleDeleteEmail}
        onTriggerCheck={runAlertScan}
        onGoToTask={(taskId) => {
          setActiveTab('tasks');
          setIsEmailModalOpen(false);
        }}
        settings={settings}
        onUpdateSettings={(newSettings) => {
          setSettings(newSettings);
          showToast('تم تحديث إعدادات التنبيه بنجاح.');
        }}
      />

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />

      {/* Floating Toast Notification Alert */}
      {toastMessage && (
        <div
          className="position-fixed bottom-0 start-50 translate-middle-x mb-4 p-3 px-4 rounded-4 shadow-lg text-white d-flex align-items-center gap-2.5"
          style={{
            zIndex: 9999,
            backgroundColor: '#1e1b4b',
            border: '1px solid rgba(129, 140, 248, 0.4)',
            maxWidth: '500px',
            animation: 'fadeInUp 0.3s ease',
          }}
        >
          <Mail size={18} className="text-warning flex-shrink-0" />
          <span className="small fw-semibold">{toastMessage}</span>
          <button
            type="button"
            className="btn-close btn-close-white ms-auto small"
            onClick={() => setToastMessage(null)}
          ></button>
        </div>
      )}

    </div>
  );
}
