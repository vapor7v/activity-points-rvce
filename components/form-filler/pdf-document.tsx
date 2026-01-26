"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { FormFillerData, Activity } from "@/lib/types/form-filler";
import { format, parseISO } from "date-fns";

// Register Inter font for header/footer from local files
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "/fonts/inter/Inter-roman.ttf",
      fontWeight: 400,
    },
    {
      src: "/fonts/inter/Inter-italic.ttf",
      fontWeight: 400,
      fontStyle: "italic",
    },
    {
      src: "/fonts/inter/Inter-roman.ttf",
      fontWeight: 600,
    },
    {
      src: "/fonts/inter/Inter-roman.ttf",
      fontWeight: 700,
    },
  ],
});

// Register Arial font for header/footer from local files
Font.register({
  family: "Arial",
  fonts: [
    {
      src: "/fonts/arial/arial.ttf",
      fontWeight: 400,
    },
    {
      src: "/fonts/arial/G_ari_bd.TTF",
      fontWeight: 700,
    },
    {
      src: "/fonts/arial/G_ari_i.TTF",
      fontWeight: 400,
      fontStyle: "italic",
    },
  ],
});

// Constants for pagination
const INDEX_ROWS_PER_PAGE = 10;
const EVALUATION_ROWS_PER_PAGE = 10;

// PDF Styles - using Times-Roman for body, Inter for header/footer
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Times-Roman",
    fontSize: 11,
    color: "#000",
  },
  pagePortrait: {
    padding: 40,
    fontFamily: "Times-Roman",
    fontSize: 11,
    color: "#000",
  },
  pageLandscape: {
    padding: 30,
    fontFamily: "Times-Roman",
    fontSize: 10,
    color: "#000",
  },
  // Header styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: "#1e3a5f",
    fontFamily: "Arial",
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 60,
    height: 60,
  },
  collegeInfo: {
    flexDirection: "column",
  },
  collegeName: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1e3a5f",
    fontFamily: "Arial",
    letterSpacing: 0.3,
  },
  collegeAddress: {
    fontSize: 9,
    color: "#1e3a5f",
    fontFamily: "Arial",
    marginTop: 2,
  },
  contactInfo: {
    textAlign: "right",
    fontSize: 9,
    color: "#1e3a5f",
    fontFamily: "Arial",
    lineHeight: 1.4,
  },
  // Footer styles
  footer: {
    position: "absolute",
    bottom: 25,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1.5,
    borderTopColor: "#1e3a5f",
    fontFamily: "Arial",
  },
  trustName: {
    fontSize: 10,
    fontWeight: 600,
    color: "#1e3a5f",
    fontFamily: "Arial",
  },
  motto: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#1e3a5f",
    fontFamily: "Arial",
  },
  // Certificate styles
  certificateContent: {
    marginTop: 60,
    alignItems: "center",
  },
  certificateTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e3a5f",
    textDecoration: "underline",
    marginBottom: 40,
  },
  certificateText: {
    fontSize: 13,
    lineHeight: 2,
    textAlign: "justify",
    maxWidth: "90%",
    paddingHorizontal: 20,
  },
  signatureSection: {
    position: "absolute",
    bottom: 120,
    left: 40,
    right: 40,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  signatureBlock: {
    width: "45%",
    alignItems: "center",
  },
  signatureLine: {
    width: 150,
    height: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 10,
  },
  // Section titles
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  subsectionTitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
  },
  studentInfoLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    fontSize: 11,
  },
  // Table styles
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableHeader: {
    backgroundColor: "transparent",
    fontWeight: "bold",
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "center",
    fontSize: 9,
  },
  tableCellLast: {
    padding: 5,
    textAlign: "center",
    fontSize: 9,
  },
  // Signature sections
  hodSignatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingHorizontal: 30,
  },
  evaluatorSignatureSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },
  // Activity detail
  activityTable: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
  },
  activityRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    minHeight: 30,
  },
  activityLabel: {
    width: 120,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#000",
    fontSize: 10,
  },
  activityValue: {
    flex: 1,
    padding: 8,
    fontSize: 10,
  },
  descriptionCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    minHeight: 200,
  },
  photosCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    minHeight: 80,
    color: "#999",
    fontStyle: "italic",
  },
  outcomeCell: {
    flex: 1,
    padding: 8,
    fontSize: 10,
    minHeight: 100,
  },
  certificateNote: {
    marginTop: 15,
    fontSize: 10,
    fontStyle: "italic",
  },
});

