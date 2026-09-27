// Root application component with routing and global providers.
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './features/landing/LandingPage.jsx'
import LoginPage from './features/auth/LoginPage.jsx'
import SignUpPage from './features/auth/SignUpPage.jsx'
import RoleSelectionPage from './features/auth/RoleSelectionPage.jsx'
import BrowseCompaniesPage from './features/companies/BrowseCompaniesPage.jsx'
import CompanyProfilePage from './features/companies/CompanyProfilePage.jsx'
import BrowseWorkersPage from './features/workers/BrowseWorkersPage.jsx'
import WorkerOnboarding from './features/onboarding/WorkerOnboarding.jsx'
import CompanyOnboarding from './features/onboarding/CompanyOnboarding.jsx'
import WorkerDashboard from './features/dashboard/WorkerDashboard.jsx'
import CompanyDashboard from './features/dashboard/CompanyDashboard.jsx'
import AccountPage from './features/account/AccountPage.jsx'
import SettingsPage from './features/account/SettingsPage.jsx'
import BrowseJobsPage from './features/jobs/BrowseJobsPage.jsx'
import BrowseJobsV2 from './features/jobs/BrowseJobsV2.jsx'
import JobDetailPage from './features/jobs/JobDetailPage.jsx'
import PostJobPage from './features/jobs/PostJobPage.jsx'
import ManageJobsPage from './features/jobs/ManageJobsPage.jsx'
import WorkerProfilePage from './features/workers/WorkerProfilePage.jsx'
import ContractPage from './features/contracts/ContractPage.jsx'
import ContractsPage from './features/contracts/ContractsPage.jsx'
import MessagesPage from './features/messages/MessagesPage.jsx'
import BrowseTeamsPage from './features/teams/BrowseTeamsPage.jsx'
import CreateTeamPage from './features/teams/CreateTeamPage.jsx'
import TeamListingPage from './features/teams/TeamListingPage.jsx'
import ManageTeamsPage from './features/teams/ManageTeamsPage.jsx'
import ApplicantsReviewPage from './features/teams/ApplicantsReviewPage.jsx'
import TeamWorkspacePage from './features/teams/TeamWorkspacePage.jsx'
import TeamManagementPage from './features/teams/TeamManagementPage.jsx'
import WorkerEarningsPage from './features/payments/WorkerEarningsPage.jsx'
import CompanyBalancePage from './features/payments/CompanyBalancePage.jsx'
import TransactionHistoryPage from './features/payments/TransactionHistoryPage.jsx'
import LeaveReviewPage from './features/reviews/LeaveReviewPage.jsx'
import ProjectCompletionSummaryPage from './features/reviews/ProjectCompletionSummaryPage.jsx'
// Admin / Support (PRD 5.11)
import AdminDashboard from './features/admin/AdminDashboard.jsx'
import VerificationQueuePage from './features/admin/VerificationQueuePage.jsx'
import AdminDisputesPage from './features/admin/AdminDisputesPage.jsx'
import AdminDisputeDetailPage from './features/admin/AdminDisputeDetailPage.jsx'
import UsersPage from './features/admin/UsersPage.jsx'
import ModerationPage from './features/admin/ModerationPage.jsx'
import ActivityLogPage from './features/admin/ActivityLogPage.jsx'
import RaiseDisputePage from './features/disputes/RaiseDisputePage.jsx'
import DisputePage from './features/disputes/DisputePage.jsx'
import HelpCenterPage from './features/support/HelpCenterPage.jsx'
import HelpArticlePage from './features/support/HelpArticlePage.jsx'
import ContactSupportPage from './features/support/ContactSupportPage.jsx'
import MyTicketsPage from './features/support/MyTicketsPage.jsx'
import TicketDetailPage from './features/support/TicketDetailPage.jsx'
import SafetyPoliciesPage from './features/support/SafetyPoliciesPage.jsx'
// Gigs marketplace (PRD 5.6 / Phase 4)
import BrowseGigsPage from './features/gigs/BrowseGigsPage.jsx'
import GigDetailPage from './features/gigs/GigDetailPage.jsx'
import OrderGigPage from './features/gigs/OrderGigPage.jsx'
import PostGigPage from './features/gigs/PostGigPage.jsx'
import ManageGigsPage from './features/gigs/ManageGigsPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { JobProvider } from './context/JobContext.jsx'
import { GigProvider } from './context/GigContext.jsx'
import { ContractProvider } from './context/ContractContext.jsx'
import { MessageProvider } from './context/MessageContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { TeamProvider } from './context/TeamContext.jsx'
import { FinanceProvider } from './context/FinanceContext.jsx'
import { ReviewProvider } from './context/ReviewContext.jsx'
import { DisputeProvider } from './context/DisputeContext.jsx'
import { AdminProvider } from './context/AdminContext.jsx'
import { SupportProvider } from './context/SupportContext.jsx'

