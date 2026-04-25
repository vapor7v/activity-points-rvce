import { Page, View, Text } from "@react-pdf/renderer";
import { FormFillerData, EvaluationEntry } from "@/lib/types/form-filler";
import { styles, EVALUATION_ROWS_PER_PAGE } from "./styles";
import { Header, Footer } from "./common";
import { chunkArray } from "./utils";

interface EvaluationPagesProps {
  evaluations: EvaluationEntry[];
  signatories: FormFillerData["signatories"];
}

const EvalTableHeader = () => (
  <View style={[styles.tableRow, styles.tableHeader]}>
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
  const evaluationPages = chunkArray(evaluations, EVALUATION_ROWS_PER_PAGE);

  return evaluationPages.map((pageEvaluations, pageIndex) => {
    const isFirstPage = pageIndex === 0;
    const isLastPage = pageIndex === evaluationPages.length - 1;
    const startIndex = pageIndex * EVALUATION_ROWS_PER_PAGE;

    return (
      <Page
        key={`eval-${pageIndex}`}
        size="A4"
        orientation="landscape"
        style={styles.pageLandscape}
      >
        {isFirstPage && <Header />}
        {isFirstPage && (
          <Text style={styles.sectionTitle}>EVALUATION SHEET</Text>
        )}

        <View style={styles.table}>
          <EvalTableHeader />

          {pageEvaluations.length > 0 ? (
            pageEvaluations.map((evaluation, idx) => (
              <View key={startIndex + idx} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "6%" }]}>
                  {startIndex + idx + 1}
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

        {isLastPage && (
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
        )}

        <Footer />
      </Page>
    );
  });
};
