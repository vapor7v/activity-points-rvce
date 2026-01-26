"use client";

import { FormFillerData, Activity, EvaluationEntry } from "@/lib/types/form-filler";
import "./print-styles.css";

interface PrintDocumentProps {
  data: FormFillerData;
}

// Constants for pagination - max rows per page before overflow
const INDEX_ROWS_PER_PAGE = 7;
const EVALUATION_ROWS_PER_PAGE = 8;

// Helper to chunk arrays for pagination
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks.length > 0 ? chunks : [[]]; // Return at least one empty chunk
}

// Header Component
function PageHeader({ showLogo = true }: { showLogo?: boolean }) {
  return (
    <header className="page-header">
      {showLogo && (
        <div className="logo-section">
          <img
            src="/rvce-logo.png"
            alt="RVCE Logo"
            className="college-logo"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="college-info">
            <h1>RV College of Engineering®</h1>
            <p>Mysore Road, RV Vidyaniketan Post,</p>
            <p>Bengaluru - 560059, Karnataka, India</p>
          </div>
        </div>
      )}
      <div className={showLogo ? "contact-info" : "contact-info-right"}>
        <p>principal@rvce.edu.in</p>
        <p>www.rvce.edu.in</p>
        <p>Tel: +91-80-68188110</p>
        <p>+91-80-68188111</p>
        <p>+91-80-68188112</p>
      </div>
    </header>
  );
}

// Footer Component
function PageFooter() {
  return (
    <footer className="page-footer">
      <p className="trust-name">Rashtreeya Sikshana Samithi Trust®</p>
      <p className="motto">Go, change the world®</p>
    </footer>
  );
}

