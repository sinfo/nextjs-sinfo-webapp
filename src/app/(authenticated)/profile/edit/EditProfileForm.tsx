"use client";

import { useForm, useFieldArray } from "react-hook-form";
import Image from "next/image";
import { Plus, Save, Upload, X } from "lucide-react";
import CountryList from "country-list";
import { useEffect, useState } from "react";
import Resizer from "react-image-file-resizer";

interface EditProfileFormProps {
  user: User;
  updateUser(user: User): Promise<void>;
}

type FormData = {
  name: string;
  title: string;
  imgFile: FileList;
  nationality: string;
  contacts: {
    linkedin: string;
    email: string;
    github: string;
  };
  academicInformation: {
    school: string;
    degree: string;
    field: string;
    start: string;
    end: string;
  }[];
  skill: string;
  skills: String[];
  interest: string;
  interestedIn: String[];
  lookingFor: {
    internship: boolean;
    fullTime: boolean;
    partTime: boolean;
  };
};

export default function EditProfileForm({
  user,
  updateUser,
}: EditProfileFormProps) {
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>(
    user.img,
  );
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: user.name,
      title: user.title,
      nationality: user.nationality,
      contacts: user.contacts,
      skills: user.skills,
      interestedIn: user.interestedIn,
      lookingFor: {
        internship: user.lookingFor?.indexOf("Internship") !== -1,
        fullTime: user.lookingFor?.indexOf("Full-time") !== -1,
        partTime: user.lookingFor?.indexOf("Part-time") !== -1,
      },
      academicInformation: user.academicInformation?.map((info) => ({
        ...info,
        start: info.start?.split("T")[0].slice(0, 7),
        end: info.end?.split("T")[0].slice(0, 7),
      })),
    },
  });
  const { append: appendSkill, remove: removeSkill } = useFieldArray({
    name: "skills",
    control,
    rules: {
      maxLength: 10,
    },
  });
  const skills = watch("skills");
  const { append: appendInterest, remove: removeInterest } = useFieldArray({
    name: "interestedIn",
    control,
    rules: {
      maxLength: 10,
    },
  });
  const interestedIn = watch("interestedIn");
  const {
    fields: academicInformationFields,
    append: appendAcademicInformation,
    remove: removeAcademicInformation,
  } = useFieldArray({
    name: "academicInformation",
    control,
    rules: {
      maxLength: 3,
    },
  });
  const imgFile: FileList | undefined = watch("imgFile");

  const onSubmit = handleSubmit(async (formData) => {
    const lookingFor = [];
    if (formData.lookingFor.internship) lookingFor.push("Internship");
    if (formData.lookingFor.partTime) lookingFor.push("Part-time");
    if (formData.lookingFor.fullTime) lookingFor.push("Full-time");

    const imgFile = formData.imgFile.item(0);

    async function resizeImageAndConvert(file: File): Promise<string> {
      return new Promise((resolve) =>
        Resizer.imageFileResizer(
          file,
          300, // Max width
          300, // Max height
          "JPEG", // Output compression
          100, // Quality
          0, // Rotation
          (uri) => resolve(uri as string),
          "base64", // Output format
        ),
      );
    }

    await updateUser({
      id: user.id,
      role: user.role,
      img: (imgFile && (await resizeImageAndConvert(imgFile))) || user.img,
      name: formData.name,
      title: formData.title,
      nationality: formData.nationality,
      contacts: formData.contacts,
      academicInformation: formData.academicInformation.map((info) => ({
        ...info,
        start: new Date(info.start).toISOString(),
        end: new Date(info.end).toISOString(),
      })),
      skills: formData.skills.map((s) => s.toString()),
      interestedIn: formData.interestedIn.map((s) => s.toString()),
      lookingFor,
    });
  });

  useEffect(() => {
    const file = imgFile?.item(0);
    if (file) {
      const urlImage = URL.createObjectURL(file);
      setProfilePicturePreview(urlImage);
    }
  }, [imgFile]);

  return (
    <form className="flex flex-col gap-y-4 p-4" onSubmit={onSubmit}>
      {/* Image */}
      <div className="relative">
        <Image
          className="size-[150px] object-contain rounded-full mx-auto border-4 border-white"
          width={150}
          height={150}
          src={profilePicturePreview}
          alt="Profile picture"
        />
        <label
          htmlFor="img"
          className="absolute -bottom-2 left-24 right-0 mx-auto size-10 flex justify-center items-center bg-sinfo-primary rounded-full p-2 text-white"
        >
          <Upload />
        </label>
        <input
          type="file"
          id="img"
          accept="image/png, image/jpeg"
          className="absolute z-10 size-[150px] inset-0 mx-auto rounded-full opacity-0"
          {...register("imgFile")}
        />
        <span className="text-sm text-red-700">{errors.imgFile?.message}</span>
      </div>

      <h3 className="text-lg font-semibold">Profile information</h3>

      {/* Name */}
      <div>
        <label htmlFor="name" className="text-gray-600">
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="John Doe"
          className="input"
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 5,
              message: "Should have at least 5 characters",
            },
            maxLength: {
              value: 30,
              message: "Cannot have more than 30 characters",
            },
          })}
        />
        <span className="text-sm text-red-700">{errors.name?.message}</span>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="text-gray-600">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Computer Science Student"
          className="input"
          {...register("title", {
            minLength: {
              value: 5,
              message: "Should have at least 5 characters",
            },
            maxLength: {
              value: 50,
              message: "Cannot have more than 50 characters",
            },
          })}
        />
        <span className="text-sm text-red-700">{errors.title?.message}</span>
      </div>

      {/* Nationality */}
      <div>
        <label htmlFor="nationality" className="text-gray-600">
          Nationality
        </label>
        <select
          id="nationality"
          autoComplete="country-name"
          className="input"
          {...register("nationality")}
        >
          <option>Choose an option</option>
          {CountryList.getNames().map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <span className="text-sm text-red-700">
          {errors.nationality?.message}
        </span>
      </div>

      <h3 className="text-lg font-semibold">Contacts</h3>

      {/* Email */}
      <div>
        <label htmlFor="email" className="text-gray-600">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="john.doe@example.com"
          autoComplete="email"
          className="input"
          {...register("contacts.email")}
        />
      </div>

      {/* Linkedin */}
      <div>
        <label htmlFor="linkedin" className="text-gray-600">
          Linkedin
        </label>
        <input
          id="linkedin"
          type="text"
          placeholder="johndoe"
          className="input"
          {...register("contacts.linkedin", {
            pattern: {
              value: /^[A-Za-z0-9_-]{3,300}$/,
              message: "Invalid username",
            },
          })}
        />
        <span className="text-sm text-red-700">
          {errors.contacts?.linkedin?.message}
        </span>
        <span className="text-gray-600 text-sm block">
          Don&apos;t know how to find it?&nbsp;
          <a
            href="https://www.linkedin.com/help/linkedin/answer/a522735"
            className="text-link"
          >
            Click here
          </a>
        </span>
      </div>

      {/* GitHub */}
      <div>
        <label htmlFor="github" className="text-gray-600">
          GitHub
        </label>
        <input
          id="github"
          type="text"
          placeholder="john.doe"
          className="input"
          {...register("contacts.github", {
            pattern: {
              value: /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i,
              message: "Invalid username",
            },
          })}
        />
        <span className="text-sm text-red-700">
          {errors.contacts?.github?.message}
        </span>
      </div>

      {/* Academic Information */}
      <h3 className="text-lg font-semibold">Academic information</h3>
      <div className="flex flex-col gap-y-4 divide-y-4">
        {academicInformationFields.map((_, idx) => (
          <div
            key={`academic-info-${idx}`}
            className="flex flex-col gap-y-2 py-2"
          >
            {/* School */}
            <div>
              <div className="flex justify-end">
                <button
                  className="text-red-700"
                  onClick={() => removeAcademicInformation(idx)}
                >
                  <X size={24} />
                </button>
              </div>
              <label htmlFor="school" className="text-gray-600">
                School
              </label>
              <input
                id="school"
                type="text"
                placeholder="Instituto Superior Técnico"
                className="input"
                {...register(`academicInformation.${idx}.school`, {
                  required: "School is required",
                })}
              />
              <span className="text-sm text-red-700">
                {errors.academicInformation?.[idx]?.school?.message}
              </span>
            </div>
            {/* Field of study */}
            <div>
              <label htmlFor="field" className="text-gray-600">
                Field of study
              </label>
              <input
                id="field"
                type="text"
                placeholder="Computer Science and Engineering"
                className="input"
                {...register(`academicInformation.${idx}.field`, {
                  required: "Field of study is required",
                })}
              />
              <span className="text-sm text-red-700">
                {errors.academicInformation?.[idx]?.field?.message}
              </span>
            </div>
            {/* Degree */}
            <div>
              <label htmlFor="degree" className="text-gray-600">
                Degree
              </label>
              <select
                id="degree"
                className="input"
                {...register(`academicInformation.${idx}.degree`, {
                  required: "Degree is required",
                })}
              >
                <option value="">Choose an option</option>
                <option value="Associate degree">Associate degree</option>
                <option value="Bachelor's degree">
                  Bachelor&apos;s degree
                </option>
                <option value="Master's degree">Master&apos;s degree</option>
                <option value="Doctoral degree">Doctoral degree</option>
                <option value="Other">Other</option>
              </select>
              <span className="text-sm text-red-700">
                {errors.academicInformation?.[idx]?.degree?.message}
              </span>
            </div>
            {/* Dates */}
            <div className="flex justify-between flex-wrap gap-2">
              <div className="flex-1">
                <label htmlFor="start-date" className="text-gray-600">
                  Start date
                </label>
                <input
                  id="start-date"
                  type="month"
                  className="input"
                  {...register(`academicInformation.${idx}.start`, {
                    required: "Start date is required",
                    pattern: {
                      value: /\d{4}-\d{2}/,
                      message: "Invalid date format (YYYY-MM)",
                    },
                  })}
                />
                <span className="text-sm text-red-700">
                  {errors.academicInformation?.[idx]?.start?.message}
                </span>
              </div>
              <div className="flex-1">
                <label htmlFor="end-date" className="text-gray-600">
                  End date
                </label>
                <input
                  id="end-date"
                  type="month"
                  className="input"
                  {...register(`academicInformation.${idx}.end`, {
                    required: "End date is required",
                    deps: [`academicInformation.${idx}.start`],
                    pattern: {
                      value: /\d{4}-\d{2}/,
                      message: "Invalid date format (YYYY-MM)",
                    },
                    validate: (v) =>
                      getValues(`academicInformation.${idx}.start`) < v,
                  })}
                />
                <span className="text-sm text-red-700">
                  {errors.academicInformation?.[idx]?.end?.message}
                </span>
              </div>
            </div>
          </div>
        ))}
        <button
          className="button button-primary w-full mt-2"
          disabled={!!errors.academicInformation}
          onClick={() => {
            if (!errors.academicInformation) {
              appendAcademicInformation({
                school: "",
                degree: "",
                field: "",
                end: "",
                start: "",
              });
            }
          }}
        >
          Add academic entry
        </button>
      </div>

      {/* Skills */}
      <h3 className="text-lg font-semibold">Skills</h3>
      <div>
        <div className="flex items-center justify-center gap-x-2">
          <input
            id={`skill`}
            type="text"
            placeholder="Add a skill (e.g. C, Python, Javascript)"
            className="input"
            {...register(`skill`, {
              minLength: 1,
              maxLength: 20,
            })}
          />
          <button
            className="button button-primary disabled:opacity-70"
            disabled={!!errors.skill || watch("skill") === ""}
            onClick={(e) => {
              e.preventDefault();
              const value = getValues("skill");
              if (!errors.skill && value !== "") {
                appendSkill(value);
                setValue("skill", "");
              }
            }}
          >
            <Plus strokeWidth={1} />
          </button>
        </div>
        <span className="text-sm text-red-700">{errors.skill?.message}</span>
        <div className="flex flex-wrap gap-2 py-2 text-sm">
          {skills.map((skill, idx) => (
            <button
              key={skill.toString()}
              className="relative flex justify-center items-center gap-x-2gap-x-2 py-1 px-2 bg-sinfo-quaternary text-white rounded-md shadow-md "
              onClick={() => removeSkill(idx)}
            >
              {skill}
              <X strokeWidth={1} size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <h3 className="text-lg font-semibold">Interested in</h3>
      <div>
        <div className="flex items-center justify-center gap-x-2">
          <input
            id={`interest`}
            type="text"
            placeholder="Add a interest (e.g. AI, Cybersecurity)"
            className="input"
            {...register(`interest`, {
              minLength: 1,
              maxLength: 20,
            })}
          />
          <button
            className="button button-primary disabled:opacity-70"
            disabled={!!errors.interest || watch("interest") === ""}
            onClick={(e) => {
              e.preventDefault();
              const value = getValues("interest");
              if (!errors.interest && value !== "") {
                appendInterest(value);
                setValue("interest", "");
              }
            }}
          >
            <Plus strokeWidth={1} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 py-2 text-sm">
          {interestedIn.map((interest, idx) => (
            <button
              key={interest.toString()}
              className="relative flex justify-center items-center gap-x-2gap-x-2 py-1 px-2 bg-sinfo-tertiary text-white rounded-md shadow-md "
              onClick={() => removeInterest(idx)}
            >
              {interest}
              <X strokeWidth={1} size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Looking for */}
      <h3 className="text-lg font-semibold">Looking for</h3>
      <div>
        <fieldset>
          <div>
            <input
              id="full-time"
              type="checkbox"
              className="mr-2 accent-sinfo-primary"
              {...register("lookingFor.fullTime")}
            />
            <label htmlFor="full-time">Full-time</label>
          </div>
          <div className="flex">
            <input
              id="internship"
              type="checkbox"
              className="mr-2 accent-sinfo-primary"
              {...register("lookingFor.internship")}
            />
            <label htmlFor="internship">Internship</label>
          </div>
          <div>
            <input
              id="part-time"
              type="checkbox"
              className="mr-2 accent-sinfo-primary"
              {...register("lookingFor.partTime")}
            />
            <label htmlFor="part-time">Part-time</label>
          </div>
        </fieldset>
      </div>

      <button
        className="bg-sinfo-primary text-white rounded-full p-4 fixed mb-navbar bottom-4 right-4 disabled:opacity-75"
        type="submit"
      >
        <Save size={32} />
      </button>
    </form>
  );
}
