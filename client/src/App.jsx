import React from 'react';
import ChannelSelect from './components/ChannelSelector';
import SheetRowList from './components/SheetRowList';
import CanvasView from './components/CanvasView';
import OverlayInspector from './components/OverlayInspector';
import TimelineEditor from './components/TimelineEditor';
import PresetPanel from './components/PresetPanel';
import useEditorStore from './store/useEditorStore';

export default function App() {
  const meta = useEditorStore((s) => s.meta);
  const loadMock = useEditorStore.getState().loadMockData;

  React.useEffect(() => {
    loadMock();
  }, []);

  return (
    <div className="min-h-screen p-4 bg-slate-900 text-white">
      <div className="max-w-[1800px] mx-auto grid grid-cols-12 gap-4">

        {/* LEFT SIDEBAR */}
        <aside className="col-span-3 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Sheet Projects</h2>
            <ChannelSelect />
            <SheetRowList className="mt-4" />
          </div>

          <PresetPanel />
        </aside>

        {/* MIDDLE CANVAS */}
        <main className="col-span-6 space-y-4">

          {/* Toolbar */}
          <div className="bg-slate-800 rounded p-3">
            <div className="flex items-center gap-2">

              <button
                className="px-3 py-1 bg-sky-600 rounded text-sm"
                onClick={() => useEditorStore.getState().addOverlay('image')}
              >
                Add Image
              </button>

              <button
                className="px-3 py-1 bg-green-600 rounded text-sm"
                onClick={() => useEditorStore.getState().addOverlay('video')}
              >
                Add Video
              </button>

              <button
                className="px-3 py-1 bg-amber-500 rounded text-sm"
                onClick={() => useEditorStore.getState().addOverlay('text')}
              >
                Add Text
              </button>

              <button
                className="px-3 py-1 bg-violet-600 rounded text-sm"
                onClick={() => useEditorStore.getState().addOverlay('music')}
              >
                Add Music
              </button>

              <button
                className="px-3 py-1 bg-pink-600 rounded text-sm"
                onClick={() => useEditorStore.getState().addOverlay('chapter')}
              >
                Add Chapter Anim
              </button>

              {/* META */}
              <span className="ml-auto text-sm text-slate-300">
                Res: <strong>{meta?.resolution}</strong> &nbsp;
                FPS: <strong>{meta?.fps}</strong>
              </span>
            </div>

            <div className="mt-4">
              <CanvasView />
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-slate-800 rounded p-3">
            <TimelineEditor />
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="col-span-3">
          <div className="bg-slate-800 rounded p-3 h-full overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3">Inspector</h3>
            <OverlayInspector />
          </div>
        </aside>

      </div>
    </div>
  );
}
