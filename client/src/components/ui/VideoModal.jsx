import React from 'react';
import { X } from 'lucide-react';

export default function VideoModal({ url, onClose }) {
    if (!url) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div
                className="relative bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-w-4xl w-full mx-4 overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-900">
                    <h3 className="text-sm font-medium text-slate-200">Video Preview</h3>
                    <button
                        onClick={() => {
                            console.log("Closing VideoModal");
                            onClose();
                        }}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="relative aspect-video bg-black">
                    <video
                        src={url}
                        controls
                        autoPlay
                        className="w-full h-full"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </div>
    );
}
