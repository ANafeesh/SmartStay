import AuthPortal from "./auth/AuthPortal";

/**
 * Primary Landing Route
 * Displays the Unified Authentication Portal (Sign In & Sign Up)
 */
export default function Home() {
  return <AuthPortal initialTab="login" />;
}
