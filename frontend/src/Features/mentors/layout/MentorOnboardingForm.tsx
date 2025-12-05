import { FileInput } from '../components/OnboardFileInput';
import { Card } from '../components/OnboardCard';
import { Input } from '../components/OnboardInput';
import { Textarea } from '../components/OnboardTextArea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  mentorFormSchema,
  type mentorFormSchemaType,
} from '@/types/zodSchemas';
import api from '@/Services/axiosConfig';
import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
import { SelectInput } from '../components/OnboardSelectInput';
import { useState } from 'react';

export default function MentorOnboardingForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<mentorFormSchemaType>({
    resolver: zodResolver(mentorFormSchema),
    mode: 'onChange',
  });

  const [files, setFiles] = useState({
    certificate: null as File | null,
    resume: null as File | null,
    idProof: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFiles({ ...files, [e.target.name]: file });
  };
  // const navigate = useNavigate();

  const onSubmit = async (data: mentorFormSchemaType) => {
    console.log(data, '============');
    const formData = new FormData();

    // Append react-hook-form text fields
    Object.entries(data).forEach(([key, value]) => {
      console.log(key, value);
      formData.append(key, value);
    });

    // Append file fields
    if (files.certificate) formData.append('certificate', files.certificate);
    if (files.resume) formData.append('resume', files.resume);
    if (files.idProof) formData.append('idProof', files.idProof);

    // Append react-hook-form text fields
    for (const key of formData) {
      console.log(key);
    }
    try {
      console.log(formData, 'the form data from the tsx');
      const res = await api.post('/mentor/application', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res) {
        toast.success('Application submitted!');
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || 'Submission failed');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 flex justify-center">
      <div className="w-full max-w-4xl space-y-10 px-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* SECTION: Basic Details */}
          <Card title="Basic Details">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="text-red-500">{errors.fullName.message}</p>
            )}

            <Input
              label="Phone Number"
              placeholder="9876543210"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="text-red-500">{errors.phone.message}</p>
            )}

            <Input label="City" placeholder="Kochi" {...register('city')} />
            {errors.city && (
              <p className="text-red-500">{errors.city.message}</p>
            )}

            <Input
              label="State"
              placeholder="e.g., Goa"
              {...register('state')}
            />
            {errors.state && (
              <p className="text-red-500">{errors.state.message}</p>
            )}

            <Input
              label="Country"
              placeholder="India"
              {...register('country')}
            />
            {errors.country && (
              <p className="text-red-500">{errors.country.message}</p>
            )}

            <Textarea
              label="Short Bio"
              placeholder="Write a short introduction about yourself..."
              {...register('bio')}
            />
            {errors.bio && <p className="text-red-500">{errors.bio.message}</p>}

            <Input
              label="Public Profile (LinkedIn / portfolio)"
              placeholder="https://..."
              {...register('publicProfile')}
            />
            {errors.publicProfile && (
              <p className="text-red-500">{errors.publicProfile.message}</p>
            )}
          </Card>

          {/* SECTION: Education */}
          <Card title="Education Details">
            <Input
              label="Highest Qualification"
              placeholder="B.Tech, MCA, etc."
              {...register('highestQualification')}
            />
            {errors.highestQualification && (
              <p className="text-red-500">
                {errors.highestQualification.message}
              </p>
            )}

            <Input
              label="University"
              placeholder="Name of institution"
              {...register('university')}
            />
            {errors.university && (
              <p className="text-red-500">{errors.university.message}</p>
            )}

            <Input
              label="Graduation Year"
              placeholder="2020"
              {...register('graduationYear')}
            />
            {errors.graduationYear && (
              <p className="text-red-500">{errors.graduationYear.message}</p>
            )}

            <FileInput
              label="Education Certificates0"
              name="certificate"
              onChange={handleFileChange}
            />
            {/* {errors.certificates && (
              <p className="text-red-500">{errors.certificates.message}</p>
            )} */}
          </Card>

          {/* SECTION: Experience */}
          <Card title="Experience Details">
            <Input
              label="Years of Experience"
              placeholder="e.g., 2 years"
              {...register('experienceYears')}
            />
            {errors.experienceYears && (
              <p className="text-red-500">{errors.experienceYears.message}</p>
            )}

            <Input
              label="Primary Skills"
              placeholder="React, Node.js, Python..."
              {...register('skills')}
            />
            {errors.skills && (
              <p className="text-red-500">{errors.skills.message}</p>
            )}

            <Textarea
              label="Experience Summary"
              placeholder="Describe your professional background..."
              {...register('experienceSummary')}
            />
            {errors.experienceSummary && (
              <p className="text-red-500">{errors.experienceSummary.message}</p>
            )}
          </Card>

          {/* SECTION: Resume */}
          <Card title="Resume Upload">
            <FileInput
              label="Upload Resume (PDF)"
              name="resume"
              onChange={handleFileChange}
            />
            {/* {errors.resume && (
              <p className="text-red-500">{errors.resume.message}</p>
            )} */}
          </Card>

          {/* SECTION: Identity proof */}
          <Card title="Identity Proof">
            <FileInput
              name="idProof"
              label="Upload any Proof (e.g. passport/aadhar)"
              onChange={handleFileChange}
            />
            {/* {errors.identityProof && (
              <p className="text-red-500">{errors.identityProof.message}</p>
            )} */}
          </Card>

          {/* SECTION: Availability */}
          <Card title="Weekly Availability">
            <SelectInput label="Available Days" {...register('availableDays')}>
              <option value="">Select days</option>
              <option value="Monday to Friday">Monday to Friday</option>
              <option value="Thursday to Saturday">Thursday to Saturday</option>
              <option value="Saturday & Sunday">Saturday & Sunday</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Weekends">Weekends</option>
              <option value="All Days">All Days</option>
            </SelectInput>

            {errors.availableDays && (
              <p className="text-red-500">{errors.availableDays.message}</p>
            )}

            <SelectInput label="Preferred Time" {...register('preferredTime')}>
              <option value="">Select time</option>
              <option value="5 PM - 8 PM">5 PM - 8 PM</option>
              <option value="10 AM - 1 PM">10 AM - 1 PM</option>
              <option value="2 PM - 5 PM">2 PM - 5 PM</option>
              <option value="9 AM - 5 PM">9 PM - 5 PM</option>
            </SelectInput>
            {errors.preferredTime && (
              <p className="text-red-500">{errors.preferredTime.message}</p>
            )}

            <Input
              label="Sessions per week"
              placeholder="5-15"
              {...register('sessionsPerWeek')}
            />
            {errors.sessionsPerWeek && (
              <p className="text-red-500">{errors.sessionsPerWeek.message}</p>
            )}
          </Card>

          {/* Submit */}
          <button className="w-full bg-sky-600 text-white py-3 rounded-lg shadow hover:bg-sky-700 transition-all">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
