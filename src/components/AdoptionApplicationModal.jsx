import React, { useState } from 'react';
import { X, Loader2, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import FormField from './ui/form-field';
import { validateAdoptionForm } from '../lib/validation';
import api from '../services/api';

// ---------------------------------------------------------------------------
// Local primitives — same visual style as AddPet.jsx
// ---------------------------------------------------------------------------

const PetInput = ({ error, className, ...props }) => (
    <input
        {...props}
        className={cn(
            'w-full px-3 py-2 bg-white border rounded-md text-sm text-slate-800 placeholder-slate-300',
            'focus:outline-none focus:ring-1 transition-colors',
            error
                ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                : 'border-slate-200 focus:ring-pink-400 focus:border-pink-400',
            className
        )}
    />
);

const PetSelect = ({ error, children, className, ...props }) => (
    <select
        {...props}
        className={cn(
            'w-full px-3 py-2 bg-white border rounded-md text-sm text-slate-800',
            'focus:outline-none focus:ring-1 transition-colors appearance-none',
            "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_12px_center]",
            error
                ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                : 'border-slate-200 focus:ring-pink-400 focus:border-pink-400',
            className
        )}
    >
        {children}
    </select>
);

const SectionCard = ({ title, hint, children }) => (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
            {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
        </div>
        <div className="px-5 py-4">{children}</div>
    </div>
);

const YesNoToggle = ({ value, onChange, error }) => (
    <div className="flex gap-2">
        {[true, false].map((opt) => (
            <button
                key={String(opt)}
                type="button"
                onClick={() => onChange(opt)}
                className={cn(
                    'flex-1 px-3 py-2 rounded-md border text-sm font-medium transition-all cursor-pointer',
                    value === opt
                        ? 'border-pink-400 bg-pink-50 text-pink-600'
                        : error
                            ? 'border-red-300 text-slate-500'
                            : 'border-slate-200 text-slate-500 hover:border-slate-300'
                )}
            >
                {opt ? 'Yes' : 'No'}
            </button>
        ))}
    </div>
);

// Radio pill group (same look as energyLevel in AddPet)
const RadioPillGroup = ({ options, value, onChange, error }) => (
    <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
            <label
                key={opt}
                className={cn(
                    'flex items-center justify-center px-3 py-2 rounded-md border text-xs cursor-pointer transition-all',
                    value === opt
                        ? 'border-pink-400 bg-pink-50 text-pink-600 font-medium'
                        : error
                            ? 'border-red-300 text-slate-500'
                            : 'border-slate-200 text-slate-500 hover:border-slate-300'
                )}
            >
                <input
                    type="radio"
                    value={opt}
                    checked={value === opt}
                    onChange={() => onChange(opt)}
                    className="hidden"
                />
                {opt}
            </label>
        ))}
    </div>
);

// ---------------------------------------------------------------------------
// Initial form state
// ---------------------------------------------------------------------------
const initialForm = {
    livingType: '',
    hasChildren: null,
    childrenAges: [],
    hasOtherPets: null,
    otherPetsDetails: '',
    activityLevel: '',
    experienceLevel: '',
    workSchedule: '',
    reasonForAdoption: '',
    additionalNotes: '',
};

