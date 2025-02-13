import { createRoot } from 'react-dom/client';
import Sidebar from './components/Sidebar';
import Page1 from './components/Page1';

const root = createRoot(document.body);
root.render(
    <div className="app">
        <Sidebar />
        <Page1 />
    </div>
);