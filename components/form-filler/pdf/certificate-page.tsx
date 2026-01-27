import { Page, View, Text } from "@react-pdf/renderer";
import { FormFillerData } from "@/lib/types/form-filler";
import { styles } from "./styles";
import { Header, Footer } from "./common";

export const CertificatePage = ({ data }: { data: FormFillerData }) => (
  <Page size="A4" orientation="portrait" style={styles.pagePortrait}>
    <Header />
    <View style={styles.certificateContent}>
      <Text style={styles.certificateTitle}>CERTIFICATE</Text>
      <Text style={styles.certificateText}>
        This is to certify that{" "}
        <Text style={{ fontWeight: "bold" }}>
          {data.student.name || "Student name"}
        </Text>{" "}
        bearing USN{" "}
        <Text style={{ fontWeight: "bold" }}>
          {data.student.usn || "USN"}
        </Text>{" "}
        from the department of{" "}
        <Text style={{ fontWeight: "bold" }}>
          {data.student.department || "Computer Science & Engineering"}
        </Text>{" "}
        has satisfactorily completed{" "}
        <Text style={{ fontWeight: "bold" }}>{data.student.totalPoints}</Text>{" "}
        Activity Points prescribed by AICTE for BE Graduate Programme during the
        period{" "}
        <Text style={{ fontWeight: "bold" }}>{data.student.period}</Text>.
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
          <Text style={styles.signatureLabel}>
            Signature of Faculty Counsellor
          </Text>
        </View>
      </View>
      <View style={styles.signatureRow}>
        <View style={styles.signatureBlock}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>
            Signature of Dean Student Affairs
          </Text>
        </View>
        <View style={styles.signatureBlock}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>Signature of Principal</Text>
        </View>
      </View>
    </View>
    <Footer />
  </Page>
);
