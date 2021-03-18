import { AppRouter } from './router/AppRouter';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <div>
        <AppRouter></AppRouter>
      </div>
    </SnackbarProvider>
  );
}

export default App;