// Helper to format date range string
const formatDateRange = (activity: Activity) => {
  if (!activity.startDate || !activity.endDate) return "";
  try {
    const start = format(parseISO(activity.startDate), "dd-MM-yy");
    const end = format(parseISO(activity.endDate), "dd-MM-yy");
    const days = activity.duration || 0;
    return `${start} to ${end}, ${days} day${days > 1 ? "s" : ""}`;
  } catch (e) {
    return "";
  }
};

// Helper function to chunk array
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks.length > 0 ? chunks : [[]];
}

// Header Component
const Header = () => (
  <View style={styles.header}>
    <View style={styles.logoSection}>
      <Image src="/rvce-logo.png" style={styles.logo} />
      <View style={styles.collegeInfo}>
        <Text style={styles.collegeName}>RV College of Engineering®</Text>
        <Text style={styles.collegeAddress}>Mysore Road, RV Vidyaniketan Post,</Text>
        <Text style={styles.collegeAddress}>Bengaluru - 560059, Karnataka, India</Text>
      </View>
    </View>
    <View style={styles.contactInfo}>
      <Text>principal@rvce.edu.in</Text>
      <Text>www.rvce.edu.in</Text>
      <Text>Tel: +91-80-68188110</Text>
      <Text>+91-80-68188111</Text>
      <Text>+91-80-68188112</Text>
    </View>
  </View>
);

// Footer Component
const Footer = () => (
  <View style={styles.footer} fixed>
    <Text style={styles.trustName}>Rashtreeya Sikshana Samithi Trust®</Text>
    <Text style={styles.motto}>Go, change the world®</Text>
  </View>
);

interface PDFDocumentProps {
  data: FormFillerData;
}

