import React from 'react';
import ChannelSelector from './components/ChannelSelector';
import SheetRowList from './components/SheetRowList';
import CanvasView from './components/CanvasView';
import OverlayInspector from './components/OverlayInspector';
import TimelineEditor from './components/TimelineEditor';
import PresetPanel from './components/PresetPanel';
import useEditorStore from './store/useEditorStore';

export default function App() {
  const loadMock = useEditorStore((s) => s.loadMockData);

  React.useEffect(() => {
    loadMock();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-slate-900 text-slate-100">
      <div className="max-w-[1500px] mx-auto grid grid-cols-12 gap-4">
        {/* Left */}
        <aside className="col-span-3 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Sheet Projects</h2>
            <ChannelSelector />
            <div className="mt-4">
              <SheetRowList />
            </div>
          </div>
          <PresetPanel />
        </aside>

        {/* Center */}
        <main className="col-span-6 space-y-4">
          <div className="bg-slate-800 rounded p-3">
            <div className="flex items-center gap-2 mb-4">
              <button className="px-3 py-1 bg-sky-600 rounded text-sm" onClick={() => useEditorStore.getState().addOverlay('image')}>Add Image</button>
              <button className="px-3 py-1 bg-green-600 rounded text-sm" onClick={() => useEditorStore.getState().addOverlay('video')}>Add Video</button>
              <button className="px-3 py-1 bg-amber-500 rounded text-sm" onClick={() => useEditorStore.getState().addOverlay('text')}>Add Text</button>
              <button className="px-3 py-1 bg-violet-600 rounded text-sm" onClick={() => useEditorStore.getState().addOverlay('music')}>Add Music</button>
              <button className="px-3 py-1 bg-pink-600 rounded text-sm" onClick={() => useEditorStore.getState().addOverlay('chapter')}>Add Chapter Anim</button>

              <div className="ml-auto text-sm text-slate-300">
                Res: <strong>{useEditorStore.getState().meta.resolution}</strong> &nbsp; FPS: <strong>{useEditorStore.getState().meta.fps}</strong>
              </div>
            </div>

            <CanvasView />
          </div>

          <div className="bg-slate-800 rounded p-3">
            <TimelineEditor />
          </div>
        </main>

        {/* Right */}
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
