// Store for tasks, visual alerts, and automated email simulation for managers

const getTodayDateStr = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const getDateOffsetStr = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TASKS = [
  {
    id: 101,
    title: 'اختبار وملخص حصة 01 - الحركة والسرعة',
    teacher: 'مستر محمد علي',
    subject: 'Science-Ar',
    grade: 'Middle 1',
    lecture: 'Lecture 01',
    type: 'Quiz + Summary',
    quality_name: 'كريم الجوهري',
    data_entry_name: 'سارة محمود',
    start_date: getDateOffsetStr(-6),
    delivery_date: getDateOffsetStr(-2), // 🔴 OVERDUE BY 2 DAYS
    warning_date: getDateOffsetStr(-4),
    shooting_date: getDateOffsetStr(1),
    status: 'in-progress',
    raw_files_count: 1,
    prepared_files_count: 0,
    priority: 'high',
    notes: 'مطلوب مراجعة أسئلة الاختيار من متعدد وإرسال الملخص للمطبعة فوراً.',
  },
  {
    id: 102,
    title: 'اختبار تجريبي شامل للوحدة الأولى',
    teacher: 'مستر أحمد عبد السلام',
    subject: 'Math-Ar',
    grade: 'Senior 1',
    lecture: 'Lecture 03',
    type: 'Quiz',
    quality_name: 'نهى سمير',
    data_entry_name: 'عمر شريف',
    start_date: getDateOffsetStr(-5),
    delivery_date: getDateOffsetStr(1), // 🟡 APPROACHING: TOMORROW!
    warning_date: getDateOffsetStr(-1),
    shooting_date: getDateOffsetStr(2),
    status: 'in-progress',
    raw_files_count: 2,
    prepared_files_count: 0,
    priority: 'high',
    notes: 'يتبقى مراجعة الجودة النهائية قبل الاعتماد.',
  },
  {
    id: 103,
    title: 'ملخص ورقي - قواعد النحو والإعراب',
    teacher: 'ميس فاطمة الزهراء',
    subject: 'Arabic',
    grade: 'Middle 2',
    lecture: 'Lecture 02',
    type: 'Paper Summary',
    quality_name: 'أحمد محمود',
    data_entry_name: 'سارة محمود',
    start_date: getDateOffsetStr(-3),
    delivery_date: getDateOffsetStr(0), // 🟡 TODAY (DUE TODAY)!
    warning_date: getDateOffsetStr(-2),
    shooting_date: getDateOffsetStr(3),
    status: 'pending-review',
    raw_files_count: 1,
    prepared_files_count: 1,
    priority: 'critical',
    notes: 'موعد التسليم اليوم حتى الساعة 5 مساءً.',
  },
  {
    id: 104,
    title: 'أسئلة بنك المعرفة وحلول النموذج الاسترشادي',
    teacher: 'د. طارق شاكر',
    subject: 'Science-En',
    grade: 'Senior 3',
    lecture: 'Lecture 04',
    type: 'Quiz + Summary',
    quality_name: 'كريم الجوهري',
    data_entry_name: 'يوسف ممدوح',
    start_date: getDateOffsetStr(-7),
    delivery_date: getDateOffsetStr(-3), // 🔴 OVERDUE BY 3 DAYS
    warning_date: getDateOffsetStr(-5),
    shooting_date: getDateOffsetStr(-1),
    status: 'in-progress',
    raw_files_count: 0, // No raw files either!
    prepared_files_count: 0,
    priority: 'critical',
    notes: 'تأخر مدخل البيانات في استلام أسئلة بنك المعرفة من المدرس.',
  },
  {
    id: 105,
    title: 'مراجعة نهائية واختبار إلكتروني',
    teacher: 'مستر إسلام فهمي',
    subject: 'History',
    grade: 'Middle 3',
    lecture: 'Lecture 05',
    type: 'Quiz',
    quality_name: 'نهى سمير',
    data_entry_name: 'عمر شريف',
    start_date: getDateOffsetStr(-2),
    delivery_date: getDateOffsetStr(5), // 🟢 ON TRACK (5 days left)
    warning_date: getDateOffsetStr(2),
    shooting_date: getDateOffsetStr(6),
    status: 'in-progress',
    raw_files_count: 1,
    prepared_files_count: 0,
    priority: 'normal',
    notes: 'تسليم في الموعد المحدد الأسبوع القادم.',
  },
  {
    id: 106,
    title: 'ملخص الحصة واختبار المفردات',
    teacher: 'مستر أحمد عبد السلام',
    subject: 'English',
    grade: 'Senior 2',
    lecture: 'Lecture 01',
    type: 'Quiz + Summary',
    quality_name: 'أحمد محمود',
    data_entry_name: 'سارة محمود',
    start_date: getDateOffsetStr(-8),
    delivery_date: getDateOffsetStr(-4),
    warning_date: getDateOffsetStr(-6),
    shooting_date: getDateOffsetStr(-3),
    status: 'completed', // 🔵 COMPLETED
    raw_files_count: 2,
    prepared_files_count: 2,
    priority: 'normal',
    notes: 'تم التسليم والاعتماد بنجاح.',
  },
];

