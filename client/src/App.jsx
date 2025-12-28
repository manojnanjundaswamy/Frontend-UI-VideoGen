import React from 'react';
import useEditorStore from './store/useEditorStore';
import Layout from './components/ui/Layout';
import Button from './components/ui/Button';

// Components
import ChannelSelect from './components/ChannelSelector';
import SheetRowList from './components/SheetRowList';
import CanvasView from './components/CanvasView';
import OverlayInspector from './components/OverlayInspector';
import TimelineEditor from './components/TimelineEditor';
import PresetPanel from './components/PresetPanel';

import { Image as ImageIcon, Video, Type, Music, PlaySquare, Settings, LayoutTemplate } from 'lucide-react';

export default function App() {
  const meta = useEditorStore((s) => s.meta);
  const loadMock = useEditorStore.getState().loadMockData;
  const addOverlay = useEditorStore.getState().addOverlay;

  React.useEffect(() => {
    loadMock();
  }, []);

  // Left Sidebar Content
  const LeftSidebar = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/5">
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent flex items-center gap-2">
          <PlaySquare className="w-6 h-6 text-indigo-500" />
          VideoGen
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            Config
          </div>
          <ChannelSelect />
          <div className="mt-4">
            <SheetRowList />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">
            <LayoutTemplate className="w-4 h-4" />
            Presets
          </div>
          <PresetPanel />
        </section>
      </div>
    </div>
  );

  // Right Sidebar Content
  const RightSidebar = (
    <div className="flex flex-col h-full bg-slate-900/30">
      <div className="p-4 border-b border-white/5 font-semibold text-slate-200">
        Inspector
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <OverlayInspector />
      </div>
    </div>
  );

  return (
    <Layout leftSidebar={LeftSidebar} rightSidebar={RightSidebar}>

      {/* Toolbar Area */}
      <div className="h-14 border-b border-white/5 flex items-center px-6 justify-between bg-slate-900/20 backdrop-blur-sm z-30">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" icon={ImageIcon} onClick={() => addOverlay('image')}>
            Image
          </Button>
          <Button size="sm" variant="secondary" icon={Video} onClick={() => addOverlay('video')}>
            Video
          </Button>
          <Button size="sm" variant="secondary" icon={Type} onClick={() => addOverlay('text')}>
            Text
          </Button>
          <Button size="sm" variant="secondary" icon={Music} onClick={() => addOverlay('music')}>
            Music
          </Button>
          <div className="w-px h-6 bg-white/10 mx-2" />
          <Button size="sm" variant="outline" onClick={() => addOverlay('chapter')}>
            + Chapter Anim
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-500 font-mono">
            {meta?.resolution || '1920:1080'}
          </div>
          <Button size="sm" variant="primary">
            Export Project
          </Button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex-1 flex flex-col min-h-0">

        {/* Top: Canvas */}
        <div className="flex-[3] min-h-0 bg-[#050505] relative border-b border-white/5">
          <CanvasView />
        </div>

        {/* Bottom: Timeline */}
        <div className="flex-[2] min-h-0 bg-slate-900/40 backdrop-blur-md overflow-y-auto custom-scrollbar p-4">
          <TimelineEditor />
        </div>

      </div>

    </Layout>
  );
}
