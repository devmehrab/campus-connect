import React from "react";

export interface AssignmentData {
  courseName?: string;
  courseCode?: string;
  assignmentTitle?: string;
  studentName?: string;
  idNo?: string;
  section?: string;
  batch?: string;
  semester?: string;
  levelTerm?: string;
  dateOfSubmission?: string;
  remarks?: string;
}

interface AssignmentFormProps {
  data: AssignmentData;
  onChange: (data: AssignmentData) => void;
}

export default function AssignmentForm({
  data,
  onChange,
}: AssignmentFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  // Reusable Shadcn-style utility classes
  const inputBaseClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const labelBaseClass =
    "text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block";

  return (
    <form className="space-y-4">
      {/* Top Row: Course Name & Course Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelBaseClass}>COURSE NAME</label>
          <input
            type="text"
            name="courseName"
            value={data.courseName || ""}
            onChange={handleChange}
            className={inputBaseClass}
            placeholder="e.g., Data Structures"
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
            maxLength={8}
          />
        </div>
      </div>

      {/* Full Width: Assignment Title */}
      <div>
        <label className={labelBaseClass}>ASSIGNMENT TITLE</label>
        <input
          type="text"
          name="assignmentTitle"
          value={data.assignmentTitle || ""}
          onChange={handleChange}
          className={inputBaseClass}
          placeholder="Enter assignment title"
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
          <label className={labelBaseClass}>ID NO.</label>
          <input
            type="text"
            name="idNo"
            value={data.idNo || ""}
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
          <label className={labelBaseClass}>BATCH</label>
          <input
            type="text"
            name="batch"
            value={data.batch || ""}
            onChange={handleChange}
            className={inputBaseClass}
            placeholder="e.g., 2024"
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
          <label className={labelBaseClass}>LEVEL/TERM</label>
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
