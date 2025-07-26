import "./App.css";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Auth } from "./pages/auth";
import { FinancialRecordsProvider } from "./contexts/financial-record-context";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();

  // Show loading while Clerk determines auth state
  if (!isLoaded) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '16px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Redirect to auth if not signed in
  if (!isSignedIn) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if already signed in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useUser();

  // Show loading while Clerk determines auth state
  if (!isLoaded) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '16px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Redirect to dashboard if already signed in
  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="navbar">
          <SignedIn>
            <Link to="/"> Dashboard</Link>
          </SignedIn>
          <SignedOut>
            <Link to="/auth"> Sign In</Link>
          </SignedOut>
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/auth"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                }
              }}
            />
          </SignedIn>
        </div>
        
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <FinancialRecordsProvider>
                  <Dashboard />
                </FinancialRecordsProvider>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/auth" 
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Default options for all toasts
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "500",
              maxWidth: "400px",
            },
            success: {
              duration: 3000,
              style: {
                background: "#10B981",
                color: "white",
              },
              iconTheme: {
                primary: "white",
                secondary: "#10B981",
              },
            },
            // Error toast styling
            error: {
              duration: 5000,
              style: {
                background: "#EF4444",
                color: "white",
              },
              iconTheme: {
                primary: "white",
                secondary: "#EF4444",
              },
            },
            // Loading toast styling
            loading: {
              style: {
                background: "#3B82F6",
                color: "white",
              },
              iconTheme: {
                primary: "white",
                secondary: "#3B82F6",
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;