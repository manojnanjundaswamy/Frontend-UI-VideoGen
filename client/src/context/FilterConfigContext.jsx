// src/context/FilterConfigContext.jsx
import React, { createContext, useReducer } from 'react';

const initialFilterConfig = {
  meta: { /* ...default meta values... */ },
  timing: { chapter_transition_duration: 3, chapter_fade_in: 0.8, chapter_fade_out: 0.8 },
  visual_overlays: {},
  text_overlays: {},
  audio_overlays: {},
  transitions_overlays: {},
};

function filterConfigReducer(state, action) {
  switch (action.type) {
    case 'LOAD_CONFIG':
      return action.payload;
    case 'UPDATE_META':
      return { ...state, meta: { ...state.meta, ...action.payload } };
    case 'ADD_VISUAL_OVERLAY':
      return {
        ...state,
        visual_overlays: { ...state.visual_overlays, [action.key]: action.overlay },
      };
    case 'UPDATE_VISUAL_OVERLAY':
      return {
        ...state,
        visual_overlays: {
          ...state.visual_overlays,
          [action.key]: { ...state.visual_overlays[action.key], ...action.changes },
        },
      };
    case 'REMOVE_VISUAL_OVERLAY':
      const newVisuals = { ...state.visual_overlays };
      delete newVisuals[action.key];
      return { ...state, visual_overlays: newVisuals };
    case 'ADD_TEXT_OVERLAY':
      return {
        ...state,
        text_overlays: { ...state.text_overlays, [action.key]: action.overlay },
      };
    case 'UPDATE_TEXT_OVERLAY':
      return {
        ...state,
        text_overlays: {
          ...state.text_overlays,
          [action.key]: { ...state.text_overlays[action.key], ...action.changes },
        },
      };
    case 'REMOVE_TEXT_OVERLAY':
      const newTexts = { ...state.text_overlays };
      delete newTexts[action.key];
      return { ...state, text_overlays: newTexts };
    case 'SET_AUDIO_OVERLAY':
      return {
        ...state,
        audio_overlays: { background_music: action.payload },
      };
    case 'UPDATE_TRANSITIONS':
      return {
        ...state,
        transitions_overlays: { chapter_animation: { ...state.transitions_overlays.chapter_animation, ...action.payload } },
      };
    default:
      return state;
  }
}

export const FilterConfigContext = createContext();

export function FilterConfigProvider({ children }) {
  const [state, dispatch] = useReducer(filterConfigReducer, initialFilterConfig);

  return (
    <FilterConfigContext.Provider value={{ filterConfig: state, dispatch }}>
      {children}
    </FilterConfigContext.Provider>
  );
}