// ---------------------------------------------------------------------------
// Modal Component
// ---------------------------------------------------------------------------
const AdoptionApplicationModal = ({ pet, onClose, onSuccess }) => {
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Children ages — managed as a comma-separated input string for simplicity
    const [childrenAgesInput, setChildrenAgesInput] = useState('');

    if (!pet) return null;

    const clearError = (field) => {
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleChange = (field, value) => {
        clearError(field);
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const parseChildrenAges = (raw) => {
        return raw
            .split(',')
            .map((s) => parseInt(s.trim(), 10))
            .filter((n) => !isNaN(n) && n >= 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Build payload matching the backend model
        const payload = {
            ...formData,
            petId: pet._id,
            childrenAges: formData.hasChildren ? parseChildrenAges(childrenAgesInput) : [],
        };

        // Validate
        const validation = validateAdoptionForm(payload);
        if (!validation.success) {
            setErrors(validation.errors);
            toast.error('Please fix the errors before submitting.');
            return;
        }

        setIsSubmitting(true);
        try {
            await toast.promise(
                api.applications.submitApplication(payload),
                {
                    loading: `Submitting adoption application for ${pet.name}...`,
                    success: `Application submitted successfully for ${pet.name}!`,
                    error: (err) => err.message || 'Failed to submit application. Please try again.',
                }
            );
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            // toast.promise already handles error display
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-2xl bg-slate-50/80 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">

                {/* Header */}
                <div className="bg-white px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center">
                            <ClipboardList className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Adoption Application</h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                For <span className="font-medium text-slate-600">{pet.name}</span> · {pet.species} · {pet.breed}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

                    {/* ── Section 1: About Your Home ─────────────────────────── */}
                    <SectionCard title="About Your Home" hint="Tell us about your living situation.">
                        <div className="flex flex-col gap-4">

                            <FormField label="Living Situation" required error={errors.livingType}>
                                <PetSelect
                                    value={formData.livingType}
                                    onChange={(e) => handleChange('livingType', e.target.value)}
                                    error={errors.livingType}
                                >
                                    <option value="" disabled>Select your home type...</option>
                                    <option>Apartment</option>
                                    <option>House</option>
                                    <option>Condo</option>
                                    <option>Farm</option>
                                    <option>Other</option>
                                </PetSelect>
                            </FormField>

                            <FormField label="Do you have children?" required error={errors.hasChildren}>
                                <YesNoToggle
                                    value={formData.hasChildren}
                                    onChange={(v) => handleChange('hasChildren', v)}
                                    error={errors.hasChildren}
                                />
                            </FormField>

                            {formData.hasChildren === true && (
                                <FormField
                                    label="Children's Ages"
                                    hint="Enter ages separated by commas (e.g. 3, 7, 12)"
                                >
                                    <PetInput
                                        value={childrenAgesInput}
                                        onChange={(e) => setChildrenAgesInput(e.target.value)}
                                        placeholder="e.g. 3, 7, 12"
                                    />
                                </FormField>
                            )}

                            <FormField label="Do you have other pets?" required error={errors.hasOtherPets}>
                                <YesNoToggle
                                    value={formData.hasOtherPets}
                                    onChange={(v) => handleChange('hasOtherPets', v)}
                                    error={errors.hasOtherPets}
                                />
                            </FormField>

                            {formData.hasOtherPets === true && (
                                <FormField label="Describe your other pets" hint="Species, breed, temperament...">
                                    <textarea
                                        value={formData.otherPetsDetails}
                                        onChange={(e) => handleChange('otherPetsDetails', e.target.value)}
                                        rows={2}
                                        placeholder="e.g. A 3-year-old Labrador, very friendly..."
                                        className={cn(
                                            'w-full px-3 py-2.5 bg-white border rounded-md text-sm text-slate-800 placeholder-slate-300 resize-none',
                                            'focus:outline-none focus:ring-1 border-slate-200 focus:ring-pink-400 focus:border-pink-400 transition-colors'
                                        )}
                                    />
                                </FormField>
                            )}

                        </div>
                    </SectionCard>

                    {/* ── Section 2: Your Lifestyle ──────────────────────────── */}
                    <SectionCard title="Your Lifestyle" hint="Help us match you with the right pet.">
                        <div className="flex flex-col gap-4">

                            <FormField label="Activity Level" required error={errors.activityLevel}>
                                <RadioPillGroup
                                    options={['Low', 'Moderate', 'High', 'Very High']}
                                    value={formData.activityLevel}
                                    onChange={(v) => handleChange('activityLevel', v)}
                                    error={errors.activityLevel}
                                />
                            </FormField>

                            <FormField label="Experience with Pets" required error={errors.experienceLevel}>
                                <RadioPillGroup
                                    options={['First-time', 'Experienced', 'Expert']}
                                    value={formData.experienceLevel}
                                    onChange={(v) => handleChange('experienceLevel', v)}
                                    error={errors.experienceLevel}
                                />
                            </FormField>

                            <FormField label="Work Schedule" required error={errors.workSchedule}>
                                <PetSelect
                                    value={formData.workSchedule}
                                    onChange={(e) => handleChange('workSchedule', e.target.value)}
                                    error={errors.workSchedule}
                                >
                                    <option value="" disabled>Select your schedule...</option>
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Remote</option>
                                    <option>Retired</option>
                                    <option>Student</option>
                                </PetSelect>
                            </FormField>

                        </div>
                    </SectionCard>

                    {/* ── Section 3: Your Message ────────────────────────────── */}
                    <SectionCard title="Your Message" hint="Tell us why you want to adopt this pet.">
                        <div className="flex flex-col gap-4">

                            <FormField label="Why do you want to adopt?" required error={errors.reasonForAdoption}>
                                <textarea
                                    value={formData.reasonForAdoption}
                                    onChange={(e) => handleChange('reasonForAdoption', e.target.value)}
                                    rows={4}
                                    placeholder={`Tell us about your motivation to adopt ${pet.name}, your lifestyle, and how you plan to care for them...`}
                                    className={cn(
                                        'w-full px-3 py-2.5 bg-white border rounded-md text-sm text-slate-800 placeholder-slate-300 resize-none',
                                        'focus:outline-none focus:ring-1 transition-colors',
                                        errors.reasonForAdoption
                                            ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                                            : 'border-slate-200 focus:ring-pink-400 focus:border-pink-400'
                                    )}
                                />
                                {!errors.reasonForAdoption && (
                                    <p className="text-xs text-slate-400 mt-1">{formData.reasonForAdoption.length} / 2000 characters</p>
                                )}
                            </FormField>

                            <FormField label="Additional Notes" hint="Any other information you'd like to share? (optional)">
                                <textarea
                                    value={formData.additionalNotes}
                                    onChange={(e) => handleChange('additionalNotes', e.target.value)}
                                    rows={2}
                                    placeholder="Anything else we should know..."
                                    className={cn(
                                        'w-full px-3 py-2.5 bg-white border rounded-md text-sm text-slate-800 placeholder-slate-300 resize-none',
                                        'focus:outline-none focus:ring-1 border-slate-200 focus:ring-pink-400 focus:border-pink-400 transition-colors'
                                    )}
                                />
                            </FormField>

                        </div>
                    </SectionCard>

                    {/* ── Actions ────────────────────────────────────────────── */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 bg-pink-600 text-white text-sm font-medium rounded-md hover:bg-pink-700 active:bg-pink-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AdoptionApplicationModal;
