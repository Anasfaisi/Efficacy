import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler, type FieldPath } from 'react-hook-form';
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
  Award,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { mentorFormSchema, type mentorFormSchemaType } from '@/types/zodSchemas';
import { mentorApi } from '@/Services/mentor.api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCredentials } from '@/redux/slices/authSlice';
import type { currentUserType, Mentor } from '@/types/auth';

// --- Type Definitions for Steps ---
const STEPS = [
  { id: 1, title: 'Personal Info', icon: User, fields: ['name', 'phone', 'city', 'state', 'country', 'bio'] },
  { id: 2, title: 'Social Links', icon: Globe, fields: ['linkedin', 'github', 'personalWebsite'] },
  { id: 3, title: 'Identity Proof', icon: FileText, fields: [] }, // Manual validation for file
  { id: 4, title: 'Availability', icon: Calendar, fields: ['availableDays', 'preferredTime', 'sessionMode', 'sessionsPerWeek'] },
  { id: 5, title: 'Mentor Type', icon: Briefcase, fields: ['mentorType'] },
  { id: 6, title: 'Specific Details', icon: Layers, fields: [] }, // Dynamic validation
  { id: 7, title: 'Review', icon: CheckCircle, fields: [] },
] as const;

// --- Helper Components ---
const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ElementType }) => (
  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
    {Icon && <Icon className="w-6 h-6 text-sky-600" />}
    {children}
  </h2>
);

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
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
    formState: { errors, isValid, isSubmitting },
  } = useForm<mentorFormSchemaType>({
    resolver: zodResolver(mentorFormSchema),
    mode: 'onChange',
    defaultValues: {
      availableDays: [],
      preferredTime: [],
      sessionsPerWeek: '5',
      mentorType: undefined,
    }
  });

  const watchedMentorType = watch('mentorType');
  const watchedSessionMode = watch('sessionMode');
  const watchedDays = watch('availableDays') || [];
  const watchedTimes = watch('preferredTime') || [];

  useEffect(() => {
    if (currentUser?.role === 'mentor') {
      const mentor = currentUser as Mentor;
      const status = mentor.status;
      if (status === 'pending') {
        navigate('/mentor/application-received');
      } else if (status && status !== 'incomplete' && status !== 'pending') {
        navigate('/mentor/dashboard');
      }
    }
  }, [currentUser, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'resume' | 'certificate' | 'idProof') => {
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
      return true;
    }

    // Dynamic validation for Step 6
    if (stepId === 6) {
      if (watchedMentorType === 'Academic') {
        return await trigger(['qualification', 'university', 'academicDomain', 'academicExperience', 'studentLevel']);
      }
      if (watchedMentorType === 'Industry') {
        return await trigger(['industryCategory', 'experienceYears', 'currentRole', 'skills', 'guidanceAreas']);
      }
      return false;
    }

    if (stepConfig.fields.length > 0) {
      const result = await trigger(stepConfig.fields as FieldPath<mentorFormSchemaType>[]);
      return result;
    }

    return true;
  };

  const handleNext = async () => {
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

  const onSubmit: SubmitHandler<mentorFormSchemaType> = async (data) => {
    try {
      if (!files.resume) { // Check resume here as it's separate from ID proof step
        toast.error("Please upload your resume.");
        return;
      }

      const result = await mentorApi.submitApplication(data, files);

      if (result.status === 'pending') {
        toast.success('Application submitted successfully!');
        if (currentUser) {
          const updatedUser = { ...currentUser, status: 'pending' };
          dispatch(setCredentials({ currentUser: updatedUser as currentUserType }));
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
    const currentStepConfig = STEPS.find(s => s.id === currentStep);
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
        {renderHeader()}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
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
                      <input {...register('name')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="John Doe" />
                      <ErrorMsg message={errors.name?.message} />
                    </div>
                    <div>
                      <Label required>Phone Number</Label>
                      <input {...register('phone')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="1234567890" />
                      <ErrorMsg message={errors.phone?.message} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label required>City</Label>
                      <input {...register('city')} className="w-full p-3 border rounded-lg" />
                      <ErrorMsg message={errors.city?.message} />
                    </div>
                    <div>
                      <Label required>State</Label>
                      <input {...register('state')} className="w-full p-3 border rounded-lg" />
                      <ErrorMsg message={errors.state?.message} />
                    </div>
                    <div>
                      <Label required>Country</Label>
                      <input {...register('country')} className="w-full p-3 border rounded-lg" />
                      <ErrorMsg message={errors.country?.message} />
                    </div>
                  </div>

                  <div>
                    <Label required>Short Bio</Label>
                    <textarea {...register('bio')} rows={4} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500" placeholder="Tell us a bit about yourself..." />
                    <ErrorMsg message={errors.bio?.message} />
                  </div>
                </div>
              )}

              {/* STEP 2: Social Links */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <SectionTitle icon={Globe}>Public & Social Links</SectionTitle>
                  <div>
                    <Label required>LinkedIn Profile</Label>
                    <input {...register('linkedin')} className="w-full p-3 border rounded-lg" placeholder="https://linkedin.com/in/..." />
                    <ErrorMsg message={errors.linkedin?.message} />
                  </div>
                  <div>
                    <Label>GitHub / Portfolio (Optional)</Label>
                    <input {...register('github')} className="w-full p-3 border rounded-lg" placeholder="https://github.com/..." />
                    <ErrorMsg message={errors.github?.message} />
                  </div>
                  <div>
                    <Label>Personal Website (Optional)</Label>
                    <input {...register('personalWebsite')} className="w-full p-3 border rounded-lg" placeholder="https://mysite.com" />
                    <ErrorMsg message={errors.personalWebsite?.message} />
                  </div>
                </div>
              )}

              {/* STEP 3: Identity Proof */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <SectionTitle icon={FileText}>Identity Verification</SectionTitle>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'idProof')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".pdf,.png,.jpg,.jpeg"
                    />
                    <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium">{files.idProof ? files.idProof.name : "Click or drag to upload Government ID"}</p>
                    <p className="text-sm text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                    {files.idProof && <p className="text-green-600 text-sm mt-2 font-semibold">File Selected</p>}
                  </div>
                  <p className="text-xs text-gray-500 text-center flex items-start justify-center gap-1">
                    <Layout className="w-3 h-3 mt-0.5" />
                    This document is used for verification purposes only and will not be shared publicly.
                  </p>

                  <div className="mt-8 pt-8 border-t">
                    <Label required>Resume / CV</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative mt-2">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'resume')}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf"
                      />
                      <p className="text-gray-700">{files.resume ? files.resume.name : "Upload Resume (PDF)"}</p>
                    </div>
                    {!files.resume && <p className="text-amber-600 text-sm mt-1">Resume is required for submission.</p>}
                  </div>
                </div>
              )}

              {/* STEP 4: Availability */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <SectionTitle icon={Calendar}>Availability & Preference</SectionTitle>

                  {/* Session Mode */}
                  <div>
                    <Label required>Preferred Session Mode</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      {['Call', 'Chat', 'Both'].map((mode) => (
                        <label key={mode} className={`
                                cursor-pointer border rounded-lg p-4 text-center transition-all
                                ${watchedSessionMode === mode ? 'bg-sky-50 border-sky-500 text-sky-700' : 'hover:bg-gray-50'}
                            `}>
                          <input
                            type="radio"
                            value={mode}
                            {...register('sessionMode')}
                            className="hidden"
                          />
                          <span className={watchedSessionMode === mode ? 'font-bold' : ''}>{mode}</span>
                        </label>
                      ))}
                    </div>
                    <ErrorMsg message={errors.sessionMode?.message} />
                  </div>

                  {/* Days Checkboxes */}
                  <div>
                    <Label required>Available Days</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <label key={day} className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer max-w-full ${watchedDays.includes(day) ? 'bg-sky-50 border-sky-400' : ''}`}>
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
                        'Night (9 PM - 12 AM)'
                      ].map((time) => (
                        <label key={time} className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer ${watchedTimes.includes(time) ? 'bg-sky-50 border-sky-400' : ''}`}>
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

                  <div>
                    <Label required>Estimated Sessions Per Week</Label>
                    <input
                      type="number"
                      {...register('sessionsPerWeek')}
                      className="w-full p-3 border rounded-lg mt-1"
                      placeholder="e.g. 10"
                      min="1"
                    />
                    <ErrorMsg message={errors.sessionsPerWeek?.message} />
                  </div>
                </div>
              )}

              {/* STEP 5: Mentor Type */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <SectionTitle icon={Briefcase}>Choose Mentor Type</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      onClick={() => setValue('mentorType', 'Academic')}
                      className={`cursor-pointer border-2 rounded-xl p-6 hover:shadow-lg transition-all ${watchedMentorType === 'Academic' ? 'border-sky-500 bg-sky-50' : 'border-gray-200'}`}
                    >
                      <GraduationCap className={`w-12 h-12 mb-4 ${watchedMentorType === 'Academic' ? 'text-sky-600' : 'text-gray-400'}`} />
                      <h3 className="text-xl font-bold mb-2">Academic Mentor</h3>
                      <p className="text-gray-500 text-sm">
                        For professors, researchers, and students who want to guide others in academic subjects, research papers, and higher education paths.
                      </p>
                    </div>

                    <div
                      onClick={() => setValue('mentorType', 'Industry')}
                      className={`cursor-pointer border-2 rounded-xl p-6 hover:shadow-lg transition-all ${watchedMentorType === 'Industry' ? 'border-sky-500 bg-sky-50' : 'border-gray-200'}`}
                    >
                      <Briefcase className={`w-12 h-12 mb-4 ${watchedMentorType === 'Industry' ? 'text-sky-600' : 'text-gray-400'}`} />
                      <h3 className="text-xl font-bold mb-2">Industry Mentor</h3>
                      <p className="text-gray-500 text-sm">
                        For professionals working in the industry who can provide career guidance, interview prep, and real-world project insights.
                      </p>
                    </div>
                  </div>
                  <ErrorMsg message={errors.mentorType?.message} />
                  {watchedMentorType && (
                    <p className="text-center text-sm text-gray-500 mt-4">
                      You selected <strong>{watchedMentorType} Monitor</strong>. Click Next to provide details.
                    </p>
                  )}
                </div>
              )}

              {/* STEP 6: Specific Details */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  {watchedMentorType === 'Academic' ? (
                    <>
                      <SectionTitle icon={GraduationCap}>Academic Details</SectionTitle>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label required>Highest Qualification</Label>
                          <select {...register('qualification')} className="w-full p-3 border rounded-lg bg-white">
                            <option value="">Select Qualification</option>
                            <option value="Bachelor">Bachelor</option>
                            <option value="Master">Master</option>
                            <option value="PhD">PhD</option>
                            <option value="Post-Doctoral">Post-Doctoral</option>
                            <option value="Other">Other</option>
                          </select>
                          <ErrorMsg message={errors.qualification?.message} />
                        </div>
                        <div>
                          <Label required>University / Institute</Label>
                          <input {...register('university')} className="w-full p-3 border rounded-lg" placeholder="University Name" />
                          <ErrorMsg message={errors.university?.message} />
                        </div>
                      </div>

                      <div>
                        <Label required>Main Academic Domain</Label>
                        <input {...register('academicDomain')} className="w-full p-3 border rounded-lg" placeholder="e.g. Computer Science, Physics" />
                        <ErrorMsg message={errors.academicDomain?.message} />
                      </div>

                      <div>
                        <Label>Student Level to Guide</Label>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          {['School', 'Undergraduate', 'Postgraduate', 'PhD'].map((level) => (
                            <label key={level} className="flex items-center space-x-2">
                              <input type="checkbox" value={level} {...register('studentLevel')} className="rounded text-sky-600 w-4 h-4" />
                              <span>{level}</span>
                            </label>
                          ))}
                        </div>
                        <ErrorMsg message={errors.studentLevel?.message} />
                      </div>

                      <div>
                        <Label required>Academic Experience</Label>
                        <textarea {...register('academicExperience')} rows={3} className="w-full p-3 border rounded-lg" placeholder="Describe your teaching/research experience..." />
                        <ErrorMsg message={errors.academicExperience?.message} />
                      </div>

                      <div>
                        <Label>Degree Certificate (PDF/Image)</Label>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, 'certificate')}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <SectionTitle icon={Briefcase}>Industry Details</SectionTitle>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label required>Industry Category</Label>
                          <input {...register('industryCategory')} className="w-full p-3 border rounded-lg" placeholder="e.g. Fintech, Healthcare, Edtech" />
                          <ErrorMsg message={errors.industryCategory?.message} />
                        </div>
                        <div>
                          <Label required>Years of Experience</Label>
                          <input {...register('experienceYears')} type="number" className="w-full p-3 border rounded-lg" placeholder="e.g. 5" />
                          <ErrorMsg message={errors.experienceYears?.message} />
                        </div>
                      </div>

                      <div>
                        <Label required>Current Role / Company</Label>
                        <input {...register('currentRole')} className="w-full p-3 border rounded-lg" placeholder="e.g. Senior Software Engineer at Google" />
                        <ErrorMsg message={errors.currentRole?.message} />
                      </div>

                      <div>
                        <Label required>Key Skills (Comma separated)</Label>
                        <input {...register('skills')} className="w-full p-3 border rounded-lg" placeholder="React, Node.js, System Design, Communication" />
                        <ErrorMsg message={errors.skills?.message} />
                      </div>

                      <div>
                        <Label>Guidance Areas</Label>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          {['Career Guidance', 'Mock Interviews', 'System Design', 'Domain Knowledge', 'Resume Review'].map((area) => (
                            <label key={area} className="flex items-center space-x-2">
                              <input type="checkbox" value={area} {...register('guidanceAreas')} className="rounded text-sky-600 w-4 h-4" />
                              <span>{area}</span>
                            </label>
                          ))}
                        </div>
                        <ErrorMsg message={errors.guidanceAreas?.message} />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* STEP 7: Review */}
              {currentStep === 7 && (
                <div className="space-y-6">
                  <SectionTitle icon={CheckCircle}>Review & Submit</SectionTitle>

                  <div className="bg-gray-50 p-6 rounded-xl space-y-4 text-sm">
                    <div className="grid grid-cols-2 border-b pb-2">
                      <span className="text-gray-500">Name</span>
                      <span className="font-medium">{getValues('name')}</span>
                    </div>
                    <div className="grid grid-cols-2 border-b pb-2">
                      <span className="text-gray-500">Email</span>
                      <span className="font-medium">{currentUser?.email}</span>
                    </div>
                    <div className="grid grid-cols-2 border-b pb-2">
                      <span className="text-gray-500">Mentor Type</span>
                      <span className="font-medium text-sky-600">{getValues('mentorType')}</span>
                    </div>
                    <div className="grid grid-cols-2 border-b pb-2">
                      <span className="text-gray-500">Sessions/Week</span>
                      <span className="font-medium">{getValues('sessionsPerWeek')}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-gray-500">Documents</span>
                      <span className="font-medium">
                        {files.idProof ? 'ID Proof Uploaded' : 'Missing ID'} • {files.resume ? 'Resume Uploaded' : 'Missing Resume'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 text-blue-800 text-sm">
                    <Clock className="w-5 h-5 shrink-0" />
                    <p>
                      Once submitted, your application will be reviewed by our admin team. This process usually takes 24-48 hours. You will be notified via email.
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Footer Actions */}
          <div className="mt-10 pt-6 border-t flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto flex items-center gap-2 px-6 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition shadow-lg shadow-sky-200"
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