export function PrintDocument({ data }: PrintDocumentProps) {
  const { student, activities, evaluations } = data;

  // Paginate activities and evaluations
  const activityPages = chunkArray(activities, INDEX_ROWS_PER_PAGE);
  const evaluationPages = chunkArray(evaluations, EVALUATION_ROWS_PER_PAGE);

  return (
    <div className="print-document">
      {/* Page 1: Certificate (Portrait) */}
      <div className="page portrait certificate-page">
        <PageHeader />

        <div className="certificate-content">
          <h2 className="certificate-title">CERTIFICATE</h2>
          <p className="certificate-text">
            This is to certify that{" "}
            <strong>{student.name || "Student name"}</strong> bearing USN{" "}
            <strong>{student.usn || "USN"}</strong> from the department of{" "}
            <strong>{student.department || "Computer Science & Engineering"}</strong>{" "}
            has satisfactorily completed{" "}
            <strong>{student.totalPoints}</strong> Activity Points prescribed by
            AICTE for BE Graduate Programme during the period{" "}
            <strong>{student.period}</strong>.
          </p>
        </div>

        <div className="signature-section">
          <div className="signature-row">
            <div className="signature-block">
              <div className="signature-line"></div>
              <p>Signature of Student</p>
            </div>
            <div className="signature-block">
              <div className="signature-line"></div>
              <p>Signature of Faculty Counsellor</p>
            </div>
          </div>
          <div className="signature-row">
            <div className="signature-block">
              <div className="signature-line"></div>
              <p>Signature of Dean Student Affairs</p>
            </div>
            <div className="signature-block">
              <div className="signature-line"></div>
              <p>Signature of Principal</p>
            </div>
          </div>
        </div>

        <PageFooter />
      </div>

      {/* Index Sheet Pages (Landscape) - Dynamically paginated */}
      {activityPages.map((pageActivities, pageIndex) => {
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === activityPages.length - 1;
        const startIndex = pageIndex * INDEX_ROWS_PER_PAGE;

        return (
          <div key={`index-${pageIndex}`} className="page landscape index-page">
            {isFirstPage && <PageHeader showLogo={true} />}

            <div className="index-content">
              {isFirstPage && (
                <>
                  <h2 className="section-title">AICTE-Activity Book</h2>
                  <div className="student-info-line">
                    <span>
                      <strong>Name:</strong> &lt;{student.name || "student name"}&gt;
                    </span>
                    <span>
                      <strong>USN:</strong> &lt;{student.usn || "usn"}&gt;
                    </span>
                  </div>
                  <h3 className="subsection-title">Index sheet</h3>
                </>
              )}

              <table className="index-table">
                {(isFirstPage || pageIndex === 0) && (
                  <thead>
                    <tr>
                      <th>Sl. No</th>
                      <th>Semester</th>
                      <th>Name of the Activity</th>
                      <th>Map to AICTE Activity</th>
                      <th>Date (from & to) duration</th>
                      <th>Place where activity was carried</th>
                      <th>Detailed report Page No</th>
                      <th>Certificate / Proof Attached (Y/N)</th>
                      <th>Points attained</th>
                      <th>Signature of the counsellor</th>
                    </tr>
                  </thead>
                )}
                <tbody>
                  {pageActivities.length > 0 ? (
                    pageActivities.map((activity, index) => (
                      <tr key={activity.id}>
                        <td>{startIndex + index + 1}</td>
                        <td>{activity.semester}</td>
                        <td>{activity.name}</td>
                        <td>{activity.aicteMapping}</td>
                        <td>{activity.dateAndDuration}</td>
                        <td>{activity.place}</td>
                        <td>{startIndex + index + 1}</td>
                        <td>{activity.certificateAttached ? "Y" : "N"}</td>
                        <td>{activity.pointsEarned}</td>
                        <td></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="empty-row">
                        No activities added
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Signatures only on the last index page */}
              {isLastPage && (
                <div className="hod-signature-section">
                  <div className="signature-block">
                    <div className="signature-line"></div>
                    <p>Signature of HoD</p>
                  </div>
                  <div className="signature-block">
                    <div className="signature-line"></div>
                    <p>Signature of NCC/NSS officer/DSA/Dean CAT</p>
                  </div>
                </div>
              )}
            </div>

            <PageFooter />
          </div>
        );
      })}

      {/* Evaluation Sheet Pages (Landscape) - Dynamically paginated */}
      {evaluationPages.map((pageEvaluations, pageIndex) => {
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === evaluationPages.length - 1;
        const startIndex = pageIndex * EVALUATION_ROWS_PER_PAGE;

        return (
          <div key={`eval-${pageIndex}`} className="page landscape evaluation-page">
            {isFirstPage && <PageHeader showLogo={true} />}

            <div className="evaluation-content">
              {isFirstPage && (
                <h2 className="section-title">EVALUATION SHEET</h2>
              )}

              <table className="evaluation-table">
                {isFirstPage && (
                  <thead>
                    <tr>
                      <th>Sl. No</th>
                      <th>Name of Student</th>
                      <th>USN</th>
                      <th>Type of work carried</th>
                      <th>Duration</th>
                      <th>Number of hours spent</th>
                      <th>Availability of Certificate (Y/N)</th>
                      <th>Points earned</th>
                    </tr>
                  </thead>
                )}
                <tbody>
                  {pageEvaluations.length > 0 ? (
                    pageEvaluations.map((evaluation, index) => (
                      <tr key={startIndex + index}>
                        <td>{startIndex + index + 1}</td>
                        <td>{evaluation.nameOfStudent}</td>
                        <td>{evaluation.usn}</td>
                        <td>{evaluation.typeOfWork}</td>
                        <td>{evaluation.duration}</td>
                        <td>{evaluation.hoursSpent || ""}</td>
                        <td>{evaluation.certificateAvailable ? "Y" : "N"}</td>
                        <td>{evaluation.pointsEarned}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>1</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Signatures only on the last evaluation page */}
              {isLastPage && (
                <div className="evaluator-signature-section">
                  <div className="signature-block">
                    <p className="evaluator-name">Name of Evaluator 1</p>
                    <p>Designation</p>
                    <div className="signature-line"></div>
                    <p>Signature</p>
                  </div>
                  <div className="signature-block">
                    <p className="evaluator-name">Name of Evaluator 2</p>
                    <p>Designation</p>
                    <div className="signature-line"></div>
                    <p>Signature</p>
                  </div>
                  <div className="signature-block">
                    <p className="evaluator-name">Name of Counsellor</p>
                    <p>Designation</p>
                    <div className="signature-line"></div>
                    <p>Signature</p>
                  </div>
                </div>
              )}
            </div>

            <PageFooter />
          </div>
        );
      })}

      {/* Activity Detail Pages (Portrait) - One per activity */}
      {activities.map((activity, index) => (
        <div key={activity.id} className="page portrait activity-detail-page">
          <table className="activity-detail-table">
            <tbody>
              <tr>
                <th>Sl. No.</th>
                <td>{index + 1}</td>
              </tr>
              <tr>
                <th>Date & Duration</th>
                <td>{activity.dateAndDuration}</td>
              </tr>
              <tr>
                <th>Activity Name</th>
                <td>{activity.name}</td>
              </tr>
              <tr>
                <th>Description of the activity</th>
                <td className="description-cell">{activity.description}</td>
              </tr>
              <tr>
                <th>Photos</th>
                <td className="photos-cell">
                  {activity.photos && activity.photos.length > 0 ? (
                    <div className="photos-grid">
                      {activity.photos.map((photo, photoIndex) => (
                        <img
                          key={photoIndex}
                          src={photo}
                          alt={`Activity ${index + 1} photo ${photoIndex + 1}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="photo-placeholder">
                      [Attach photos here]
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <th>Outcome</th>
                <td className="outcome-cell">{activity.outcomes}</td>
              </tr>
              <tr>
                <th>Points earned</th>
                <td>{activity.pointsEarned}</td>
              </tr>
            </tbody>
          </table>
          <p className="certificate-note">
            &lt;attach certificate by taking from user&gt;
          </p>
        </div>
      ))}
    </div>
  );
}
