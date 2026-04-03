import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export interface PlanData {
    name: string;
    price: number;
    billingCycleDays: number;
    features: string[];
    limitations: Record<string, number>;
    mentorType?: string;
    isActive?: boolean;
}

interface AddPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (plan: PlanData) => void;
    initialData?: PlanData | null;
    isEditMode?: boolean;
}

export default function AddPlanModal({ isOpen, onClose, onSubmit, initialData, isEditMode }: AddPlanModalProps) {
    const defaultData: PlanData = {
        name: '',
        price: 0,
        billingCycleDays: 30,
        features: [],
        limitations: {},
        mentorType: '',
    };

    const [formData, setFormData] = React.useState<PlanData>(defaultData);

    React.useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    name: initialData.name || '',
                    price: initialData.price || 0,
                    billingCycleDays: initialData.billingCycleDays || 30,
                    features: [...(initialData.features || [])],
                    limitations: { ...(initialData.limitations || {}) },
                    mentorType: initialData.mentorType || '',
                });
            } else {
                setFormData(defaultData);
            }
            setNewFeature('');
            setLimitationKey('');
            setLimitationValue(0);
        }
    }, [isOpen, initialData]);

    const [newFeature, setNewFeature] = useState('');
    const [limitationKey, setLimitationKey] = useState('');
    const [limitationValue, setLimitationValue] = useState(0);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'price' || name === 'billingCycleDays' ? Number(value) : value,
        }));
    };

    const addFeature = () => {
        if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
            setFormData((prev) => ({
                ...prev,
                features: [...prev.features, newFeature.trim()],
            }));
            setNewFeature('');
        }
    };

    const removeFeature = (featureToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.filter((f) => f !== featureToRemove),
        }));
    };

    const addLimitation = () => {
        if (limitationKey.trim() && limitationValue >= 0) {
            setFormData((prev) => ({
                ...prev,
                limitations: {
                    ...prev.limitations,
                    [limitationKey.trim()]: limitationValue,
                },
            }));
            setLimitationKey('');
            setLimitationValue(0);
        }
    };

    const removeLimitation = (keyToRemove: string) => {
        setFormData((prev) => {
            const newLimitations = { ...prev.limitations };
            delete newLimitations[keyToRemove];
            return {
                ...prev,
                limitations: newLimitations,
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">{isEditMode ? "Edit Plan" : "Add New Plan"}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <form id="add-plan-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Basic Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Plan Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Pro Plan"
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Billing Cycle (Days)</label>
                                    <input
                                        type="number"
                                        name="billingCycleDays"
                                        required
                                        min="1"
                                        value={formData.billingCycleDays}
                                        onChange={handleChange}
                                        placeholder="30"
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Required Mentor Type (Optional)</label>
                                    <select
                                        name="mentorType"
                                        value={formData.mentorType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                                    >
                                        <option value="">None / All Types</option>
                                        <option value="regular">Regular</option>
                                        <option value="dedicated">Dedicated</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Features</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                    placeholder="Add a new feature..."
                                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 font-medium transition-colors flex items-center gap-2"
                                >
                                    <Plus size={18} />
                                    <span>Add</span>
                                </button>
                            </div>
                            {formData.features.length > 0 && (
                                <ul className="space-y-2 mt-3">
                                    {formData.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-700">
                                            <span className="truncate">{feature}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeFeature(feature)}
                                                className="text-gray-400 hover:text-red-500 p-1"
                                            >
                                                <X size={16} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Limitations */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Usage Limitations</h3>
                            <div className="flex flex-col sm:flex-row gap-2 relative">
                                <input
                                    type="text"
                                    value={limitationKey}
                                    onChange={(e) => setLimitationKey(e.target.value)}
                                    placeholder="e.g. mentor_sessions"
                                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                                />
                                <input
                                    type="number"
                                    value={limitationValue}
                                    onChange={(e) => setLimitationValue(Number(e.target.value))}
                                    placeholder="Allowed count"
                                    min="0"
                                    className="w-full sm:w-32 px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={addLimitation}
                                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus size={18} />
                                    <span className="hidden sm:inline">Add</span>
                                </button>
                            </div>
                            {Object.keys(formData.limitations).length > 0 && (
                                <ul className="space-y-2 mt-3">
                                    {Object.entries(formData.limitations).map(([key, value], idx) => (
                                        <li key={idx} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium bg-gray-200 text-gray-800 px-2.5 py-0.5 rounded text-xs">{key}</span>
                                                <span className="text-gray-500">Max limit: </span>
                                                <span className="font-bold text-gray-900">{value}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeLimitation(key)}
                                                className="text-gray-400 hover:text-red-500 p-1"
                                            >
                                                <X size={16} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="add-plan-form"
                        className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md shadow-blue-500/20"
                    >
                        {isEditMode ? "Save Changes" : "Create Plan"}
                    </button>
                </div>
            </div>
        </div>
    );
}
