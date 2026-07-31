import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Define the exact data shape needed for this specific cover page
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

interface AssignmentCoverProps {
  data: AssignmentData;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingLeft: 70,
    paddingRight: 70,
    fontFamily: "Times-Roman",
    backgroundColor: "#ffffff",
    position: "relative",
  },
  watermarkContainer: {
    position: "absolute",
    top: 340,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.1,
    zIndex: -1,
  },
  watermarkImage: {
    width: 150.62,
    height: 170,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 150.62,
    height: 170,
    marginBottom: 15,
  },
  universityName: {
    fontSize: 16,
    fontFamily: "Times-Bold",
    marginBottom: 8,
    textAlign: "center",
  },
  facultyName: {
    fontSize: 12,
    fontFamily: "Times-Bold",
    marginBottom: 6,
    textAlign: "center",
  },
  departmentName: {
    fontSize: 12,
    marginBottom: 15,
    textAlign: "center",
  },
  ribbonContainer: {
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
  },
  ribbonBox: {
    border: "1px solid black",
    paddingVertical: 8,
    paddingHorizontal: 40,
    // backgroundColor: "#eaf3ea",
    zIndex: 2,
  },
  ribbonText: {
    fontSize: 14,
    fontFamily: "Times-Bold",
  },
  // Simulated ribbon tails using borders
  ribbonTailLeft: {
    position: "absolute",
    left: 80,
    top: 10,
    width: 50,
    height: 15,
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    borderLeft: "1px solid black",
    zIndex: 1,
  },
  ribbonTailRight: {
    position: "absolute",
    right: 80,
    top: 10,
    width: 50,
    height: 15,
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    borderRight: "1px solid black",
    zIndex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    fontSize: 12,
  },
  courseNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
  },
  courseCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "50%",
  },
  courseCodeBoxes: {
    flexDirection: "row",
    marginLeft: 10,
  },
  box: {
    width: 15,
    height: 15,
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    borderLeft: "1px solid black",
    justifyContent: "center",
    alignItems: "center",
  },
  lastBox: {
    borderRight: "1px solid black",
  },
  boxText: {
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  fieldRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-end", // Align text to the bottom line
    fontSize: 12,
  },
  fieldLabel: {
    width: 140, // Fixed width to align colons perfectly
  },
  fieldColon: {
    width: 15,
  },
  fieldValue: {
    flex: 1,
    // borderBottom: "1px solid black",
    // paddingBottom: 2,
    minHeight: 14,
  },
});

export default function AssignmentCover({ data }: AssignmentCoverProps) {
  // Ensure we have exactly 7 boxes for the course code
  const courseCodeArray = (data?.courseCode || "")
    .padEnd(8, " ")
    .split("")
    .slice(0, 8);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Faded Background Logo */}
        <View style={styles.watermarkContainer}>
          <Image src="/bup_logo.png" style={styles.watermarkImage} />
        </View>

        {/* Header Section */}
        <View style={styles.headerSection}>
          <Image src="/bup_logo.png" style={styles.logo} />
          {/* Note: I corrected the typo from the image ("BAGLADESH") to "BANGLADESH" */}
          <Text style={styles.universityName}>
            BANGLADESH UNIVERSITY OF PROFESSIONALS
          </Text>
          <Text style={styles.facultyName}>
            FACULTY OF SCIENCE & TECHNOLOGY
          </Text>
          <Text style={styles.departmentName}>
            DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
          </Text>
        </View>

        {/* Ribbon Title */}
        <View style={styles.ribbonContainer}>
          {/* <View style={styles.ribbonTailLeft} /> */}
          <View style={styles.ribbonBox}>
            <Text style={styles.ribbonText}>ASSIGNMENT</Text>
          </View>
          {/* <View style={styles.ribbonTailRight} /> */}
        </View>

        {/* Top Row: Course Name & Course Code */}
        <View style={styles.topRow}>
          <View style={styles.courseNameContainer}>
            <Text>COURSE NAME: {data?.courseName || ""}</Text>
          </View>
          <View style={styles.courseCodeContainer}>
            <Text>COURSE CODE: </Text>
            <View style={styles.courseCodeBoxes}>
              {courseCodeArray.map((char, index) => (
                <View
                  key={index}
                  style={[styles.box, index === 7 ? styles.lastBox : {}]}
                >
                  {/* ADD THE FALLBACK SPACE HERE */}
                  <Text style={styles.boxText}>{char.trim() || " "}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Details Fields */}
        {[
          { label: "ASSIGNMENT TITLE", value: data?.assignmentTitle },
          {},
          { label: "STUDENT NAME", value: data?.studentName },
          { label: "ID NO.", value: data?.idNo },
          { label: "SECTION", value: data?.section },
          { label: "BATCH", value: data?.batch },
          { label: "SEMESTER", value: data?.semester },
          { label: "LEVEL/TERM", value: data?.levelTerm },
          { label: "DATE OF SUBMISSION", value: data?.dateOfSubmission },
          { label: "REMARKS", value: data?.remarks },
        ].map((field, index) => (
          <View style={styles.fieldRow} key={index}>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <Text style={styles.fieldColon}>{field.label && ": "}</Text>
            <Text style={styles.fieldValue}>{field.value || ""}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
