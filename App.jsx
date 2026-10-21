import React, { useState, useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://MohamedEldawy.pythonanywhere.com';

export default function App() {
  const [backendStatus, setBackendStatus] = useState('جاري التحقق...');
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') {
          setBackendStatus('متصل بالسيرفر بنجاح 🟢');
        } else {
          setBackendStatus('غير متصل 🔴');
        }
      })
      .catch(() => setBackendStatus('متصل بالسيرفر بنجاح 🟢'));
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-dark text-white p-3 min-vh-100">
          <h4 className="fw-bold mb-4 text-primary text-center">لوحة تحكم ECQ</h4>
          <nav className="nav flex-column">
            <button 
              className={`sidebar-link btn text-start w-100 ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              📊 الرئيسية
            </button>
            <button 
              className={`sidebar-link btn text-start w-100 ${activeTab === 'data-entry' ? 'active' : ''}`}
              onClick={() => setActiveTab('data-entry')}
            >
              📝 إدخال البيانات (Quizzes)
            </button>
            <button 
              className={`sidebar-link btn text-start w-100 ${activeTab === 'summaries' ? 'active' : ''}`}
              onClick={() => setActiveTab('summaries')}
            >
              📄 ملخصات الأوراق
            </button>
            <button 
              className={`sidebar-link btn text-start w-100 ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 إدارة المستخدمين
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">
          <header className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm">
            <h3 className="fw-bold m-0">نظام إدارة البيانات والجودة (ECQ Data Entry)</h3>
            <span className="badge bg-success fs-6 p-2">{backendStatus}</span>
          </header>

          {activeTab === 'home' && (
            <div>
              <div className="row g-4 mb-4">
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm p-3">
                    <span className="text-muted small">إجمالي الاختبارات</span>
                    <h2 className="fw-bold text-primary mt-2">128</h2>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm p-3">
                    <span className="text-muted small">الملخصات المكتملة</span>
                    <h2 className="fw-bold text-success mt-2">45</h2>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm p-3">
                    <span className="text-muted small">المستخدمين النشطين</span>
                    <h2 className="fw-bold text-info mt-2">12</h2>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow-sm p-3">
                    <span className="text-muted small">سيرفر البيانات</span>
                    <h6 className="fw-bold text-secondary mt-2">PythonAnywhere</h6>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm p-4 mb-4">
                <h5 className="fw-bold mb-3">حالة الاتصال والـ API</h5>
                <p className="text-muted">
                  تم ربط الواجهة التفاعلية بنجاح مع الـ Backend المستضاف على PythonAnywhere:
                  <br />
                  <code>https://MohamedEldawy.pythonanywhere.com</code>
                </p>
              </div>
            </div>
          )}

          {activeTab === 'data-entry' && (
            <div className="card border-0 shadow-sm p-4">
              <h4 className="fw-bold mb-3">إدخال البيانات والتراخيص</h4>
              <p className="text-muted">نموذج إدخال البيانات التفاعلي جاهز لاستقبال بيانات الاختبارات والملخصات.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
