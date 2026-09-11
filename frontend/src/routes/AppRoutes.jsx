import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from '../pages/error/NotFound';
import MarketingWebsite from '../pages/landing/MarketingWebsite';
import MobileDestinationPage from '../pages/landing/MobileDestinationPage';
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../components/adminUI/AdminLayout';
import Overview from '../pages/dashboard/Overview';
import DynamicQRCodes from '../pages/dashboard/DynamicQRCodes';
import CreateDynamicQR from '../pages/dashboard/CreateDynamicQR';
import QRDetail from '../pages/dashboard/QRDetail';
import BulkQRGeneration from '../pages/dashboard/BulkQRGeneration';
import VideoLibrary from '../pages/dashboard/VideoLibrary';
import CTAManager from '../pages/dashboard/CTAManager';
import StaticQRCodes from '../pages/dashboard/StaticQRCodes';
import CreateStaticQR from '../pages/dashboard/CreateStaticQR';
import Analytics from '../pages/dashboard/Analytics';
import CampaignHistory from '../pages/dashboard/CampaignHistory';
import CampaignDetail from '../pages/dashboard/CampaignDetail';
import CreateCampaign from '../pages/dashboard/CreateCampaign';
import EditCampaign from '../pages/dashboard/EditCampaign';
import CreateVersion from '../pages/dashboard/CreateVersion';
import LandingContent from '../pages/dashboard/LandingContent';
import Settings from '../pages/dashboard/Settings';
import Notifications from '../pages/dashboard/Notifications';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MarketingWebsite />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/preview" element={<MobileDestinationPage />} />
        <Route path="/r/:qrId" element={<MobileDestinationPage />} />

        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Overview />} />
          <Route path="dynamic-qr" element={<DynamicQRCodes />} />
          <Route path="dynamic-qr/create" element={<CreateDynamicQR />} />
          <Route path="dynamic-qr/bulk" element={<BulkQRGeneration />} />
          <Route path="dynamic-qr/:qrId" element={<QRDetail />} />
          <Route path="static-qr" element={<StaticQRCodes />} />
          <Route path="static-qr/create" element={<CreateStaticQR />} />
          <Route path="videos" element={<VideoLibrary />} />
          <Route path="cta" element={<CTAManager />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="campaign-history" element={<CampaignHistory />} />
          <Route path="campaign/:campaignId" element={<CampaignDetail />} />
          <Route path="campaign/create" element={<CreateCampaign />} />
          <Route path="campaign/edit/:campaignId" element={<EditCampaign />} />
          <Route path="campaign/:campaignId/version/create" element={<CreateVersion />} />
          <Route path="settings" element={<Settings />} />
          <Route path="landing-content" element={<LandingContent />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
