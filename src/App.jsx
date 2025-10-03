import './App.css'
import { Routes, Route, Link } from 'react-router-dom';

// 1. Import หน้าใหม่ที่เราสร้างเข้ามา
import MyTasksPage from './page/MyTasksPage.jsx';
import AvailableTasksPage from './page/AvailableTasksPage.jsx'; 

function App() {
  return (
    <>
      {/* 2. สร้างเมนู Link สำหรับไปหน้าต่างๆ */}
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/tasks" style={{ marginRight: '1rem' }}>งานของฉัน</Link>
        <Link to="/tasks/available">หางาน</Link>
      </nav>
      
      {/* 3. เพิ่ม Route สำหรับแสดงผลแต่ละหน้า */}
      <Routes>
        <Route path="/tasks" element={<MyTasksPage />} />
        <Route path="/tasks/available" element={<AvailableTasksPage />} />
      </Routes>
    
    </>
  )
}

export default App