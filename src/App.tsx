import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ModePage from './pages/ModePage';
import QuestionListPage from './pages/QuestionListPage';
import QuizPage from './pages/QuizPage';
import HistoryPage from './pages/HistoryPage';
import SessionResultPage from './pages/SessionResultPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="exam/:exam" element={<ModePage />} />
          <Route path="exam/:exam/list" element={<QuestionListPage />} />
          <Route path="exam/:exam/quiz" element={<QuizPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="history/:sessionId" element={<SessionResultPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
