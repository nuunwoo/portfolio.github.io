import './App.css';
import SystemUI from './system-ui/SystemUI';
import Bootstrap from '../features/bootstrap';
import {useSystemAppearance} from '../shared/hooks/useSystemAppearance';

const App = () => {
  const systemAppearance = useSystemAppearance();

  return (
    <main data-appearance={systemAppearance}>
      <SystemUI />
      <Bootstrap />
    </main>
  );
};

export default App;
