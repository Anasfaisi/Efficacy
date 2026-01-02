import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler, type FieldPath, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Globe,
  FileText,
  Calendar,
  Briefcase,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  UploadCloud,
  X,
  Clock,
  Layout,
  Layers,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

import {
  mentorFormSchema,
  type mentorFormSchemaType,
} from '@/types/zodSchemas';
import { mentorApi } from '@/Services/mentor.api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCredentials } from '@/redux/slices/authSlice';
import type { currentUserType, Mentor } from '@/types/auth';

// --- Type Definitions for Steps ---
const STEPS = [
  {
    id: 1,
    title: 'Personal Info',
    icon: User,
    fields: ['name', 'phone', 'city', 'state', 'country', 'bio'],
  },
  {
    id: 2,
    title: 'Social Links',
    icon: Globe,
    fields: ['linkedin', 'github', 'personalWebsite'],
  },
  { id: 3, title: 'Identity Proof', icon: FileText, fields: [] }, 
  {
    id: 4,
    title: 'Availability',
    icon: Calendar,
    fields: ['availableDays', 'preferredTime', 'monthlyCharge'],
  },
  { id: 5, title: 'Mentor Type', icon: Briefcase, fields: ['mentorType'] },
  { id: 6, title: 'Specific Details', icon: Layers, fields: [] }, 
  { id: 7, title: 'Review', icon: CheckCircle, fields: [] },
] as const;

// --- Helper Components ---
const SectionTitle = ({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: React.ElementType;
}) => (
  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
    {Icon && <Icon className="w-6 h-6 text-sky-600" />}
    {children}
  </h2>
);

const Label = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const ErrorMsg = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-1 animate-pulse">{message}</p>;
};

