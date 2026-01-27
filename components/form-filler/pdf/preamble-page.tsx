import React from "react";
import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { styles as commonStyles } from "./styles";

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Times-Roman",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 11,
    marginBottom: 10,
    fontFamily: "Times-Roman",
    fontWeight: "bold",
  },
  text: {
    fontSize: 11,
    marginBottom: 10,
    textAlign: "justify",
    fontFamily: "Times-Roman",
    lineHeight: 1.5,
  },
  tableCaption: {
    fontSize: 11,
    marginTop: 10,
    marginBottom: 5,
    textAlign: "center",
    fontFamily: "Times-Roman",
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    minHeight: 25,
    alignItems: "center",
  },
  lastTableRow: {
    flexDirection: "row",
    minHeight: 25,
    alignItems: "center",
  },
  tableHeader: {
    padding: 5,
    fontSize: 11,
    fontFamily: "Times-Roman",
    textAlign: "center",
  },
  tableCell: {
    padding: 5,
    fontSize: 11,
    fontFamily: "Times-Roman",
    textAlign: "left",
  },
  col1: {
    width: "10%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    height: "100%",
    textAlign: "center",
    justifyContent: "center",
  },
  col2: {
    width: "70%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    height: "100%",
    textAlign: "left",
  },
  col3: {
    width: "20%",
    height: "100%",
    textAlign: "center",
    justifyContent: "center",
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 5,
  },
  bullet: {
    width: 20,
    fontSize: 11,
    fontFamily: "Times-Roman",
    textAlign: "center",
  },
  bulletText: {
    flex: 1,
    fontSize: 11,
    fontFamily: "Times-Roman",
    textAlign: "justify",
    lineHeight: 1.4,
  },
  note: {
    fontSize: 11,
    marginTop: 10,
    textAlign: "justify",
    fontFamily: "Times-Roman",
    lineHeight: 1.4,
  },
  bold: {
    fontWeight: "bold",
    fontFamily: "Times-Roman",
  },
  footer: {
    marginTop: 30,
    fontSize: 11,
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    fontStyle: "italic",
  },
});

export const PreamblePage = () => {
  return (
    <Page size="A4" style={commonStyles.pagePortrait}>
        <Text style={styles.title}>Activity Points for Award of Degree</Text>
        
        <Text style={styles.subtitle}>Preamble:</Text>
        
        <Text style={styles.text}>
          Apart from technical knowledge and skills, to be successful as professional,
          students should have excellent soft skills, leadership qualities and team
          spirit. They should have entrepreneurial capabilities and societal
          commitment. In order to match these multifarious requirement, AICTE has
          created a unique mechanism of awarding Activity points over and above the
          academic grades.
        </Text>

        <Text style={styles.tableCaption}>Table 1: Activity point requirement</Text>

        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableRow}>
            <View style={[styles.col1, { padding: 5 }]}>
                <Text style={styles.tableHeader}>Sl.No.</Text>
            </View>
            <View style={[styles.col2, { padding: 5, textAlign: "center" }]}>
                <Text style={styles.tableHeader}>Student category</Text>
            </View>
            <View style={[styles.col3, { padding: 5 }]}>
                <Text style={styles.tableHeader}>Activity points prescribed by AICTE</Text>
            </View>
          </View>

          {/* Row 1 */}
          <View style={styles.tableRow}>
            <View style={[styles.col1]}>
                <Text style={styles.tableCell}>1</Text>
            </View>
            <View style={[styles.col2, { padding: 5 }]}>
                <Text style={styles.tableCell}>Day college regular student admitted to the 4 years Degree programme</Text>
            </View>
            <View style={[styles.col3]}>
                <Text style={[styles.tableCell, { textAlign: "center" }]}>100</Text>
            </View>
          </View>

          {/* Row 2 */}
          <View style={styles.tableRow}>
            <View style={[styles.col1]}>
                <Text style={styles.tableCell}>2</Text>
            </View>
            <View style={[styles.col2, { padding: 5 }]}>
                <Text style={styles.tableCell}>Student entering 4 years degree programme through lateral entry</Text>
            </View>
            <View style={[styles.col3]}>
                <Text style={[styles.tableCell, { textAlign: "center" }]}>75</Text>
            </View>
          </View>

          {/* Row 3 */}
          <View style={styles.lastTableRow}>
            <View style={[styles.col1]}>
                <Text style={styles.tableCell}>3</Text>
            </View>
            <View style={[styles.col2, { padding: 5 }]}>
                <Text style={styles.tableCell}>Students transferred from other Universities to fifth semester</Text>
            </View>
            <View style={[styles.col3]}>
                <Text style={[styles.tableCell, { textAlign: "center" }]}>50</Text>
            </View>
          </View>
        </View>

        <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
                The Activity Points earned shall be reflected on the students eighth semester Grade card (duration of the programme), anytime during the semester weekends and holidays, as per the interest and convenience of the student from the year of entry to the programme. However, minimum hours specified must be satisfied.
            </Text>
        </View>

        <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
                Activity Points (non-credit) have no effect on SGPA/CGPA and shall not be considered for vertical progression.
            </Text>
        </View>

        <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
                In case students fail to earn the prescribed activity points, Eighth semester Grade Card shall be issued only after earning the required activity points. Students shall be admitted for the award of degree only after the release of the Eighth semester Grade card.
            </Text>
        </View>

        <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
                The consolidated report of activity points earned by the students will be sent to the University. A notification in this respect will be issued by Registrar (Evaluation), VTU, Belagavi.
            </Text>
        </View>

        <Text style={styles.note}>
          <Text style={{ fontStyle: "italic" }}>Note:</Text> A <Text style={{ fontWeight: "bold" }}>one-page report for every 5 activity points</Text> is <Text style={{ fontWeight: "bold" }}>mandatory</Text>.
          Students must also attach <Text style={{ fontWeight: "bold" }}>valid certificates or duly authorized signed letters</Text> from NCC/NSS/Rotaract/CAT as proof. The <Text style={{ fontWeight: "bold" }}>authenticity and originality</Text> of these documents must be verified by the respective Faculty Counsellors.
        </Text>

        <Text style={styles.footer}>From: Dean Student Affairs, RVCE</Text>
    </Page>
  );
};
