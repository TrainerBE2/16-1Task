import Routes from "./routes/Routes";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "./config/theme";
import createEmotionCache from "./config/createEmotionCache";
import AppProvider from "./contexts/index";
import { CookiesProvider } from "react-cookie";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import './App.css';
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps {
  emotionCache?: EmotionCache;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
});

function App(props: MyAppProps) {
  const {
    emotionCache = clientSideEmotionCache,
  } = props;

  if (true) {
    console.log = () => { };
    console.error = () => { };
    console.debug = () => { };
  }

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <CacheProvider value={emotionCache}>
            <Routes />
          </CacheProvider>
        </CookiesProvider>
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
