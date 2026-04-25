import { Page, View, Text } from "@react-pdf/renderer";
import { FormFillerData, EvaluationEntry } from "@/lib/types/form-filler";
import { styles } from "./styles";
import { Header, Footer } from "./common";

interface EvaluationPagesProps {
  evaluations: EvaluationEntry[];
  signatories: FormFillerData["signatories"];
}

const EvalTableHeader = () => (
  <View style={[styles.tableRow, styles.tableHeader]} wrap={false}>
    <Text style={[styles.tableCell, { width: "6%" }]}>Sl. No</Text>
    <Text style={[styles.tableCell, { width: "18%" }]}>
      Name of Student
    </Text>
    <Text style={[styles.tableCell, { width: "14%" }]}>USN</Text>
    <Text style={[styles.tableCell, { width: "18%" }]}>
      Type of work carried
    </Text>
    <Text style={[styles.tableCell, { width: "12%" }]}>Duration</Text>
    <Text style={[styles.tableCell, { width: "10%" }]}>
      Number of hours spent
    </Text>
    <Text style={[styles.tableCell, { width: "12%" }]}>
      Availability of Certificate (Y/N)
    </Text>
    <Text style={[styles.tableCellLast, { width: "10%" }]}>
      Points earned
    </Text>
  </View>
);

export const EvaluationPages = ({
  evaluations,
  signatories,
}: EvaluationPagesProps) => {
  return (
    <Page
      size="A4"
      orientation="landscape"
      style={styles.pageLandscape}
      wrap={true}
    >
      <Header />
      <Text style={styles.sectionTitle}>EVALUATION SHEET</Text>

      <View style={styles.table}>
        <EvalTableHeader />

        {evaluations.length > 0 ? (
          evaluations.map((evaluation, idx) => (
            <View key={idx} style={styles.tableRow} wrap={false}>
              <Text style={[styles.tableCell, { width: "6%" }]}>
                {idx + 1}
              </Text>
              <Text style={[styles.tableCell, { width: "18%" }]}>
                {evaluation.nameOfStudent}
              </Text>
              <Text style={[styles.tableCell, { width: "14%" }]}>
                {evaluation.usn}
              </Text>
              <Text style={[styles.tableCell, { width: "18%" }]}>
                {evaluation.typeOfWork}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {evaluation.duration}
              </Text>
              <Text style={[styles.tableCell, { width: "10%" }]}>
                {evaluation.hoursSpent || ""}
              </Text>
              <Text style={[styles.tableCell, { width: "12%" }]}>
                {evaluation.certificateAvailable ? "Y" : "N"}
              </Text>
              <Text style={[styles.tableCellLast, { width: "10%" }]}>
                {evaluation.pointsEarned}
              </Text>
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

      <View style={styles.evaluatorSignatureSection}>
        <View style={styles.signatureBlock}>
          <Text style={{ fontWeight: "bold", marginBottom: 3 }}>
            {signatories?.evaluator1?.name || "Name of Evaluator 1"}
          </Text>
          <Text style={{ marginBottom: 3 }}>
            {signatories?.evaluator1?.designation || "Designation"}
          </Text>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>Signature</Text>
        </View>
        <View style={styles.signatureBlock}>
          <Text style={{ fontWeight: "bold", marginBottom: 3 }}>
            {signatories?.evaluator2?.name || "Name of Evaluator 2"}
          </Text>
          <Text style={{ marginBottom: 3 }}>
            {signatories?.evaluator2?.designation || "Designation"}
          </Text>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>Signature</Text>
        </View>
        <View style={styles.signatureBlock}>
          <Text style={{ fontWeight: "bold", marginBottom: 3 }}>
            {signatories?.counsellor?.name || "Name of Counsellor"}
          </Text>
          <Text style={{ marginBottom: 3 }}>
            {signatories?.counsellor?.designation || "Designation"}
          </Text>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>Signature</Text>
        </View>
      </View>

      <Footer />
    </Page>
  );
};