// --- Main Component ---
export default function MentorOnboardingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState<{
    resume: File | null;
    certificate: File | null;
    idProof: File | null;
  }>({
    resume: null,
    certificate: null,
    idProof: null,
  });

  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<mentorFormSchemaType>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(mentorFormSchema) as any,
    mode: 'onChange',
    defaultValues: {
      availableDays: [],
      preferredTime: [],

      mentorType: undefined,
      guidanceAreas: [],
    },
  });

  const watchedMentorType = watch('mentorType');
  const watchedDays = watch('availableDays') || [];
  const watchedTimes = watch('preferredTime') || [];
  const watchedGuidanceAreas = watch('guidanceAreas') || [];
  useEffect(() => {
    if (currentUser?.role === 'mentor') {
      const mentor = currentUser as Mentor;
      const status = mentor.status;
      if (status === 'pending') {
        navigate('/mentor/application-received');
      } else if (status === 'rejected') {
        navigate('/mentor/application-rejected');
      } else if (status === 'reapply') {
        // Stay on onboarding page but show feedback
      } else if (status && status !== 'incomplete' && status !== 'pending') {
        navigate('/mentor/dashboard');
      }
    }
  }, [currentUser, navigate]);

  // Pre-fill form from currentUser if status is 'reapply' or 'incomplete'
  useEffect(() => {
    if (currentUser?.role === 'mentor') {
      const mentor = currentUser as Mentor;
      if (mentor.status === 'reapply' || mentor.status === 'incomplete') {
        // Explicitly set each field if it exists
        if (mentor.name) setValue('name', mentor.name);
        if (mentor.phone) setValue('phone', mentor.phone);
        if (mentor.city) setValue('city', mentor.city);
        if (mentor.state) setValue('state', mentor.state);
        if (mentor.country) setValue('country', mentor.country);
        if (mentor.bio) setValue('bio', mentor.bio);
        if (mentor.linkedin) setValue('linkedin', mentor.linkedin);
        if (mentor.github) setValue('github', mentor.github);
        if (mentor.personalWebsite) setValue('personalWebsite', mentor.personalWebsite);
        if (mentor.demoVideoLink) setValue('demoVideoLink', mentor.demoVideoLink);
        if (mentor.availableDays) setValue('availableDays', Array.isArray(mentor.availableDays) ? mentor.availableDays : []);
        if (mentor.preferredTime) setValue('preferredTime', Array.isArray(mentor.preferredTime) ? mentor.preferredTime : []);
        if (mentor.mentorType) setValue('mentorType', mentor.mentorType);
        if (mentor.qualification) setValue('qualification', mentor.qualification);
        if (mentor.university) setValue('university', mentor.university);
        if (mentor.graduationYear) setValue('graduationYear', mentor.graduationYear);
        if (mentor.expertise) setValue('expertise', mentor.expertise);
        if (mentor.domain) setValue('domain', mentor.domain);
        if (mentor.academicSpan) setValue('academicSpan', mentor.academicSpan);
        if (mentor.industryCategory) setValue('industryCategory', mentor.industryCategory);
        if (mentor.experienceYears) setValue('experienceYears', mentor.experienceYears);
        if (mentor.currentRole) setValue('currentRole', mentor.currentRole);
        if (mentor.skills) setValue('skills', mentor.skills);
        if (mentor.guidanceAreas) setValue('guidanceAreas', mentor.guidanceAreas);
        if (mentor.experienceSummary) setValue('experienceSummary', mentor.experienceSummary);
      }
    }
  }, [currentUser, setValue]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'resume' | 'certificate' | 'idProof',
  ) => {
    const file = e.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [fieldName]: file }));
  };

  const validateStep = async (stepId: number) => {
    const stepConfig = STEPS.find((s) => s.id === stepId);
    if (!stepConfig) return false;

    // Manual check for files in Step 3
    if (stepId === 3) {
      if (!files.idProof) {
        toast.error('Please upload an Identity Proof document.');
        return false;
      }
      // Trigger validation for video link
      const isVideoValid = await trigger('demoVideoLink');
      if (!isVideoValid) return false;

      return true;
    }

    // Dynamic validation for Step 6
    if (stepId === 6) {
      if (watchedMentorType === 'Academic') {
        const isDetailsValid = await trigger([
          'qualification',
          'domain',
          'university',
          'graduationYear',
          'expertise',
          'academicSpan',
        ]);
        if (!isDetailsValid) return false;
        
        if (!files.certificate) {
          toast.error('Highest Qualification Certificate is mandatory for Academic Mentors');
          return false;
        }
        return true;
      }
      if (watchedMentorType === 'Industry') {
        const isValid = await trigger([
          'industryCategory',
          'experienceYears',
          'currentRole',
          'skills',
          'guidanceAreas',
        ]);
        if (
          isValid &&
          watch('guidanceAreas')?.includes('Others') &&
          !watch('customGuidance')
        ) {
          setError('customGuidance', {
            type: 'manual',
            message: 'Please specify other guidance areas',
          });
          return false;
        }
        return isValid;
      }
      return false;
    }

    if (stepConfig.fields.length > 0) {
      const result = await trigger(
        stepConfig.fields as unknown as FieldPath<mentorFormSchemaType>[],
      );
      return result;
    }

    return true;
  };

  const handleMentorTypeSelect = (type: 'Academic' | 'Industry') => {
    setValue('mentorType', type);
  };

  const handleNext = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const isStepValid = await validateStep(currentStep);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    const data = values as mentorFormSchemaType;
    if (currentStep < 7) {
      handleNext();
      return;
    }

    if (currentStep !== 7) return; 

    try {
      if (!files.resume) {
        toast.error('Please upload your resume.');
        return;
      }

      // Prepare data for submission
      const submissionData = { ...data };

      // Handle Custom Guidance Areas for Industry Mentors
      if (
        submissionData.mentorType === 'Industry' &&
        submissionData.guidanceAreas
      ) {
        if (submissionData.guidanceAreas.includes('Others')) {
          // Remove 'Others'
          submissionData.guidanceAreas = submissionData.guidanceAreas.filter(
            (area) => area !== 'Others',
          );

          // Add custom guidance if present
          if (submissionData.customGuidance) {
            const customAreas = submissionData.customGuidance
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
            submissionData.guidanceAreas.push(...customAreas);
          }
        }
        // internal cleanup
        delete submissionData.customGuidance;
      }

      const result = await mentorApi.submitApplication(submissionData, files);

      if (result.status === 'pending') {
        toast.success('Application submitted successfully!');
        if (currentUser) {
          const updatedUser = { ...currentUser, status: 'pending' };
          dispatch(
            setCredentials({ currentUser: updatedUser as currentUserType }),
          );
        }
        navigate('/mentor/application-received');
      } else {
        toast.success('Application updated!');
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || 'Submission failed');
      }
    }
  };

  // --- Render Helpers ---

  const renderProgress = () => (
    <div className="w-full bg-gray-100 h-2 rounded-full mb-8 overflow-hidden flex">
      <div
        className="bg-sky-600 h-full transition-all duration-500 ease-in-out"
        style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
      />
    </div>
  );

  const renderHeader = () => {
    const currentStepConfig = STEPS.find((s) => s.id === currentStep);
    return (
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mentor Application</h1>
        <p className="text-gray-500 mt-2">
          Step {currentStep} of {STEPS.length}: {currentStepConfig?.title}
        </p>
        <div className="mt-4">{renderProgress()}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <Link 
            to="/mentor/guidelines" 
            className="text-sky-600 hover:text-sky-700 text-sm font-medium flex items-center gap-1 group transition-all"
          >
            <HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Read Guidelines
          </Link>
        </div>
        {renderHeader()}

        {currentUser?.role === 'mentor' && (currentUser as Mentor).status === 'reapply' && (
          <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 p-8 rounded-2xl shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center animate-pulse">
                <AlertCircle className="text-white" size={28} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  ⚠️ Action Required: Changes Needed for Your Application
                </h3>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-amber-200 mb-3">
                  <p className="text-amber-900 font-medium leading-relaxed whitespace-pre-wrap">
                    {(currentUser as Mentor).applicationFeedback || "Please review your application and update the necessary details as per the administrator's feedback."}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                  <CheckCircle size={16} />
                  <span>Your previous data has been pre-filled for your convenience</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <form
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit={handleSubmit(onSubmit as any)}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100/50"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* STEP 1: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <SectionTitle icon={User}>Personal Information</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label required>Full Name</Label>
                      <input
                        {...register('name')}
                        className="w-full p-3 border border-gray-400 shadow-sm rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                        placeholder="John Doe"
                      />
                      <ErrorMsg message={errors.name?.message} />
                    </div>
                    <div>
                      <Label required>Phone Number</Label>
                      <input
                        {...register('phone')}
                        className="w-full p-3 border border-gray-400 shadow-sm rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                        placeholder="1234567890"
                      />
                      <ErrorMsg message={errors.phone?.message} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label required>City</Label>
                      <input
                        {...register('city')}
                        className="w-full p-3 border border-gray-400 shadow-sm rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                      />
                      <ErrorMsg message={errors.city?.message} />
                    </div>
                    <div>
                      <Label required>State</Label>
                      <input
                        {...register('state')}
                        className="w-full p-3 border border-gray-400 shadow-sm rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                      />
                      <ErrorMsg message={errors.state?.message} />
                    </div>
                    <div>
                      <Label required>Country</Label>
                      <input
                        {...register('country')}
                        className="w-full p-3 border border-gray-400 shadow-sm rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                      />
                      <ErrorMsg message={errors.country?.message} />
                    </div>
                  </div>

                  <div>
                    <Label required>Short Bio</Label>
                    <textarea
                      {...register('bio')}
                      rows={4}
                      className="w-full p-3 border border-gray-400 shadow-sm rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                      placeholder="Tell us a bit about yourself..."
                    />
                    <ErrorMsg message={errors.bio?.message} />
                  </div>
                </div>
              )}

              {/* STEP 2: Social Links */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <SectionTitle icon={Globe}>
                    Public & Social Links
                  </SectionTitle>
                  <div>
                    <Label required>LinkedIn Profile</Label>
                    <input
                      {...register('linkedin')}
                      className="w-full p-3 border border-gray-400 shadow-sm rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                      placeholder="https://linkedin.com/in/..."
                    />
                    <ErrorMsg message={errors.linkedin?.message} />
                  </div>
                  <div>
                    <Label>GitHub / Portfolio (Optional)</Label>
                    <input
                      {...register('github')}
                      className="w-full p-3 border border-gray-400 shadow-sm rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                      placeholder="https://github.com/..."
                    />
                    <ErrorMsg message={errors.github?.message} />
                  </div>
                  <div>
                    <Label>Personal Website (Optional)</Label>
                    <input
                      {...register('personalWebsite')}
                      className="w-full p-3 border border-gray-400 shadow-sm rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                      placeholder="https://mysite.com"
                    />
                    <ErrorMsg message={errors.personalWebsite?.message} />
                  </div>
                </div>
              )}

              {/* STEP 3: Identity Proof */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <SectionTitle icon={FileText}>
                    Identity Verification
                  </SectionTitle>

                  <div className="border-2 border-dashed border-gray-400 shadow-sm rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'idProof')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".pdf,.png,.jpg,.jpeg"
                    />
                    <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium">
                      {files.idProof
                        ? files.idProof.name
                        : 'Click or drag to upload Government ID'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PDF, JPG, PNG (Max 5MB)
                    </p>
                    {files.idProof && (
                      <p className="text-green-600 text-sm mt-2 font-semibold">
                        File Selected
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 text-center flex items-start justify-center gap-1">
                    <Layout className="w-3 h-3 mt-0.5" />
                    This document is used for verification purposes only and
                    will not be shared publicly.
                  </p>

                  <div className="mt-6">
                    <Label required>Demo Video Link</Label>
                    <input
                      {...register('demoVideoLink')}
                      className="w-full p-3 border border-gray-400 shadow-sm rounded-lg focus:ring-2 focus:ring-sky-500"
                      placeholder="e.g. Unlisted YouTube or Drive Link"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Please record a short video explaining a topic in your
                      expertise.Please provide either a shareable Google Drive
                      link or an unlisted YouTube video or any.
                    </p>
                    <ErrorMsg message={errors.demoVideoLink?.message} />
                  </div>

                  <div className="mt-8 pt-8 border-t">
                    <Label required>Resume / CV</Label>
                    <div className="border-2 border-dashed border-gray-400 shadow-sm rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative mt-2">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'resume')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf"
                      />
                      <p className="text-gray-700">
                        {files.resume
                          ? files.resume.name
                          : 'Upload Resume (PDF)'}
                      </p>
                    </div>
                    {!files.resume && (
                      <p className="text-amber-600 text-sm mt-1">
                        Resume is required for submission.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: Availability */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <SectionTitle icon={Calendar}>
                    Availability & Preference
                  </SectionTitle>

                  {/* Days Checkboxes */}
                  <div>
                    <Label required>Available Days</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                      {[
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday',
                      ].map((day) => (
                        <label
                          key={day}
                          className={`flex items-center space-x-2 p-3 border border-gray-400 rounded-lg cursor-pointer max-w-full ${watchedDays.includes(day) ? 'bg-sky-50 border-sky-400' : ''}`}
                        >
                          <input
                            type="checkbox"
                            value={day}
                            {...register('availableDays')}
                            className="rounded text-sky-600 focus:ring-sky-500 w-5 h-5"
                          />
                          <span className="text-sm text-gray-700">{day}</span>
                        </label>
                      ))}
                    </div>
                    <ErrorMsg message={errors.availableDays?.message} />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <Label required>Time Slots</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {[
                        'Morning (9 AM - 12 PM)',
                        'Afternoon (1 PM - 5 PM)',
                        'Evening (6 PM - 9 PM)',
                        'Night (9 PM - 12 AM)',
                      ].map((time) => (
                        <label
                          key={time}
                          className={`flex items-center space-x-2 p-3 border border-gray-400 rounded-lg cursor-pointer ${watchedTimes.includes(time) ? 'bg-sky-50 border-sky-400' : ''}`}
                        >
                          <input
                            type="checkbox"
                            value={time}
                            {...register('preferredTime')}
                            className="rounded text-sky-600 focus:ring-sky-500 w-5 h-5"
                          />
                          <span className="text-sm text-gray-700">{time}</span>
                        </label>
                      ))}
                    </div>
                    <ErrorMsg message={errors.preferredTime?.message} />
                  </div>

                  {/* Monthly Pricing */}
                  <div className="pt-6 border-t border-gray-100">
                    <Label required>Monthly Subscription Charge (₹)</Label>
                    <div className="mt-2 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                      <input
                        type="number"
                        {...register('monthlyCharge')}
                        className="w-full pl-8 pr-4 py-3 border border-gray-400 shadow-sm rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                        placeholder="e.g. 2000"
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed italic">
                      Note: During your initial 2 months or first 10 sessions, your charge is limited between ₹1500 to ₹2000. This helps you build a solid foundation and receive initial ratings. You can scale your pricing later based on your performance.
                    </p>
                    <ErrorMsg message={errors.monthlyCharge?.message} />
                  </div>
                </div>
              )}

              {/* STEP 5: Mentor Type */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <SectionTitle icon={Briefcase}>
                    Choose Mentor Type
                  </SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      onClick={() => handleMentorTypeSelect('Academic')}
                      className={`cursor-pointer border-2 rounded-xl p-6 hover:shadow-lg transition-all ${watchedMentorType === 'Academic' ? 'border-sky-500 bg-sky-50' : 'border-gray-100'}`}
                    >
                      <GraduationCap
                        className={`w-12 h-12 mb-4 ${watchedMentorType === 'Academic' ? 'text-sky-600' : 'text-gray-400'}`}
                      />
                      <h3 className="text-xl font-bold mb-2">
                        Academic Mentor
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Focus on educational growth. Guide students through national-level exams (JEE, NEET, CAT, etc.), clarify academic doubts, and suggest effective learning resources rather than traditional teaching.
                      </p>
                    </div>

                    <div
                      onClick={() => handleMentorTypeSelect('Industry')}
                      className={`cursor-pointer border-2 rounded-xl p-6 hover:shadow-lg transition-all ${watchedMentorType === 'Industry' ? 'border-sky-500 bg-sky-50' : 'border-gray-100'}`}
                    >
                      <Briefcase
                        className={`w-12 h-12 mb-4 ${watchedMentorType === 'Industry' ? 'text-sky-600' : 'text-gray-400'}`}
                      />
                      <h3 className="text-xl font-bold mb-2">
                        Industry Mentor
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Bridge the gap to the professional world. Provide career guidance, industry insights, resume reviews, mock interviews, and share real-world project experiences from your corporate journey.
                      </p>
                    </div>
                  </div>
                  <ErrorMsg message={errors.mentorType?.message} />
                  {watchedMentorType && (
                    <p className="text-center text-sm text-gray-500 mt-4">
                      You selected <strong>{watchedMentorType} Monitor</strong>.
                      Click Next to provide details.
                    </p>
                  )}
                </div>
              )}

              {/* STEP 6: Specific Details */}
              {currentStep === 6 && (
                <div className="space-y-10">
                  {/* Academic Details Section */}
                  <div className="space-y-6">
                    <SectionTitle icon={GraduationCap}>
                      Academic Details
                    </SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label required={watchedMentorType === 'Academic'}>Highest Qualification</Label>
                        <select
                          {...register('qualification')}
                          className="w-full p-3 border border-gray-400 rounded-lg bg-white outline-none active:border-sky-600 focus:border-sky-600 focus:ring-2 focus:ring-sky-600"
                        >
                          <option value="">Select Qualification</option>
                          <option value="Bachelor">Bachelor's degree</option>
                          <option value="Master">Master's degree</option>
                          <option value="PhD">PhD</option>
                          <option value="Post-Doctoral">Post-Doctoral</option>
                          <option value="Other">Other</option>
                        </select>
                        <ErrorMsg message={errors.qualification?.message} />
                      </div>
                      <div>
                        <Label required={watchedMentorType === 'Academic'}>Domain / Specialization</Label>
                        <input
                          {...register('domain')}
                          className="w-full p-3 border border-gray-400 shadow-sm rounded-lg outline-none active:border-sky-600 focus:border-sky-600 focus:ring-2 focus:ring-sky-600"
                          placeholder="e.g. Computer Science, Mathematics"
                        />
                        <ErrorMsg message={errors.domain?.message} />
                      </div>
                      <div>
                        <Label required={watchedMentorType === 'Academic'}>University / Institute</Label>
                        <input
                          {...register('university')}
                          className="w-full p-3 border border-gray-400 shadow-sm rounded-lg outline-none active:border-sky-600 focus:border-sky-600 focus:ring-2 focus:ring-sky-600"
                          placeholder="University Name"
                        />
                        <ErrorMsg message={errors.university?.message} />
                      </div>
                      <div>
                        <Label required={watchedMentorType === 'Academic'}>Year of Graduation</Label>
                        <input
                          type="number"
                          {...register('graduationYear')}
                          className="w-full p-3 border border-gray-400 shadow-sm rounded-lg outline-none active:border-sky-600 focus:border-sky-600 focus:ring-2 focus:ring-sky-600"
                          placeholder="e.g. 2022"
                          min="1950"
                          max={new Date().getFullYear() + 5}
                        />
                        <ErrorMsg message={errors.graduationYear?.message} />
                      </div>
                    </div>

                    <div>
                      <Label required={watchedMentorType === 'Academic'}>Expertised Area (Mentorship Topics)</Label>
                      <input
                        {...register('expertise')}
                        className="w-full p-3 border border-gray-400 shadow-sm rounded-lg outline-none active:border-sky-600 focus:border-sky-600 focus:ring-2 focus:ring-sky-600"
                        placeholder="e.g. Calculus, Data Structures, Physics (comma separated)"
                      />
                      <ErrorMsg message={errors.expertise?.message} />
                    </div>

                    <div>
                      <Label required={watchedMentorType === 'Academic'}>
                        Academic Span (Students level you can guide)
                      </Label>
                      <input
                        {...register('academicSpan')}
                        className="w-full p-3 border border-gray-400 shadow-sm rounded-lg outline-none active:border-sky-600 focus:border-sky-600 focus:ring-2 focus:ring-sky-600"
                        placeholder="e.g. High School - Undergrad"
                      />
                      <ErrorMsg message={errors.academicSpan?.message} />
                    </div>

                    <div>
                      <Label required={watchedMentorType === 'Academic'}>
                        Highest Qualification Certificate (PDF/Image)
                      </Label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'certificate')}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                      />
                      {watchedMentorType === 'Academic' && !files.certificate && (
                        <p className="text-red-500 text-[10px] mt-1 italic">Certificate is mandatory for Academic Mentors</p>
                      )}
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  {/* Industry Details Section */}
                  <div className="space-y-6">
                    <SectionTitle icon={Briefcase}>
                      Professional Experience Details
                    </SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label required={watchedMentorType === 'Industry'}>Industry Category</Label>
                        <input
                          {...register('industryCategory')}
                          className="w-full p-3 border border-gray-400 shadow-sm rounded-lg"
                          placeholder="e.g. Fintech, Healthcare"
                        />
                        <ErrorMsg message={errors.industryCategory?.message} />
                      </div>
                      <div>
                        <Label required={watchedMentorType === 'Industry'}>Years of Experience</Label>
                        <input
                          {...register('experienceYears')}
                          type="number"
                          className="w-full p-3 border border-gray-400 shadow-sm rounded-lg"
                          placeholder="e.g. 5"
                        />
                        <ErrorMsg message={errors.experienceYears?.message} />
                      </div>
                    </div>

                    <div>
                      <Label required={watchedMentorType === 'Industry'}>Current Role / Company</Label>
                      <input
                        {...register('currentRole')}
                        className="w-full p-3 border border-gray-400 shadow-sm rounded-lg"
                        placeholder="e.g. Senior Developer at MNC"
                      />
                      <ErrorMsg message={errors.currentRole?.message} />
                    </div>

                    <div>
                      <Label required={watchedMentorType === 'Industry'}>Key Skills (Comma separated)</Label>
                      <input
                        {...register('skills')}
                        className="w-full p-3 border border-gray-400 shadow-sm rounded-lg"
                        placeholder="React, Java, Management, etc."
                      />
                      <ErrorMsg message={errors.skills?.message} />
                    </div>

                    <div>
                      <Label>Guidance Areas</Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {[
                          'Career Guidance',
                          'Mock Interviews',
                          'System Design',
                          'Domain Knowledge',
                          'Resume Review',
                          'Others',
                        ].map((area) => (
                          <label key={area} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              value={area}
                              {...register('guidanceAreas')}
                              className="rounded text-sky-600 w-4 h-4"
                            />
                            <span>{area}</span>
                          </label>
                        ))}
                      </div>
                      {watchedGuidanceAreas.includes('Others') && (
                        <div className="mt-3">
                          <input
                            {...register('customGuidance')}
                            className="w-full p-3 border border-gray-400 shadow-sm rounded-lg"
                            placeholder="Enter other guidance areas..."
                          />
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label>Detailed Professional Summary</Label>
                      <textarea
                        {...register('experienceSummary')}
                        rows={4}
                        className="w-full p-3 border border-gray-400 shadow-sm rounded-lg"
                        placeholder="Tell us more about your professional achievements..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: Review */}
              {currentStep === 7 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center p-3 bg-sky-100 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-sky-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Review Your Application
                    </h2>
                    <p className="text-gray-500 mt-2">
                      Please double-check your details before submitting.
                    </p>
                  </div>

                  {/* 1. Personal & Contact Info */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-500" />
                      <h3 className="font-semibold text-gray-700">
                        Personal Information
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="ml-auto text-xs text-sky-600 hover:text-sky-700 font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          Full Name
                        </p>
                        <p className="font-medium text-gray-900">
                          {getValues('name')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          Email
                        </p>
                        <p className="font-medium text-gray-900">
                          {currentUser?.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          Phone
                        </p>
                        <p className="font-medium text-gray-900">
                          {getValues('phone')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          Location
                        </p>
                        <p className="font-medium text-gray-900">
                          {getValues('city') || '-'},{' '}
                          {getValues('state') || '-'},{' '}
                          {getValues('country') || '-'}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          Bio
                        </p>
                        <p className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 italic border border-gray-100">
                          {getValues('bio') || 'No bio provided.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Professional Details (Dynamic) */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center gap-2">
                      {getValues('mentorType') === 'Academic' ? (
                        <GraduationCap className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Briefcase className="w-5 h-5 text-gray-500" />
                      )}
                      <h3 className="font-semibold text-gray-700">
                        {getValues('mentorType')} Profile
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(6)}
                        className="ml-auto text-xs text-sky-600 hover:text-sky-700 font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="p-6 space-y-8">
                      {/* Academic Section */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" /> Academic Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Qualification</p>
                            <p className="font-medium text-gray-900">{getValues('qualification') || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Domain</p>
                            <p className="font-medium text-gray-900">{getValues('domain') || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">University</p>
                            <p className="font-medium text-gray-900">{getValues('university') || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Graduation Year</p>
                            <p className="font-medium text-gray-900">{getValues('graduationYear') || '-'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Expertise Areas</p>
                            <p className="font-medium text-gray-900">{getValues('expertise') || '-'}</p>
                          </div>
                        </div>
                      </div>

                      <hr className="border-gray-100" />

                      {/* Industry Section */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                          <Briefcase className="w-4 h-4" /> Professional Experience
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Role & Company</p>
                            <p className="font-medium text-gray-900">{getValues('currentRole') || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Experience</p>
                            <p className="font-medium text-gray-900">{getValues('experienceYears') ? `${getValues('experienceYears')} Years` : '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Industry</p>
                            <p className="font-medium text-gray-900">{getValues('industryCategory') || '-'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Key Skills</p>
                            <p className="font-medium text-gray-900">{getValues('skills') || '-'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Guidance Areas</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {getValues('guidanceAreas')?.map((area: string) => (
                                <span key={area} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-md border border-amber-100">{area}</span>
                              )) || '-'}
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Detailed Professional Summary</p>
                            <p className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 italic border border-gray-100">
                              {getValues('experienceSummary') || 'No summary provided.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Availability */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <h3 className="font-semibold text-gray-700">
                        Availability
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="ml-auto text-xs text-sky-600 hover:text-sky-700 font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                          Days of Week
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {watchedDays.length > 0 ? (
                            watchedDays.map((day) => (
                              <span
                                key={day}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                              >
                                {day}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 italic">
                              No days selected
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                          Preferred Times
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {watchedTimes.length > 0 ? (
                            watchedTimes.map((time) => (
                              <span
                                key={time}
                                className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full border border-indigo-100"
                              >
                                {time}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 italic">
                              No times selected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Documents & Links */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <h3 className="font-semibold text-gray-700">
                        Documents & Socials
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="ml-auto text-xs text-sky-600 hover:text-sky-700 font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                          Uploaded Files
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            {files.resume ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <X className="w-4 h-4 text-red-500" />
                            )}
                            Resume:{' '}
                            <span className="font-medium">
                              {files.resume?.name || 'Missing'}
                            </span>
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            {files.idProof ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <X className="w-4 h-4 text-red-500" />
                            )}
                            ID Proof:{' '}
                            <span className="font-medium">
                              {files.idProof?.name || 'Missing'}
                            </span>
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            {files.certificate ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <span className="w-4 h-4 block" />
                            )}
                            Certificate:{' '}
                            <span className="font-medium text-gray-500">
                              {files.certificate?.name ||
                                'Not Uploaded (if applicable)'}
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                          Links
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-sm">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <a
                              href={getValues('linkedin')}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sky-600 hover:underline truncate max-w-[200px] block"
                            >
                              {getValues('linkedin') || 'No LinkedIn'}
                            </a>
                          </li>
                          {getValues('github') && (
                            <li className="flex items-center gap-2 text-sm">
                              <Globe className="w-4 h-4 text-gray-400" />
                              <a
                                href={getValues('github')}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sky-600 hover:underline truncate max-w-[200px] block"
                              >
                                {getValues('github')}
                              </a>
                            </li>
                          )}
                          <li className="flex items-center gap-2 text-sm">
                            <Layout className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700 font-medium">
                              Video Demo:{' '}
                            </span>
                            <a
                              href={getValues('demoVideoLink')}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sky-600 hover:underline truncate max-w-[150px] block"
                            >
                              {getValues('demoVideoLink') || 'Missing'}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-blue-800 text-sm shadow-sm mt-4">
                    <Clock className="w-5 h-5 shrink-0" />
                    <p>
                      Once submitted, your application will be reviewed by our
                      admin team. This process usually takes 24-48 hours. You
                      will be notified via email immediately after the review
                      process.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer Actions */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-2 rounded-lg active:bg-gray-100 transition-all border border-gray-500 hover:border-gray-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400  shadow-md text-gray-700  hover:bg-gray-50 "
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={(e) => handleNext(e)}
                className="ml-auto flex items-center gap-2 px-6 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800 transition-all border border-sky-600 hover:border-sky-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-600 "
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-auto px-8 py-3 rounded-lg bg-sky-600 text-white font-bold hover:bg-sky-700 transition shadow-xl shadow-sky-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
