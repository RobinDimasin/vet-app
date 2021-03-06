import NavigationBar from "@components/NavigationBar/NavigationBar";
import { QueryClient, QueryClientProvider } from "react-query";
import "@styles/globals.css";
import AccountProvider from "@components/context/Account/AccountProvider";
import ModalProvider from "@components/context/Modal/ModalProvider";
import Modal from "react-modal";
import { THEME } from "@utility/theme";
import Head from "next/head";

const queryClient = new QueryClient();

Modal.setAppElement("#__next");

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Vetreatment: Pet Clinic</title>
        <meta
          property="og:title"
          content="Vetreatment: Pet Clinic"
          key="title"
        />
        <link rel="icon" href="/image/logo.png" />
      </Head>
      <div data-theme={THEME}>
        <div id="myApp">
          <QueryClientProvider client={queryClient}>
            <ModalProvider>
              <AccountProvider>
                {/* <div className="from-primary to-base-100 bg-gradient-to-r min-h-screen"> */}
                <div className="bg-base-300 min-h-screen">
                  <NavigationBar />
                  <Component {...pageProps} />
                </div>
              </AccountProvider>
            </ModalProvider>
          </QueryClientProvider>
        </div>
      </div>
    </>
  );
}

export default MyApp;
