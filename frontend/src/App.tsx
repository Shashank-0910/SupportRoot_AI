import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MarketingLayout from './components/marketing/MarketingLayout';
import DemoLayout from './components/layout/DemoLayout';
import Landing from './pages/Landing';
import ProductPage from './pages/ProductPage';
import SolutionsPage from './pages/SolutionsPage';
import FeaturesPage from './pages/FeaturesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import IntegrationsPage from './pages/IntegrationsPage';
import PricingPage from './pages/PricingPage';
import ResourcesPage from './pages/ResourcesPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import DemoDashboard from './pages/DemoDashboard';
import DemoPlaceholder from './pages/DemoPlaceholder';
import Conversations from './pages/Conversations';
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';
import KnowledgeBase from './pages/KnowledgeBase';
import AIAssistant from './pages/AIAssistant';
import ConversationDetail from './pages/ConversationDetail';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';
import Settings from './pages/Settings';
import DashboardLayout from './components/layout/DashboardLayout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Marketing */}
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
          </Route>

          {/* Public demo — no signup */}
          <Route element={<DemoLayout />}>
            <Route path="/demo" element={<DemoDashboard />} />
            <Route path="/demo/conversations" element={<Conversations />} />
            <Route path="/demo/analytics" element={<Analytics />} />
            <Route
              path="/demo/knowledge-base"
              element={
                <DemoPlaceholder
                  title="Knowledge Base"
                  description="Upload docs and power your AI. Create a free account to try the full knowledge base."
                />
              }
            />
            <Route
              path="/demo/assistant"
              element={
                <DemoPlaceholder
                  title="AI Assistant"
                  description="Chat against your knowledge base. Sign up to use the live assistant in your workspace."
                />
              }
            />
            <Route
              path="/demo/tickets"
              element={
                <DemoPlaceholder
                  title="Tickets"
                  description="Escalate chats into tickets. Available after you create an account."
                />
              }
            />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* App */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/conversations" element={<Conversations />} />
            <Route path="/conversations/:id" element={<ConversationDetail />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
