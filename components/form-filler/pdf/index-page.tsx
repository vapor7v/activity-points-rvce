import { Page, View, Text } from "@react-pdf/renderer";
import { FormFillerData, Activity } from "@/lib/types/form-filler";
import { styles, INDEX_ROWS_PER_PAGE } from "./styles";
import { Header, Footer } from "./common";
import { formatDateRange, chunkArray } from "./utils";

interface IndexPagesProps {
  activities: Activity[];
  student: FormFillerData["student"];
}

export const IndexPages = ({ activities, student }: IndexPagesProps) => {
  const activityPages = chunkArray(activities, INDEX_ROWS_PER_PAGE);

  return activityPages.map((pageActivities, pageIndex) => {
    const isFirstPage = pageIndex === 0;
    const isLastPage = pageIndex === activityPages.length - 1;
    const startIndex = pageIndex * INDEX_ROWS_PER_PAGE;

    return (
      <Page
        key={`index-${pageIndex}`}
        size="A4"
        orientation="landscape"
        style={styles.pageLandscape}
      >
        {isFirstPage && <Header />}

        {isFirstPage && (
          <>
            <Text style={styles.sectionTitle}>AICTE-Activity Book</Text>
            <View style={styles.studentInfoLine}>
              <Text>
                <Text style={{ fontWeight: "bold" }}>Name:</Text>{" "}
                {student.name || "Student Name"}
              </Text>
              <Text>
                <Text style={{ fontWeight: "bold" }}>USN:</Text>{" "}
                {student.usn || "USN"}
              </Text>
            </View>
            <Text style={styles.subsectionTitle}>Index sheet</Text>
          </>
        )}

        <View style={styles.table}>
          {isFirstPage && (
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: "5%" }]}>Sl. No</Text>
              <Text style={[styles.tableCell, { width: "8%" }]}>Semester</Text>
              <Text style={[styles.tableCell, { width: "18%" }]}>
                Name of the Activity
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                Map to AICTE Activity
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                Date (from & to) duration
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                Place where activity was carried
              </Text>
              <Text style={[styles.tableCell, { width: "8%" }]}>
                Detailed report Page No
              </Text>
              <Text style={[styles.tableCell, { width: "10%" }]}>
                Certificate / Proof Attached (Y/N)
              </Text>
              <Text style={[styles.tableCell, { width: "7%" }]}>
                Points attained
              </Text>
              <Text style={[styles.tableCellLast, { width: "8%" }]}>
                Signature of the counsellor
              </Text>
            </View>
          )}

          {pageActivities.length > 0 ? (
            pageActivities.map((activity, idx) => (
              <View key={activity.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "5%" }]}>
                  {startIndex + idx + 1}
                </Text>
                <Text style={[styles.tableCell, { width: "8%" }]}>
                  {activity.semester}
                </Text>
                <Text style={[styles.tableCell, { width: "18%" }]}>
                  {activity.name}
                </Text>
                <Text style={[styles.tableCell, { width: "12%" }]}>
                  {activity.aicteMapping}
                </Text>
                <Text style={[styles.tableCell, { width: "12%" }]}>
                  {formatDateRange(activity)}
                </Text>
                <Text style={[styles.tableCell, { width: "12%" }]}>
                  {activity.place}
                </Text>
                <Text style={[styles.tableCell, { width: "8%" }]}>
                  {activity.detailedReportPageNo || ""}
                </Text>
                <Text style={[styles.tableCell, { width: "10%" }]}>
                  {activity.certificateAttached ? "Y" : "N"}
                </Text>
                <Text style={[styles.tableCell, { width: "7%" }]}>
                  {activity.pointsEarned}
                </Text>
                <Text style={[styles.tableCellLast, { width: "8%" }]}></Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCell,
                  { width: "100%", color: "#999", fontStyle: "italic" },
                ]}
              >
                No activities added
              </Text>
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
              <Text style={styles.signatureLabel}>
                Signature of NCC/NSS officer/DSA/Dean CAT
              </Text>
            </View>
          </View>
        )}

        <Footer />
      </Page>
    );
  });
};