// Base path for GitHub Pages project site (/TechWorkly/); plain "/" in local dev.
const routerBasename = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/'

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <JobProvider>
        <GigProvider>
        <ContractProvider>
          <MessageProvider>
            <NotificationProvider>
              <TeamProvider>
                <FinanceProvider>
                  <ReviewProvider>
                    <DisputeProvider>
                      <AdminProvider>
                        <SupportProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/role-selection" element={<RoleSelectionPage />} />
            <Route path="/browse-companies" element={<BrowseCompaniesPage />} />
            <Route path="/companies/:slug" element={<CompanyProfilePage />} />
            <Route path="/browse-workers" element={<BrowseWorkersPage />} />
            <Route path="/workers/:slug" element={<WorkerProfilePage />} />
            <Route path="/browse-jobs" element={<BrowseJobsPage />} />
            <Route path="/browse-v2" element={<BrowseJobsV2 />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />

            {/* Help / Support center (PRD 5.11 — public) */}
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/help/article/:slug" element={<HelpArticlePage />} />
            <Route path="/help/contact" element={<ContactSupportPage />} />
            <Route path="/help/tickets" element={<MyTicketsPage />} />
            <Route path="/help/tickets/:id" element={<TicketDetailPage />} />
            <Route path="/help/safety" element={<SafetyPoliciesPage />} />

            {/* Onboarding routes */}
            <Route path="/onboarding/worker" element={<WorkerOnboarding />} />
            <Route path="/onboarding/company" element={<CompanyOnboarding />} />

            {/* Dashboard routes */}
            <Route path="/dashboard/worker" element={<WorkerDashboard />} />
            <Route path="/dashboard/company" element={<CompanyDashboard />} />
            <Route path="/dashboard/company/jobs" element={<ManageJobsPage />} />
            <Route path="/dashboard/company/jobs/new" element={<PostJobPage />} />
            <Route path="/dashboard/company/jobs/:id/edit" element={<PostJobPage />} />

            {/* Contract routes (offers, escrow, milestones) */}
            <Route path="/contracts/:id" element={<ContractPage />} />
            <Route path="/dashboard/company/contracts" element={<ContractsPage />} />
            <Route path="/dashboard/worker/contracts" element={<ContractsPage />} />

            {/* Dispute routes (participant flow — PRD 5.11) */}
            <Route path="/disputes/new" element={<RaiseDisputePage />} />
            <Route path="/disputes/:id" element={<DisputePage />} />

            {/* Team-Based Hiring routes (PRD 5.5) */}
            <Route path="/teams" element={<BrowseTeamsPage />} />
            <Route path="/teams/:id" element={<TeamListingPage />} />
            <Route path="/teams/:id/workspace" element={<TeamWorkspacePage />} />
            <Route path="/teams/:id/manage" element={<TeamManagementPage />} />
            <Route path="/dashboard/company/teams" element={<ManageTeamsPage />} />
            <Route path="/dashboard/company/teams/new" element={<CreateTeamPage />} />
            <Route
              path="/dashboard/company/teams/:id/applicants"
              element={<ApplicantsReviewPage />}
            />

            {/* Communication routes (messages/chat) */}
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/messages/:id" element={<MessagesPage />} />

            {/* Financial routes (PRD 5.9 — balances strictly private) */}
            <Route path="/dashboard/worker/earnings" element={<WorkerEarningsPage />} />
            <Route path="/dashboard/company/balance" element={<CompanyBalancePage />} />
            <Route path="/dashboard/transactions" element={<TransactionHistoryPage />} />

            {/* Reviews & Completion routes (PRD 5.10) */}
            <Route path="/contracts/:id/summary" element={<ProjectCompletionSummaryPage />} />
            <Route path="/contracts/:id/review" element={<LeaveReviewPage />} />

            {/* Admin routes (PRD 5.11 — role-gated) */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/verifications"
              element={
                <ProtectedRoute requiredRole="admin">
                  <VerificationQueuePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/disputes"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDisputesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/disputes/:id"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDisputeDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/moderation"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ModerationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/activity"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ActivityLogPage />
                </ProtectedRoute>
              }
            />

            {/* Gigs marketplace routes (PRD 5.6) */}
            <Route path="/browse-gigs" element={<BrowseGigsPage />} />
            <Route path="/gigs/:id" element={<GigDetailPage />} />
            <Route path="/gigs/:id/order" element={<OrderGigPage />} />
            <Route path="/dashboard/worker/gigs" element={<ManageGigsPage />} />
            <Route path="/dashboard/worker/gigs/new" element={<PostGigPage />} />
            <Route path="/dashboard/worker/gigs/:id/edit" element={<PostGigPage />} />

            {/* Account routes */}
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/settings" element={<SettingsPage />} />
          </Routes>
                        </SupportProvider>
                      </AdminProvider>
                    </DisputeProvider>
                  </ReviewProvider>
                </FinanceProvider>
              </TeamProvider>
            </NotificationProvider>
          </MessageProvider>
        </ContractProvider>
        </GigProvider>
      </JobProvider>
    </BrowserRouter>
  )
}