export const PDFDocumentTemplate = ({ data }: PDFDocumentProps) => {
  const { student, activities, evaluations } = data;
  const activityPages = chunkArray(activities, INDEX_ROWS_PER_PAGE);
  const evaluationPages = chunkArray(evaluations, EVALUATION_ROWS_PER_PAGE);

  return (
    <Document>
      {/* Certificate Page - Portrait */}
      <Page size="A4" orientation="portrait" style={styles.pagePortrait}>
        <Header />
        <View style={styles.certificateContent}>
          <Text style={styles.certificateTitle}>CERTIFICATE</Text>
          <Text style={styles.certificateText}>
            This is to certify that{" "}
            <Text style={{ fontWeight: "bold" }}>{student.name || "Student name"}</Text> bearing USN{" "}
            <Text style={{ fontWeight: "bold" }}>{student.usn || "USN"}</Text> from the department of{" "}
            <Text style={{ fontWeight: "bold" }}>{student.department || "Computer Science & Engineering"}</Text> has satisfactorily completed{" "}
            <Text style={{ fontWeight: "bold" }}>{student.totalPoints}</Text> Activity Points prescribed by AICTE for BE Graduate Programme during the period{" "}
            <Text style={{ fontWeight: "bold" }}>{student.period}</Text>.
          </Text>
        </View>
        <View style={styles.signatureSection}>
          <View style={styles.signatureRow}>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Signature of Student</Text>
            </View>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Signature of Faculty Counsellor</Text>
            </View>
          </View>
          <View style={styles.signatureRow}>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Signature of Dean Student Affairs</Text>
            </View>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Signature of Principal</Text>
            </View>
          </View>
        </View>
        <Footer />
      </Page>

      {/* Index Sheet Pages - Landscape */}
      {activityPages.map((pageActivities, pageIndex) => {
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === activityPages.length - 1;
        const startIndex = pageIndex * INDEX_ROWS_PER_PAGE;

        return (
          <Page key={`index-${pageIndex}`} size="A4" orientation="landscape" style={styles.pageLandscape}>
            {isFirstPage && <Header />}
            
            {isFirstPage && (
              <>
                <Text style={styles.sectionTitle}>AICTE-Activity Book</Text>
                <View style={styles.studentInfoLine}>
                  <Text><Text style={{ fontWeight: "bold" }}>Name:</Text> {student.name || "Student Name"}</Text>
                  <Text><Text style={{ fontWeight: "bold" }}>USN:</Text> {student.usn || "USN"}</Text>
                </View>
                <Text style={styles.subsectionTitle}>Index sheet</Text>
              </>
            )}

            <View style={styles.table}>
              {/* Header row - only on first page */}
              {isFirstPage && (
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, { width: "5%" }]}>Sl. No</Text>
                  <Text style={[styles.tableCell, { width: "8%" }]}>Semester</Text>
                  <Text style={[styles.tableCell, { width: "18%" }]}>Name of the Activity</Text>
                  <Text style={[styles.tableCell, { width: "12%" }]}>Map to AICTE Activity</Text>
                  <Text style={[styles.tableCell, { width: "12%" }]}>Date (from & to) duration</Text>
                  <Text style={[styles.tableCell, { width: "12%" }]}>Place where activity was carried</Text>
                  <Text style={[styles.tableCell, { width: "8%" }]}>Detailed report Page No</Text>
                  <Text style={[styles.tableCell, { width: "10%" }]}>Certificate / Proof Attached (Y/N)</Text>
                  <Text style={[styles.tableCell, { width: "7%" }]}>Points attained</Text>
                  <Text style={[styles.tableCellLast, { width: "8%" }]}>Signature of the counsellor</Text>
                </View>
              )}
              {/* Data rows */}
              {pageActivities.length > 0 ? (
                pageActivities.map((activity, idx) => (
                  <View key={activity.id} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: "5%" }]}>{startIndex + idx + 1}</Text>
                    <Text style={[styles.tableCell, { width: "8%" }]}>{activity.semester}</Text>
                    <Text style={[styles.tableCell, { width: "18%" }]}>{activity.name}</Text>
                    <Text style={[styles.tableCell, { width: "12%" }]}>{activity.aicteMapping}</Text>
                    <Text style={[styles.tableCell, { width: "12%" }]}>{formatDateRange(activity)}</Text>
                    <Text style={[styles.tableCell, { width: "12%" }]}>{activity.place}</Text>
                    <Text style={[styles.tableCell, { width: "8%" }]}>{startIndex + idx + 1}</Text>
                    <Text style={[styles.tableCell, { width: "10%" }]}>{activity.certificateAttached ? "Y" : "N"}</Text>
                    <Text style={[styles.tableCell, { width: "7%" }]}>{activity.pointsEarned}</Text>
                    <Text style={[styles.tableCellLast, { width: "8%" }]}></Text>
                  </View>
                ))
              ) : (
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: "100%", color: "#999", fontStyle: "italic" }]}>No activities added</Text>
                </View>
              )}
            </View>

            {isLastPage && (
              <View style={styles.hodSignatureSection}>
                <View style={styles.signatureBlock}>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureLabel}>Signature of HoD</Text>
                </View>
                <View style={styles.signatureBlock}>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureLabel}>Signature of NCC/NSS officer/DSA/Dean CAT</Text>
                </View>
              </View>
            )}

            <Footer />
          </Page>
        );
      })}

      {/* Evaluation Sheet Pages - Landscape */}
      {evaluationPages.map((pageEvaluations, pageIndex) => {
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === evaluationPages.length - 1;
        const startIndex = pageIndex * EVALUATION_ROWS_PER_PAGE;

        return (
          <Page key={`eval-${pageIndex}`} size="A4" orientation="landscape" style={styles.pageLandscape}>
            {isFirstPage && <Header />}
            {isFirstPage && <Text style={styles.sectionTitle}>EVALUATION SHEET</Text>}

            <View style={styles.table}>
              {isFirstPage && (
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={[styles.tableCell, { width: "6%" }]}>Sl. No</Text>
                  <Text style={[styles.tableCell, { width: "18%" }]}>Name of Student</Text>
                  <Text style={[styles.tableCell, { width: "14%" }]}>USN</Text>
                  <Text style={[styles.tableCell, { width: "18%" }]}>Type of work carried</Text>
                  <Text style={[styles.tableCell, { width: "12%" }]}>Duration</Text>
                  <Text style={[styles.tableCell, { width: "10%" }]}>Number of hours spent</Text>
                  <Text style={[styles.tableCell, { width: "12%" }]}>Availability of Certificate (Y/N)</Text>
                  <Text style={[styles.tableCellLast, { width: "10%" }]}>Points earned</Text>
                </View>
              )}
              {pageEvaluations.length > 0 ? (
                pageEvaluations.map((evaluation, idx) => (
                  <View key={startIndex + idx} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { width: "6%" }]}>{startIndex + idx + 1}</Text>
                    <Text style={[styles.tableCell, { width: "18%" }]}>{evaluation.nameOfStudent}</Text>
                    <Text style={[styles.tableCell, { width: "14%" }]}>{evaluation.usn}</Text>
                    <Text style={[styles.tableCell, { width: "18%" }]}>{evaluation.typeOfWork}</Text>
                    <Text style={[styles.tableCell, { width: "12%" }]}>{evaluation.duration}</Text>
                    <Text style={[styles.tableCell, { width: "10%" }]}>{evaluation.hoursSpent || ""}</Text>
                    <Text style={[styles.tableCell, { width: "12%" }]}>{evaluation.certificateAvailable ? "Y" : "N"}</Text>
                    <Text style={[styles.tableCellLast, { width: "10%" }]}>{evaluation.pointsEarned}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: "6%" }]}>1</Text>
                  <Text style={[styles.tableCell, { width: "18%" }]}></Text>
                  <Text style={[styles.tableCell, { width: "14%" }]}></Text>
                  <Text style={[styles.tableCell, { width: "18%" }]}></Text>
                  <Text style={[styles.tableCell, { width: "12%" }]}></Text>
                  <Text style={[styles.tableCell, { width: "10%" }]}></Text>
                  <Text style={[styles.tableCell, { width: "12%" }]}></Text>
                  <Text style={[styles.tableCellLast, { width: "10%" }]}></Text>
                </View>
              )}
            </View>

            {isLastPage && (
              <View style={styles.evaluatorSignatureSection}>
                <View style={styles.signatureBlock}>
                  <Text style={{ fontWeight: "bold", marginBottom: 3 }}>
                    {data.signatories?.evaluator1?.name ||
                      "Name of Evaluator 1"}
                  </Text>
                  <Text style={{ marginBottom: 3 }}>
                    {data.signatories?.evaluator1?.designation ||
                      "Designation"}
                  </Text>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureLabel}>Signature</Text>
                </View>
                <View style={styles.signatureBlock}>
                  <Text style={{ fontWeight: "bold", marginBottom: 3 }}>
                    {data.signatories?.evaluator2?.name ||
                      "Name of Evaluator 2"}
                  </Text>
                  <Text style={{ marginBottom: 3 }}>
                    {data.signatories?.evaluator2?.designation ||
                      "Designation"}
                  </Text>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureLabel}>Signature</Text>
                </View>
                <View style={styles.signatureBlock}>
                  <Text style={{ fontWeight: "bold", marginBottom: 3 }}>
                    {data.signatories?.counsellor?.name ||
                      "Name of Counsellor"}
                  </Text>
                  <Text style={{ marginBottom: 3 }}>
                    {data.signatories?.counsellor?.designation ||
                      "Designation"}
                  </Text>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureLabel}>Signature</Text>
                </View>
              </View>
            )}

            <Footer />
          </Page>
        );
      })}

      {/* Activity Detail Pages - Portrait */}
      {activities.map((activity, index) => (
        <Page key={activity.id} size="A4" orientation="portrait" style={styles.pagePortrait}>
          <View style={styles.activityTable}>
            <View style={styles.activityRow}>
              <Text style={styles.activityLabel}>Sl. No.</Text>
              <Text style={styles.activityValue}>{index + 1}</Text>
            </View>
            <View style={styles.activityRow}>
              <Text style={styles.activityLabel}>Date & Duration</Text>
              <Text style={styles.activityValue}>{formatDateRange(activity)}</Text>
            </View>
            <View style={styles.activityRow}>
              <Text style={styles.activityLabel}>Activity Name</Text>
              <Text style={styles.activityValue}>{activity.name}</Text>
            </View>
            <View style={styles.activityRow}>
              <Text style={styles.activityLabel}>Description of the activity</Text>
              <Text style={styles.descriptionCell}>{activity.description}</Text>
            </View>
            <View style={styles.activityRow}>
              <Text style={styles.activityLabel}>Photos</Text>
              <Text style={styles.photosCell}>[Attach photos here]</Text>
            </View>
            <View style={styles.activityRow}>
              <Text style={styles.activityLabel}>Outcome</Text>
              <Text style={styles.outcomeCell}>{activity.outcomes}</Text>
            </View>
            <View style={[styles.activityRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.activityLabel}>Points earned</Text>
              <Text style={styles.activityValue}>{activity.pointsEarned}</Text>
            </View>
          </View>
          <Text style={styles.certificateNote}>&lt;attach certificate by taking from user&gt;</Text>
        </Page>
      ))}
    </Document>
  );
};

export default PDFDocumentTemplate;
