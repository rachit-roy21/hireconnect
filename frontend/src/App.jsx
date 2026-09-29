import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import CompaniesPage from './pages/CompaniesPage';
import AlumniNetworkPage from './pages/AlumniNetworkPage';
import AlumniPublicProfilePage from './pages/AlumniPublicProfilePage';
import CompanyReviewsPage from './pages/CompanyReviewsPage';
import InterviewExperiencesPage from './pages/InterviewExperiencesPage';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentApplicationsPage from './pages/student/StudentApplicationsPage';
import StudentSavedJobsPage from './pages/student/StudentSavedJobsPage';
import StudentReferralsPage from './pages/student/StudentReferralsPage';
import StudentRecommendationsPage from './pages/student/StudentRecommendationsPage';
import StudentAiAssistantPage from './pages/student/StudentAiAssistantPage';

import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterProfilePage from './pages/recruiter/RecruiterProfilePage';
import RecruiterJobsPage from './pages/recruiter/RecruiterJobsPage';
import RecruiterPostJobPage from './pages/recruiter/RecruiterPostJobPage';
import RecruiterApplicantsPage from './pages/recruiter/RecruiterApplicantsPage';

import AlumniDashboard from './pages/alumni/AlumniDashboard';
import AlumniProfilePage from './pages/alumni/AlumniProfilePage';
import AlumniReferralsPage from './pages/alumni/AlumniReferralsPage';
import AlumniShareExperiencePage from './pages/alumni/AlumniShareExperiencePage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCompaniesPage from './pages/admin/AdminCompaniesPage';
import AdminJobsPage from './pages/admin/AdminJobsPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';
import AdminModerationPage from './pages/admin/AdminModerationPage';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/alumni-network" element={<AlumniNetworkPage />} />
            <Route path="/alumni-network/:id" element={<AlumniPublicProfilePage />} />
            <Route path="/company-reviews" element={<CompanyReviewsPage />} />
            <Route path="/interview-experiences" element={<InterviewExperiencesPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            <Route path="/messages" element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />

            <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfilePage /></ProtectedRoute>} />
            <Route path="/student/applications" element={<ProtectedRoute allowedRoles={['student']}><StudentApplicationsPage /></ProtectedRoute>} />
            <Route path="/student/saved-jobs" element={<ProtectedRoute allowedRoles={['student']}><StudentSavedJobsPage /></ProtectedRoute>} />
            <Route path="/student/referrals" element={<ProtectedRoute allowedRoles={['student']}><StudentReferralsPage /></ProtectedRoute>} />
            <Route path="/student/recommendations" element={<ProtectedRoute allowedRoles={['student']}><StudentRecommendationsPage /></ProtectedRoute>} />
            <Route path="/student/ai-assistant" element={<ProtectedRoute allowedRoles={['student']}><StudentAiAssistantPage /></ProtectedRoute>} />

            <Route path="/recruiter/dashboard" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>} />
            <Route path="/recruiter/profile" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterProfilePage /></ProtectedRoute>} />
            <Route path="/recruiter/jobs" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterJobsPage /></ProtectedRoute>} />
            <Route path="/recruiter/jobs/new" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterPostJobPage /></ProtectedRoute>} />
            <Route path="/recruiter/jobs/:id/edit" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterPostJobPage /></ProtectedRoute>} />
            <Route path="/recruiter/jobs/:id/applicants" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterApplicantsPage /></ProtectedRoute>} />

            <Route path="/alumni/dashboard" element={<ProtectedRoute allowedRoles={['alumni']}><AlumniDashboard /></ProtectedRoute>} />
            <Route path="/alumni/profile" element={<ProtectedRoute allowedRoles={['alumni']}><AlumniProfilePage /></ProtectedRoute>} />
            <Route path="/alumni/referrals" element={<ProtectedRoute allowedRoles={['alumni']}><AlumniReferralsPage /></ProtectedRoute>} />
            <Route path="/alumni/share-experience" element={<ProtectedRoute allowedRoles={['alumni']}><AlumniShareExperiencePage /></ProtectedRoute>} />

            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsersPage /></ProtectedRoute>} />
            <Route path="/admin/companies" element={<ProtectedRoute allowedRoles={['admin']}><AdminCompaniesPage /></ProtectedRoute>} />
            <Route path="/admin/jobs" element={<ProtectedRoute allowedRoles={['admin']}><AdminJobsPage /></ProtectedRoute>} />
            <Route path="/admin/applications" element={<ProtectedRoute allowedRoles={['admin']}><AdminApplicationsPage /></ProtectedRoute>} />
            <Route path="/admin/moderation" element={<ProtectedRoute allowedRoles={['admin']}><AdminModerationPage /></ProtectedRoute>} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
