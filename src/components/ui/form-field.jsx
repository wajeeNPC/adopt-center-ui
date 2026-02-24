import React from 'react';
import { cn } from '../../lib/utils';

/**
 * FormField — wraps a label, input slot, and validation/hint caption.
 *
 * Usage:
 *   <FormField label="Pet Name" required error={errors.name}>
 *     <Input ... />
 *   </FormField>
 *
 * States:
 *   error   → red caption below the field
 *   hint    → muted grey caption (used when no error is present)
 */
const FormField = ({ label, required, error, hint, children, className }) => (
    <div className={cn('flex flex-col gap-1', className)}>
        {label && (
            <label className="block text-sm font-medium text-slate-700">
                {label}
                {required && <span className="text-pink-500 ml-0.5">*</span>}
            </label>
        )}
        {children}
        {error ? (
            <p className="text-xs text-red-500 mt-0.5">{error}</p>
        ) : hint ? (
            <p className="text-xs text-slate-400 mt-0.5">{hint}</p>
        ) : null}
    </div>
);

export default FormField;
