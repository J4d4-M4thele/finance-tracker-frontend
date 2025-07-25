import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export const Auth = () => {
  return (
    <div className="sign-in-container">
      <SignedOut>
        <h1> Welcome to Penny Pilot!</h1>
        <p>Your Personal Finance Tracker</p>
        <SignUpButton mode="modal" />
        <SignInButton mode="modal" />
      </SignedOut>
      <SignedIn>
        <Navigate to="/" />
      </SignedIn>
    </div>
  );
};
