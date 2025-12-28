import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 border border-indigo-500/50",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20",
    ghost: "hover:bg-white/5 text-slate-400 hover:text-white",
    outline: "border-2 border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white bg-transparent"
};

const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-9 w-9 p-0 flex items-center justify-center"
};

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    loading = false,
    disabled,
    icon: Icon,
    ...props
}) {
    return (
        <button
            className={`
        relative inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-indigo-500/50
        active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : Icon ? (
                <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''}`} />
            ) : null}
            {children}
        </button>
    );
}
