import { createRoot } from 'react-dom/client';
import Sidebar from './components/Sidebar';
import PageTemplate from './components/Page1';
import Editor from './components/Editor';

const root = createRoot(document.body);
root.render(
    <div className="app">
        <Sidebar />
        <PageTemplate title="Notes" children={<Editor />} />
    </div>
);