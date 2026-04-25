import { Page, View, Text, Image } from "@react-pdf/renderer";
import { Activity } from "@/lib/types/form-filler";
import { styles } from "./styles";
import { ActivityHeader, ActivityFooter } from "./common";
import { formatDateRange } from "./utils";

interface ActivityPagesProps {
  activities: Activity[];
  department: string;
  startPageOffset: number;
}

export const ActivityPages = ({
  activities,
  department,
  startPageOffset,
}: ActivityPagesProps) => {
  return activities.flatMap((activity, index) => {
    const pages = [];

    // Page 1: Activity details only (strict - always one page)
    pages.push(
      <Page
        key={`${activity.id}-details`}
        size="A4"
        orientation="portrait"
        style={styles.pagePortrait}
      >
        <ActivityHeader />
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
            <Text style={styles.activityLabel}>Outcome</Text>
            <Text style={styles.outcomeCell}>{activity.outcomes}</Text>
          </View>
          <View style={styles.activityRow}>
            <Text style={styles.activityLabel}>Points earned</Text>
            <Text style={styles.activityValue}>{activity.pointsEarned}</Text>
          </View>
        </View>
        <ActivityFooter
          department={department || ""}
          pageOffset={startPageOffset}
        />
      </Page>
    );

    // Photo pages: Each photo gets its own full page
    if (activity.photos && activity.photos.length > 0) {
      activity.photos.forEach((photo, idx) => {
        pages.push(
          <Page
            key={`${activity.id}-photo-${idx}`}
            size="A4"
            orientation="portrait"
            style={styles.pagePortrait}
          >
            <ActivityHeader />
            <Image src={photo} style={styles.fullPageImage} />
            <ActivityFooter
              department={department || ""}
              pageOffset={startPageOffset}
            />
          </Page>
        );
      });
    }

    // Certificate pages: Each certificate gets its own full page
    const certImages = activity.certificateImages && activity.certificateImages.length > 0
      ? activity.certificateImages
      : activity.certificateImage
        ? [activity.certificateImage]
        : [];

    if (certImages.length > 0) {
      certImages.forEach((certImg, idx) => {
        pages.push(
          <Page
            key={`${activity.id}-cert-${idx}`}
            size="A4"
            orientation="portrait"
            style={styles.pagePortrait}
          >
            <ActivityHeader />
            <Image src={certImg} style={styles.fullPageImage} />
            <ActivityFooter
              department={department || ""}
              pageOffset={startPageOffset}
            />
          </Page>
        );
      });
    }

    return pages;
  });
};
