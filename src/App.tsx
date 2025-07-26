import "./App.css";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Auth } from "./pages/auth";
import { FinancialRecordsProvider } from "./contexts/financial-record-context";
import { SignedIn, UserButton } from "@clerk/clerk-react";

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="navbar">
          <Link to="/"> Dashboard</Link>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <FinancialRecordsProvider>
                <Dashboard />
              </FinancialRecordsProvider>
            }
          />
          <Route path="/auth" element={<Auth />} />
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
