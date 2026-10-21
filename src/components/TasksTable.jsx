import React, { useState } from 'react';
import {
  Search,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Mail,
  User,
  FileCheck,
  Upload,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { getTaskDeliveryStatus } from '../data/taskStore';

export default function TasksTable({
  tasks = [],
  onUpdateTaskStatus,
  onNewTask,
  onSendManualAlertEmail,
  filterPreset = 'all',
  onClearFilter,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState(filterPreset);

  // Sync if filterPreset changes from parent
  React.useEffect(() => {
    if (filterPreset) {
      setActiveFilter(filterPreset);
    }
  }, [filterPreset]);

  const filteredTasks = tasks.filter((task) => {
    const status = getTaskDeliveryStatus(task);

    // Filter by type
    if (activeFilter === 'overdue' && !status.isOverdue) return false;
    if (activeFilter === 'approaching' && !status.isApproaching) return false;
    if (activeFilter === 'ontrack' && (status.type !== 'ontrack')) return false;
    if (activeFilter === 'completed' && task.status !== 'completed') return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        task.title?.toLowerCase().includes(q) ||
        task.teacher?.toLowerCase().includes(q) ||
        task.subject?.toLowerCase().includes(q) ||
        task.grade?.toLowerCase().includes(q) ||
        task.lecture?.toLowerCase().includes(q) ||
        task.quality_name?.toLowerCase().includes(q) ||
        task.data_entry_name?.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
      {/* Table Toolbar */}
      <div className="card-header bg-white p-3 px-4 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">

        {/* Search */}
        <div className="input-group" style={{ maxWidth: '380px' }}>
          <span className="input-group-text bg-light border-end-0">
            <Search size={16} className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control bg-light border-start-0"
            placeholder="ابحث بالمدرس، المادة، أو رقم الحصة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="btn btn-light border" onClick={() => setSearchTerm('')}>
              مسح
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="d-flex flex-wrap align-items-center gap-1.5">
          <button
            className={`btn btn-sm ${activeFilter === 'all' ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => { setActiveFilter('all'); if (onClearFilter) onClearFilter(); }}
          >
            جميع المهام ({tasks.length})
          </button>
          <button
            className={`btn btn-sm ${activeFilter === 'overdue' ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setActiveFilter('overdue')}
          >
            🔴 تجاوزت الموعد ({tasks.filter(t => getTaskDeliveryStatus(t).isOverdue).length})
          </button>
          <button
            className={`btn btn-sm ${activeFilter === 'approaching' ? 'btn-warning text-dark' : 'btn-outline-warning text-dark'}`}
            onClick={() => setActiveFilter('approaching')}
          >
            🟡 اقتراب الموعد ({tasks.filter(t => getTaskDeliveryStatus(t).isApproaching).length})
          </button>
          <button
            className={`btn btn-sm ${activeFilter === 'completed' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setActiveFilter('completed')}
          >
            🟢 مكتملة ({tasks.filter(t => t.status === 'completed').length})
          </button>

          {onNewTask && (
            <button className="btn btn-sm btn-primary ms-2 d-flex align-items-center gap-1" onClick={onNewTask}>
              <Plus size={16} />
              <span>إضافة مهمة</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 text-end">
          <thead className="table-light text-secondary small">
            <tr>
              <th className="py-3 px-3">المهمة / المدرس</th>
              <th className="py-3 px-3">المادة والصف</th>
              <th className="py-3 px-3">الحصة</th>
              <th className="py-3 px-3">المسؤولين (Quality & Entry)</th>
              <th className="py-3 px-3 text-center">موعد التسليم وحالة الديدلاين</th>
              <th className="py-3 px-3 text-center">حالة المهمة</th>
              <th className="py-3 px-3 text-center">تنبيه المدير</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-5 text-muted">
                  لا توجد مهام مطابقة للشروط المحددة.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => {
                const deliveryStatus = getTaskDeliveryStatus(task);

                return (
                  <tr key={task.id} className={deliveryStatus.isOverdue ? 'table-danger-subtle' : ''}>

                    {/* Title & Teacher */}
                    <td className="px-3">
                      <strong className="d-block text-dark small">{task.title}</strong>
                      <span className="text-muted small">المدرس: <b>{task.teacher}</b></span>
                    </td>

                    {/* Subject & Grade */}
                    <td className="px-3">
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                        {task.subject}
                      </span>
                      <small className="d-block text-muted mt-1">{task.grade}</small>
                    </td>

                    {/* Lecture */}
                    <td className="px-3 text-dark small font-monospace">
                      {task.lecture}
                    </td>

                    {/* Team Members */}
                    <td className="px-3 small">
                      <div className="d-flex flex-column gap-0.5">
                        <span className="text-muted">
                          Quality: <b className="text-dark">{task.quality_name || '—'}</b>
                        </span>
                        <span className="text-muted">
                          Entry: <b className="text-secondary">{task.data_entry_name || '—'}</b>
                        </span>
                      </div>
                    </td>

                    {/* Delivery Date & Countdown Status */}
                    <td className="px-3 text-center">
                      <div className="font-monospace fw-bold mb-1" style={{ fontSize: '13px' }}>
                        {task.delivery_date}
                      </div>

                      {/* Visual Alert Badge */}
                      <span className={`badge rounded-pill px-2.5 py-1 ${deliveryStatus.badgeClass} d-inline-flex align-items-center gap-1`}>
                        {deliveryStatus.isOverdue && <span className="pulse-dot bg-danger"></span>}
                        {deliveryStatus.isApproaching && <span className="pulse-dot pulse-yellow bg-warning"></span>}
                        {deliveryStatus.type === 'completed' && <CheckCircle2 size={12} />}
                        <span>{deliveryStatus.label}</span>
                      </span>
                    </td>

                    {/* Task Status Dropdown */}
                    <td className="px-3 text-center">
                      <select
                        className="form-select form-select-sm text-center fw-bold"
                        style={{
                          fontSize: '12px',
                          backgroundColor:
                            task.status === 'completed'
                              ? '#dcfce7'
                              : task.status === 'pending-review'
                              ? '#fef3c7'
                              : '#f1f5f9',
                          borderColor:
                            task.status === 'completed'
                              ? '#86efac'
                              : task.status === 'pending-review'
                              ? '#fde047'
                              : '#cbd5e1',
                        }}
                        value={task.status}
                        onChange={(e) => onUpdateTaskStatus(task.id, e.target.value)}
                      >
                        <option value="in-progress">قيد العمل ⏳</option>
                        <option value="pending-review">بانتظار المراجعة 🔍</option>
                        <option value="completed">تم التسليم بنجاح ✅</option>
                      </select>
                    </td>

                    {/* Manual Alert Trigger */}
                    <td className="px-3 text-center">
                      <button
                        className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                        style={{ fontSize: '11px' }}
                        onClick={() => onSendManualAlertEmail(task)}
                        title="إرسال تنبيه إلكتروني فوري لمحاكاة بريد المدير"
                      >
                        <Mail size={13} />
                        <span>إرسال إيميل تنبيه</span>
                      </button>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="card-footer bg-light p-3 px-4 d-flex justify-content-between align-items-center text-muted small">
        <span>
          💡 النظام يولد تنبيهات مرئية تلقائياً ويحدث صندوق بريد المديرين كلما اقتربت أي مهمة من موعد التسليم.
        </span>
        <span>إجمالي المهام: {filteredTasks.length}</span>
      </div>
    </div>
  );
}
