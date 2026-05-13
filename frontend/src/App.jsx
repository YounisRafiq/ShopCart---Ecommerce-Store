import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { ClerkProvider } from "@clerk/clerk-react";
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
import logo from "../src/assets/logo.png"
const App = () => {
  return (
    <div>
      <ClerkProvider publishableKey={clerkPubKey}
      appearance={{
        layout : {
          logoImageUrl : {logo}
        }
      }}
      >
        <AppRoutes />
      </ClerkProvider>
    </div>
  );
};

export default App;
