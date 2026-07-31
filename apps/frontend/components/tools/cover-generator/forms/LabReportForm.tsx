import React from "react";

export interface LabReportData {
  expNo?: string;
  courseCode?: string;
  experimentName?: string;
  studentName?: string;
  rollNo?: string;
  section?: string;
  semester?: string;
  levelTerm?: string;
  courseName?: string;
  dateOfExperiment?: string;
  dateOfSubmission?: string;
  group?: string;
  remarks?: string;
}

interface LabReportFormProps {
  data: LabReportData;
  onChange: (data: LabReportData) => void;
}

export default function LabReportForm({ data, onChange }: LabReportFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  // Reusable Shadcn-style utility classes to match your theme without needing the actual components
  const inputBaseClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const labelBaseClass =
    "text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block";

  return (
    <form className="space-y-4">
      {/* Top Row: Exp No & Course Code */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelBaseClass}>EXP NO.</label>
          <input
            type="text"
            name="expNo"
            value={data.expNo || ""}
            onChange={handleChange}
            className={inputBaseClass}
            placeholder="e.g., 01"
          />
        </div>
        <div>
          <label className={labelBaseClass}>COURSE CODE</label>
          <input
            type="text"
            name="courseCode"
            value={data.courseCode || ""}
            onChange={handleChange}
            className={inputBaseClass}
            placeholder="e.g., CSE 1234"
          />
        </div>
      </div>

      {/* Full Width: Name of the Experiment */}
      <div>
        <label className={labelBaseClass}>NAME OF THE EXPERIMENT</label>
        <input
          type="text"
          name="experimentName"
          value={data.experimentName || ""}
          onChange={handleChange}
          className={inputBaseClass}
          placeholder="Enter experiment title"
        />
      </div>

      {/* Grid for the rest of the student details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelBaseClass}>STUDENT NAME</label>
          <input
            type="text"
            name="studentName"
            value={data.studentName || ""}
            onChange={handleChange}
            className={inputBaseClass}
          />
        </div>
        <div>
          <label className={labelBaseClass}>ROLL NO.</label>
          <input
            type="text"
            name="rollNo"
            value={data.rollNo || ""}
            onChange={handleChange}
            className={inputBaseClass}
          />
        </div>
        <div>
          <label className={labelBaseClass}>SECTION</label>
          <input
            type="text"
            name="section"
            value={data.section || ""}
            onChange={handleChange}
            className={inputBaseClass}
          />
        </div>
        <div>
          <label className={labelBaseClass}>SEMESTER</label>
          <input
            type="text"
            name="semester"
            value={data.semester || ""}
            onChange={handleChange}
            className={inputBaseClass}
          />
        </div>
        <div>
          <label className={labelBaseClass}>LEVEL/ TERM</label>
          <input
            type="text"
            name="levelTerm"
            value={data.levelTerm || ""}
            onChange={handleChange}
            className={inputBaseClass}
            placeholder="e.g., 1 / 2"
          />
        </div>
        <div>
          <label className={labelBaseClass}>COURSE NAME</label>
          <input
            type="text"
            name="courseName"
            value={data.courseName || ""}
            onChange={handleChange}
            className={inputBaseClass}
          />
        </div>
        <div>
          <label className={labelBaseClass}>DATE OF EXPERIMENT</label>
          <input
            type="text"
            name="dateOfExperiment"
            value={data.dateOfExperiment || ""}
            onChange={handleChange}
            className={inputBaseClass}
            placeholder="DD / MM / YYYY"
          />
        </div>
        <div>
          <label className={labelBaseClass}>DATE OF SUBMISSION</label>
          <input
            type="text"
            name="dateOfSubmission"
            value={data.dateOfSubmission || ""}
            onChange={handleChange}
            className={inputBaseClass}
            placeholder="DD / MM / YYYY"
          />
        </div>
        <div>
          <label className={labelBaseClass}>GROUP</label>
          <input
            type="text"
            name="group"
            value={data.group || ""}
            onChange={handleChange}
            className={inputBaseClass}
          />
        </div>
        <div>
          <label className={labelBaseClass}>REMARKS</label>
          <input
            type="text"
            name="remarks"
            value={data.remarks || ""}
            onChange={handleChange}
            className={inputBaseClass}
          />
        </div>
      </div>
    </form>
  );
}
