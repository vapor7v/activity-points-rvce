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
    textAlign: "left",
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
    alignItems: "stretch", 
  },
  lastTableRow: {
    flexDirection: "row",
    minHeight: 25,
    alignItems: "stretch",
  },
  tableHeader: {
    padding: 2,
    fontSize: 10, 
    fontFamily: "Times-Roman",
    textAlign: "center",
    fontWeight: "bold",
  },
  tableCell: {
    padding: 3,
    fontSize: 10,
    fontFamily: "Times-Roman",
    textAlign: "left",
  },
  col1: {
    width: "10%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "center",
    justifyContent: "center",
  },
  col2: {
    width: "70%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "center",
    justifyContent: "center",
  },
  col3: {
    width: "20%",
    textAlign: "center",
    justifyContent: "center",
  },
  t2Col1: {
    width: "8%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "center",
    justifyContent: "center",
  },
  t2Col2: {
    width: "52%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    justifyContent: "center",
  },
  t2Col34Group: {
    width: "22%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    flexDirection: 'column',
  },
  t2Col3: {
    width: "11%",
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "center",
    justifyContent: "center",
  },
  t2Col4: {
    width: "11%", 
    borderRightWidth: 1,
    borderRightColor: "#000",
    textAlign: "center",
    justifyContent: "center",
  },
  t2Col5: {
    width: "18%",
    textAlign: "center",
    justifyContent: "center",
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 5,
    paddingLeft: 10, 
    paddingRight: 10,
  },
  bullet: {
    width: 15,
    fontSize: 16,
    fontFamily: "Times-Roman",
    textAlign: "center",
    marginTop: -2,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    fontFamily: "Times-Roman",
    textAlign: "justify",
    lineHeight: 1.4,
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    fontFamily: "Times-Roman",
    textAlign: 'left',
  },
});

const activities = [
  "Helping local schools to achieve good result and enhance their enrolment in Higher/technical/ vocational education.",
  "Preparing an actionable business proposal for enhancing the village income.",
  "Developing Sustainable Water management system.",
  "Tourism approaches through innovative approaches.",
  "Promotion of appropriate technologies.",
  "Reduction in energy consumption.",
  "To skill rural population.",
  "Facilitating 100% digitized money transactions.",
  "Setting of the information imparting club for women leading to contribution in social and economic issues.",
  "Developing and managing efficient garbage disposable system.",
  "To assist the marketing of rural produce.",
  "Food preservation/ packaging.",
  "Automation of local activities.",
  "Spreading public awareness under rural outreach program.",
  "Contribution to any national level initiative of Government of India. For eg. Digital India, Skill India, Swachh Bharat Internship etc."
];

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
          <View style={styles.tableRow}>
            <View style={styles.col1}>
                <Text style={styles.tableHeader}>Sl.No.</Text>
            </View>
            <View style={styles.col2}>
                <Text style={styles.tableHeader}>Student category</Text>
            </View>
            <View style={styles.col3}>
                <Text style={styles.tableHeader}>Activity points prescribed by AICTE</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.col1}>
                <Text style={styles.tableCell}>1</Text>
            </View>
            <View style={[styles.col2, { alignItems: 'flex-start', paddingLeft: 5 }]}>
                <Text style={styles.tableCell}>Day college regular student admitted to the 4 years Degree programme</Text>
            </View>
            <View style={styles.col3}>
                <Text style={styles.tableCell}>100</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.col1}>
                <Text style={styles.tableCell}>2</Text>
            </View>
            <View style={[styles.col2, { alignItems: 'flex-start', paddingLeft: 5 }]}>
                <Text style={styles.tableCell}>Student entering 4 years degree programme through lateral entry</Text>
            </View>
            <View style={styles.col3}>
                <Text style={styles.tableCell}>75</Text>
            </View>
          </View>

          <View style={styles.lastTableRow}>
            <View style={styles.col1}>
                <Text style={styles.tableCell}>3</Text>
            </View>
            <View style={[styles.col2, { alignItems: 'flex-start', paddingLeft: 5 }]}>
                <Text style={styles.tableCell}>Students transferred from other Universities to fifth semester</Text>
            </View>
            <View style={styles.col3}>
                <Text style={styles.tableCell}>50</Text>
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

        <Text style={[styles.tableCaption, { marginTop: 15 }]}>Table 2: Following suggestive activities may be carried out by students in teams as per their choice:</Text>
        
        <View style={styles.table}>
            <View style={[styles.tableRow, { height: 40 }]}>
                 <View style={styles.t2Col1}>
                    <Text style={styles.tableHeader}>Sl. No</Text>
                 </View>
                 <View style={styles.t2Col2}>
                    <Text style={styles.tableHeader}>Activity Head</Text>
                 </View>
                 
                 <View style={styles.t2Col34Group}>
                     <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', height: '50%', justifyContent: 'center' }}>
                         <Text style={styles.tableHeader}>Minimum duration</Text>
                     </View>
                     <View style={{ flexDirection: 'row', height: '50%' }}>
                         <View style={{ width: '50%', borderRightWidth: 1, borderRightColor: '#000', justifyContent: 'center' }}>
                             <Text style={styles.tableHeader}>Weeks</Text>
                         </View>
                         <View style={{ width: '50%', justifyContent: 'center' }}>
                             <Text style={styles.tableHeader}>Hours</Text>
                         </View>
                     </View>
                 </View>

                 <View style={styles.t2Col5}>
                    <Text style={styles.tableHeader}>Performance appraisal/Maximum points/activity</Text>
                 </View>
            </View>

            {activities.map((activity, index) => (
                <View style={index === activities.length - 1 ? styles.lastTableRow : styles.tableRow} key={index}>
                    <View style={styles.t2Col1}>
                        <Text style={styles.tableCell}>{index + 1}.</Text>
                    </View>
                    <View style={[styles.t2Col2, { padding: 4 }]}>
                        <Text style={styles.tableCell}>{activity}</Text>
                    </View>
                     <View style={styles.t2Col3}>
                        <Text style={styles.tableCell}>2</Text>
                     </View>
                     <View style={styles.t2Col4}>
                        <Text style={styles.tableCell}>80-90</Text>
                     </View>
                    <View style={styles.t2Col5}>
                        <Text style={styles.tableCell}>20</Text>
                    </View>
                </View>
            ))}
        </View>

        <Text style={styles.footer}>
            Evaluated by NSS/youth Red cross Co-ordinators/Chair person-CICC(College Internal complaints committee)/SAGY(Sansad Adarsh Gram yojana, Govt. of India) of the institute/ Mentor
        </Text>
    </Page>
  );
};
