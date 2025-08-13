import { Routes, Route, Navigate } from "react-router-dom";
import MainPage from "~/pages/MainPage"; // 별칭(~) 설정되어 있어야 함

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
