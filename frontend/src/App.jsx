import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { ClerkProvider } from "@clerk/clerk-react";
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const App = () => {
  return (
    <div>
      <ClerkProvider publishableKey={clerkPubKey}>
        <AppRoutes />
      </ClerkProvider>
    </div>
  );
};

export default App;