export const INITIAL_SETTINGS = {
  approachingDaysThreshold: 2, // notify if <= 2 days
  managerEmails: ['dawy@elkheta.com', 'mohamed.eldawy@elkheta.com'],
  managerName: 'أحمد داوي (المدير العام)',
  senderEmail: 'notifications@elkheta.com',
  senderName: 'نظام إشعارات الجودة والإنتاج - منصة الخطة',
  autoEmailSimulation: true,
  visualAlertSound: true,
};

export const calculateDaysDiff = (dateStr) => {
  if (!dateStr) return 0;
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getTaskDeliveryStatus = (task, threshold = 2) => {
  if (task.status === 'completed') {
    return {
      type: 'completed',
      label: 'تم التسليم بنجاح',
      badgeClass: 'badge-completed',
      color: '#4f46e5',
      icon: 'CheckCircle2',
      isOverdue: false,
      isApproaching: false,
      daysDiff: 0,
    };
  }

  const daysDiff = calculateDaysDiff(task.delivery_date);

  if (daysDiff < 0) {
    const overdueDays = Math.abs(daysDiff);
    return {
      type: 'overdue',
      label: `تجاوز الموعد المحدد (${overdueDays} ${overdueDays === 1 ? 'يوم' : overdueDays === 2 ? 'يومان' : 'أيام'})`,
      shortLabel: `متأخر ${overdueDays} يوم`,
      badgeClass: 'badge-overdue',
      color: '#dc2626',
      icon: 'AlertTriangle',
      isOverdue: true,
      isApproaching: false,
      daysDiff,
      overdueDays,
    };
  }

  if (daysDiff <= threshold) {
    return {
      type: 'approaching',
      label: daysDiff === 0 ? 'موعد التسليم اليوم!' : daysDiff === 1 ? 'موعد التسليم غداً!' : `يقترب الموعد (متبقي ${daysDiff} يوم)`,
      shortLabel: daysDiff === 0 ? 'التسليم اليوم' : `متبقي ${daysDiff} يوم`,
      badgeClass: 'badge-approaching',
      color: '#d97706',
      icon: 'Clock',
      isOverdue: false,
      isApproaching: true,
      daysDiff,
    };
  }

  return {
    type: 'ontrack',
    label: `في الموعد (متبقي ${daysDiff} يوم)`,
    shortLabel: `في الموعد (${daysDiff} يوم)`,
    badgeClass: 'badge-ontrack',
    color: '#16a34a',
    icon: 'Calendar',
    isOverdue: false,
    isApproaching: false,
    daysDiff,
  };
};

export const generateSimulatedEmails = (tasks, settings) => {
  const emails = [];

  tasks.forEach((task) => {
    if (task.status === 'completed') return;

    const deliveryStatus = getTaskDeliveryStatus(task, settings.approachingDaysThreshold);

    if (deliveryStatus.isOverdue) {
      emails.push({
        id: `email-overdue-${task.id}`,
        taskId: task.id,
        type: 'overdue',
        priority: 'urgent',
        subject: `[تحذير عاجل] تجاوز موعد التسليم: مهمة ${task.teacher} - ${task.subject} (${task.lecture})`,
        from: `${settings.senderName} <${settings.senderEmail}>`,
        to: settings.managerEmails.join(', '),
        dateStr: 'اليوم 09:30 ص',
        timestamp: new Date().getTime() - 1000 * 60 * 30, // 30 mins ago
        read: false,
        summary: `تجاوزت هذه المهمة موعد التسليم النهائي المحدد لها بمقدار ${deliveryStatus.overdueDays} يوم وما زالت قيد التنفيذ دون تسليم ملفات الـ Prepared.`,
        taskDetails: {
          title: task.title,
          teacher: task.teacher,
          subject: task.subject,
          grade: task.grade,
          lecture: task.lecture,
          deliveryDate: task.delivery_date,
          qualityMember: task.quality_name,
          dataEntryMember: task.data_entry_name,
          overdueDays: deliveryStatus.overdueDays,
          status: task.status,
          notes: task.notes,
        },
      });
    } else if (deliveryStatus.isApproaching) {
      emails.push({
        id: `email-approaching-${task.id}`,
        taskId: task.id,
        type: 'approaching',
        priority: 'high',
        subject: `[تنبيه اقتراب موعد] تسليم مهمة ${task.teacher} - ${task.subject} (${deliveryStatus.daysDiff === 0 ? 'اليوم' : 'غداً'})`,
        from: `${settings.senderName} <${settings.senderEmail}>`,
        to: settings.managerEmails.join(', '),
        dateStr: 'اليوم 11:15 ص',
        timestamp: new Date().getTime() - 1000 * 60 * 15, // 15 mins ago
        read: false,
        summary: `يقترب الموعد النهائي لتسليم هذه المهمة (${deliveryStatus.daysDiff === 0 ? 'مطلوبة اليوم' : `متبقي ${deliveryStatus.daysDiff} يوم فقط`}). يرجى المتابعة لضمان عدم التأخر.`,
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
          status: task.status,
          notes: task.notes,
        },
      });
    }
  });

  return emails;
};
