import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register a standard serif font to match the academic look
Font.register({
  family: "Times-Roman",
  src: "https://themes.googleusercontent.com/static/fonts/timesnewroman/v5/w709LIfZl6I-Tf0LIFoRzQ.ttf",
});

// Styles for the A4 PDF Document
const styles = StyleSheet.create({
  page: {
    padding: "40px 60px",
    fontFamily: "Times-Roman",
    position: "relative",
    backgroundColor: "#ffffff",
  },
  watermarkContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
    opacity: 0.15,
  },
  watermarkImage: {
    width: 200,
    height: 200,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  universityName: {
    fontSize: 16,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  facultyName: {
    fontSize: 12,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  departmentName: {
    fontSize: 11,
    textTransform: "uppercase",
  },
  labReportBannerContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  labReportBanner: {
    border: "1px solid black",
    padding: "8px 40px",
    position: "relative",
  },
  bannerLeftArrow: {
    position: "absolute",
    left: -20,
    top: "50%",
    width: 20,
    borderBottom: "1px solid black",
  },
  bannerRightArrow: {
    position: "absolute",
    right: -20,
    top: "50%",
    width: 20,
    borderBottom: "1px solid black",
  },
  labReportText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  expCourseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    width: "100%",
  },
  expBox: {
    flexDirection: "row",
    alignItems: "flex-end",
    width: "45%",
  },
  courseBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    justifyContent: "flex-end",
  },
  courseBoxes: {
    flexDirection: "row",
    marginLeft: 5,
  },
  singleCourseBox: {
    width: 15,
    height: 18,
    border: "1px solid black",
    borderRight: "none",
  },
  lastCourseBox: {
    width: 15,
    height: 18,
    border: "1px solid black",
  },
  label: {
    fontSize: 11,
    textDecoration: "underline",
    textTransform: "uppercase",
  },
  valueLine: {
    // borderBottom: "1px solid black",
    flexGrow: 1,
    marginLeft: 5,
    paddingBottom: 2,
    fontSize: 11,
  },
  experimentNameRow: {
    flexDirection: "row",
    alignItems: "flex-start", // Keeps the label at the top if the text wraps to multiple lines
    marginBottom: 30,
    width: "100%",
  },
  experimentNameLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    width: 160, // Fixed width for the label
  },
  experimentNameLines: {
    flex: 1, // This forces the container to strict-fill ONLY the remaining width, forcing text to wrap
  },
  experimentValueText: {
    fontSize: 11,
    width: "100%",
    minHeight: 16, // minHeight prevents the row from collapsing completely when the form is empty
    borderBottom: "1px solid gray",
    // paddingBottom: 2,
  },
  longValueLine: {
    // borderBottom: "1px solid black",
    height: 16,
    width: "100%",
    fontSize: 11,
  },
  detailsContainer: {
    marginTop: 20,
    width: "100%",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-end",
  },
  detailLabel: {
    width: 140,
    fontSize: 11,
    textTransform: "uppercase",
  },
  colon: {
    width: 20,
    fontSize: 11,
    textAlign: "center",
  },
  detailValue: {
    flexGrow: 1,
    fontSize: 11,
    // borderBottom: "1px dashed transparent",
  },
  signatureContainer: {
    position: "absolute",
    bottom: 50,
    right: 60,
    alignItems: "center",
  },
  signatureLine: {
    width: 150,
    borderTop: "1px solid black",
    marginTop: 60,
    paddingTop: 5,
  },
  signatureText: {
    fontSize: 10,
    textAlign: "center",
  },
});

// Interface for the data expected from the form
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

interface LabReportCoverProps {
  data: LabReportData;
}

export default function LabReportCover({ data }: LabReportCoverProps) {
  // Pad course code to fill boxes (assuming 7 boxes based on image)
  const paddedCourseCode = (data.courseCode || "").padEnd(8, " ").slice(0, 8);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Faded Background Watermark */}
        <View style={styles.watermarkContainer}>
          <Image src="/bup_logo_alt.png" style={styles.watermarkImage} />
        </View>

        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Image src="/bup_logo_alt.png" style={styles.logo} />
          <Text style={styles.universityName}>
            Bangladesh University of Professionals
          </Text>
          <Text style={styles.facultyName}>
            Faculty of Science & Technology
          </Text>
          <Text style={styles.departmentName}>
            Dept. of Computer Science & Engineering (CSE)
          </Text>
        </View>

        {/* Lab Report Banner */}
        <View style={styles.labReportBannerContainer}>
          {/* Note: React-PDF doesn't natively draw complex shapes like the angled ribbon ends easily. 
               We are approximating the banner box. For exact vector ribbons, an png image is better. */}
          <View style={styles.labReportBanner}>
            <Text style={styles.labReportText}>LAB REPORT</Text>
          </View>
        </View>

        {/* Exp No and Course Code Row */}
        <View style={styles.expCourseRow}>
          <View style={styles.expBox}>
            <Text style={styles.label}>EXP NO.:</Text>
            <Text style={styles.valueLine}>{data.expNo || ""}</Text>
          </View>

          <View style={styles.courseBox}>
            <Text style={styles.label}>COURSE CODE: </Text>
            <View style={styles.courseBoxes}>
              {paddedCourseCode.split("").map((char, index) => (
                <View
                  key={index}
                  style={[
                    styles.singleCourseBox,
                    index === 7 ? styles.lastCourseBox : {},
                    { justifyContent: "center", alignItems: "center" },
                  ]}
                >
                  <Text style={{ fontSize: 10 }}>{char.trim()}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Experiment Name (Two Lines) */}
        <View style={styles.experimentNameRow}>
          <Text style={styles.experimentNameLabel}>
            NAME OF THE EXPERIMENT:
          </Text>
          <View style={styles.experimentNameLines}>
            <Text style={styles.experimentValueText}>
              {data.experimentName || ""}
            </Text>
          </View>
        </View>

        {/* Details List */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>STUDENT NAME</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.detailValue}>{data.studentName || ""}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>ROLL NO.</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.detailValue}>{data.rollNo || ""}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>SECTION</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.detailValue}>{data.section || ""}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>SEMESTER</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.detailValue}>{data.semester || ""}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>LEVEL/ TERM</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.detailValue}>{data.levelTerm || ""}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>COURSE NAME</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.detailValue}>{data.courseName || ""}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>DATE OF EXPERIMENT</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.detailValue}>
              {data.dateOfExperiment || "___/___/_______"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>DATE OF SUBMISSION</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.detailValue}>
              {data.dateOfSubmission || "___/___/_______"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>GROUP</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.detailValue}>{data.group || ""}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>REMARKS</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={styles.detailValue}>{data.remarks || ""}</Text>
          </View>
        </View>

        {/* Signature Area */}
        <View style={styles.signatureContainer}>
          <View style={styles.signatureLine}>
            <Text style={styles.signatureText}>SIGNATURE OF TEACHER</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
