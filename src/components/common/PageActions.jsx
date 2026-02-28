import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Download, Upload, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * PageActions — a shared "Actions" split-button dropdown used across all main
 * pages of the dashboard.
 *
 * Props:
 *   items  – Array of { label, icon: LucideComponent, onClick, variant? }
 *            variant 'danger' renders the item red.
 *            Add a { separator: true } object to render a divider.
 *   label  – optional button label (default "Actions")
 */
const PageActions = ({ items = [], label = 'Actions' }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer',
                    'bg-pink-600 text-white hover:bg-pink-700 active:bg-pink-800 shadow-sm shadow-pink-200',
                    open && 'bg-pink-700'
                )}
            >
                {label}
                <ChevronDown className={cn('w-4 h-4 transition-transform duration-150', open && 'rotate-180')} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</p>
                    </div>
                    <div className="py-1">
                        {items.map((item, idx) =>
                            item.separator ? (
                                <div key={idx} className="my-1 border-t border-slate-100" />
                            ) : (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => { setOpen(false); item.onClick?.(); }}
                                    className={cn(
                                        'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer text-left',
                                        item.variant === 'danger'
                                            ? 'text-red-600 hover:bg-red-50'
                                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                    )}
                                >
                                    {item.icon && <item.icon className="w-4 h-4 shrink-0 opacity-70" />}
                                    {item.label}
                                </button>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageActions;
