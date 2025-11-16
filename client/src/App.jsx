import React from 'react';
import SheetSyncPanel from './components/SheetSyncPanel';
import EditorCanvas from './components/EditorCanvas';
import PreviewPanel from './components/PreviewPanel';
import TimelineEditor from './components/TimelineEditor';
import OverlayInspector from './components/OverlayInspector';
import { useEditorStore } from './store/useEditorStore';

export default function App() {
  const { selectedRow } = useEditorStore();
  return (
    <div className="h-screen flex">
      <div className="w-96 border-r border-gray-700 p-3 bg-slate-900">
        <SheetSyncPanel />
      </div>

      <div className="flex-1 p-3 flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="flex-1 bg-slate-800 rounded p-3">
            <EditorCanvas />
          </div>

          <div className="w-80 bg-slate-800 rounded p-3">
            <OverlayInspector />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 bg-slate-800 rounded p-3">
            <TimelineEditor />
          </div>
          <div className="w-96 bg-slate-800 rounded p-3">
            <PreviewPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
