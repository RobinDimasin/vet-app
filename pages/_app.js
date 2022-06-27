import NavigationBar from "@components/NavigationBar/NavigationBar";
import { QueryClient, QueryClientProvider } from "react-query";
import "@styles/globals.css";
import AccountProvider from "@components/context/Account/AccountProvider";
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AccountProvider>
        <div data-theme="cupcake">
          <NavigationBar />
          <Component {...pageProps} />
        </div>
      </AccountProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
