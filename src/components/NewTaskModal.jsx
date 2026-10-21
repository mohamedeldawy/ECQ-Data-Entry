import React, { useState } from 'react';
import { X, Plus, Calendar, User, BookOpen } from 'lucide-react';

export default function NewTaskModal({ isOpen, onClose, onAddTask }) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [teacher, setTeacher] = useState('مستر محمد علي');
  const [subject, setSubject] = useState('Science-Ar');
  const [grade, setGrade] = useState('Middle 1');
  const [lecture, setLecture] = useState('Lecture 02');
  const [qualityName, setQualityName] = useState('كريم الجوهري');
  const [dataEntryName, setDataEntryName] = useState('سارة محمود');
  const [deliveryDate, setDeliveryDate] = useState(todayStr);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !deliveryDate) return;

    onAddTask({
      id: Date.now(),
      title: title.trim(),
      teacher,
      subject,
      grade,
      lecture,
      quality_name: qualityName,
      data_entry_name: dataEntryName,
      start_date: todayStr,
      delivery_date: deliveryDate,
      warning_date: todayStr,
      shooting_date: todayStr,
      status: 'in-progress',
      raw_files_count: 1,
      prepared_files_count: 0,
      priority: 'high',
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(3px)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>

          <div className="modal-header bg-primary text-white p-3 px-4">
            <h5 className="modal-title fw-bold m-0 d-flex align-items-center gap-2">
              <Plus size={20} />
              إضافة مهمة جديدة لمتابعة التسليم
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4 space-y-3">

              <div className="mb-3">
                <label className="form-label small fw-bold">عنوان المهمة *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="مثال: اختبار وملخص حصة 2 - الوحدة الأولى"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold">المدرس</label>
                  <select className="form-select form-select-sm" value={teacher} onChange={(e) => setTeacher(e.target.value)}>
                    <option value="مستر محمد علي">مستر محمد علي</option>
                    <option value="مستر أحمد عبد السلام">مستر أحمد عبد السلام</option>
                    <option value="ميس فاطمة الزهراء">ميس فاطمة الزهراء</option>
                    <option value="د. طارق شاكر">د. طارق شاكر</option>
                    <option value="مستر إسلام فهمي">مستر إسلام فهمي</option>
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label small fw-bold">المادة</label>
                  <select className="form-select form-select-sm" value={subject} onChange={(e) => setSubject(e.target.value)}>
                    <option value="Science-Ar">Science-Ar</option>
                    <option value="Science-En">Science-En</option>
                    <option value="Math-Ar">Math-Ar</option>
                    <option value="Math-En">Math-En</option>
                    <option value="Arabic">Arabic</option>
                    <option value="English">English</option>
                    <option value="History">History</option>
                  </select>
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold">الصف</label>
                  <select className="form-select form-select-sm" value={grade} onChange={(e) => setGrade(e.target.value)}>
                    <option value="Middle 1">Middle 1</option>
                    <option value="Middle 2">Middle 2</option>
                    <option value="Middle 3">Middle 3</option>
                    <option value="Senior 1">Senior 1</option>
                    <option value="Senior 2">Senior 2</option>
                    <option value="Senior 3">Senior 3</option>
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label small fw-bold">رقم الحصة</label>
                  <input
                    type="text"
                    className="form-control form-control-sm font-monospace"
                    value={lecture}
                    onChange={(e) => setLecture(e.target.value)}
                    placeholder="Lecture 02"
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold">مسؤول Quality</label>
                  <select className="form-select form-select-sm" value={qualityName} onChange={(e) => setQualityName(e.target.value)}>
                    <option value="كريم الجوهري">كريم الجوهري</option>
                    <option value="نهى سمير">نهى سمير</option>
                    <option value="أحمد محمود">أحمد محمود</option>
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label small fw-bold">مسؤول Data Entry</label>
                  <select className="form-select form-select-sm" value={dataEntryName} onChange={(e) => setDataEntryName(e.target.value)}>
                    <option value="سارة محمود">سارة محمود</option>
                    <option value="عمر شريف">عمر شريف</option>
                    <option value="يوسف ممدوح">يوسف ممدوح</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-danger">موعد التسليم النهائي (Delivery Date) *</label>
                <input
                  type="date"
                  className="form-control font-monospace fw-bold"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  required
                />
                <span className="text-muted small">
                  ملاحظة: يمكنك اختيار تاريخ اليوم أو الأمس لاختبار إطلاق التنبيهات المرئية والإيميل التلقائي فوراً!
                </span>
              </div>

              <div className="mb-2">
                <label className="form-label small fw-bold">ملاحظات إضافية للمهمة</label>
                <textarea
                  className="form-control form-control-sm"
                  rows="2"
                  placeholder="أي تعليمات للجودة أو مراجعة الأسئلة..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

            </div>

            <div className="modal-footer bg-light p-3">
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>إلغاء</button>
              <button type="submit" className="btn btn-primary btn-sm px-4 fw-bold">حفظ المهمة ومراقبة التسليم</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
