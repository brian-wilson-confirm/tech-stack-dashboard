import { Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Breadcrumbs } from './components/Breadcrumbs'
import TechStack from './pages/Dashboard'

// Frontend pages
import RuntimeEnvPage from './pages/frontend/RuntimeEnvPage'
import BuildToolsPage from './pages/frontend/BuildToolsPage'
import UIFrameworksPage from './pages/frontend/UIFrameworksPage'
import JSLibrariesPage from './pages/frontend/JSLibrariesPage'
import FrontendTestingPage from './pages/frontend/FrontendTestingPage'

// Middleware pages
import APIGatewayPage from './pages/middleware/APIGatewayPage'
import APILayerPage from './pages/middleware/APILayerPage'

// Backend pages
import BackendRuntimePage from './pages/backend/RuntimePage'
import WebFrameworksPage from './pages/backend/WebFrameworksPage'
import APIFrameworksPage from './pages/backend/APIFrameworksPage'
import BackendTestingPage from './pages/backend/BackendTestingPage'
import LanguagesPage from './pages/backend/LanguagesPage'

// Database pages
import SQLDatabasesPage from './pages/database/SQLDatabasesPage'
import NoSQLDatabasesPage from './pages/database/NoSQLDatabasesPage'
import ObjectStoragePage from './pages/database/ObjectStoragePage'
import CachePage from './pages/database/CachePage'
import SearchPage from './pages/database/SearchPage'

// Messaging pages
import MessageBrokersPage from './pages/messaging/MessageBrokersPage'
import MessageQueuesPage from './pages/messaging/MessageQueuesPage'
import TaskQueuesPage from './pages/messaging/TaskQueuesPage'

// DevOps pages
import VersionControlPage from './pages/devops/VersionControlPage'
import CDNPage from './pages/devops/CDNPage'
import ContainersPage from './pages/devops/ContainersPage'
import OrchestrationPage from './pages/devops/OrchestrationPage'
import IaCPage from './pages/devops/IaCPage'
import CICDPage from './pages/devops/CICDPage'

// Security pages
import AuthenticationPage from './pages/security/AuthenticationPage'
import AuthorizationPage from './pages/security/AuthorizationPage'

// Monitoring pages
import LoggingPage from './pages/monitoring/LoggingPage'
import TracingPage from './pages/monitoring/TracingPage'
import AlertingPage from './pages/monitoring/AlertingPage'

// Other pages
import TravelPage from './pages/TravelPage'
import TasksPage from './pages/TasksPage'
import AssessmentsPage from './pages/AssessmentsPage'

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar className="border-r" />
      <div className="flex-1 flex flex-col min-h-screen">
        <Breadcrumbs />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<TechStack />} />
            
            {/* Frontend routes */}
            <Route path="/frontend/runtime" element={<RuntimeEnvPage />} />
            <Route path="/frontend/build-tools" element={<BuildToolsPage />} />
            <Route path="/frontend/ui-frameworks" element={<UIFrameworksPage />} />
            <Route path="/frontend/libraries" element={<JSLibrariesPage />} />
            <Route path="/frontend/testing" element={<FrontendTestingPage />} />
            
            {/* Middleware routes */}
            <Route path="/middleware/api-gateway" element={<APIGatewayPage />} />
            <Route path="/middleware/api-layer" element={<APILayerPage />} />
            
            {/* Backend routes */}
            <Route path="/backend/runtime" element={<BackendRuntimePage />} />
            <Route path="/backend/languages" element={<LanguagesPage />} />
            <Route path="/backend/web-frameworks" element={<WebFrameworksPage />} />
            <Route path="/backend/api-frameworks" element={<APIFrameworksPage />} />
            <Route path="/backend/testing" element={<BackendTestingPage />} />
            
            {/* Database routes */}
            <Route path="/database/sql" element={<SQLDatabasesPage />} />
            <Route path="/database/nosql" element={<NoSQLDatabasesPage />} />
            <Route path="/database/object-storage" element={<ObjectStoragePage />} />
            <Route path="/database/cache" element={<CachePage />} />
            <Route path="/database/search" element={<SearchPage />} />
            
            {/* Messaging routes */}
            <Route path="/messaging/brokers" element={<MessageBrokersPage />} />
            <Route path="/messaging/queues" element={<MessageQueuesPage />} />
            <Route path="/messaging/tasks" element={<TaskQueuesPage />} />
            
            {/* DevOps routes */}
            <Route path="/devops/version-control" element={<VersionControlPage />} />
            <Route path="/devops/cdn" element={<CDNPage />} />
            <Route path="/devops/containers" element={<ContainersPage />} />
            <Route path="/devops/orchestration" element={<OrchestrationPage />} />
            <Route path="/devops/iac" element={<IaCPage />} />
            <Route path="/devops/cicd" element={<CICDPage />} />
            
            {/* Security routes */}
            <Route path="/security/auth" element={<AuthenticationPage />} />
            <Route path="/security/authz" element={<AuthorizationPage />} />
            
            {/* Monitoring routes */}
            <Route path="/monitoring/logging" element={<LoggingPage />} />
            <Route path="/monitoring/tracing" element={<TracingPage />} />
            <Route path="/monitoring/alerting" element={<AlertingPage />} />
            
            {/* Other routes */}
            <Route path="/assessments" element={<AssessmentsPage />} />
            <Route path="/travel" element={<TravelPage />} />
            <Route path="/tasks" element={<TasksPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
