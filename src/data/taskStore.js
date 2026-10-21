// تحديد رابط الـ API من متغيرات البيئة أو استخدام الرابط المباشر
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://MohamedEldawy.pythonanywhere.com';

// 1. جلب جميع المهام من الـ Backend
export async function getTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`);
    if (!response.ok) throw new Error('فشل في جلب المهام من السيرفر');
    return await response.json();
  } catch (error) {
    console.error('Task Fetch Error:', error);
    return [];
  }
}

// 2. إضافة مهمة جديدة
export async function addTask(taskData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error('فشل في إضافة المهمة');
    return await response.json();
  } catch (error) {
    console.error('Add Task Error:', error);
    throw error;
  }
}

// 3. تعديل مهمة حالية
export async function updateTask(taskId, updatedData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error('فشل في تعديل المهمة');
    return await response.json();
  } catch (error) {
    console.error('Update Task Error:', error);
    throw error;
  }
}

// 4. حذف مهمة
export async function deleteTask(taskId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('فشل في حذف المهمة');
    return await response.json();
  } catch (error) {
    console.error('Delete Task Error:', error);
    throw error;
  }
}
