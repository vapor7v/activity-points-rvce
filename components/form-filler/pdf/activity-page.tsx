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
  return activities.map((activity, index) => (
    <Page
      key={activity.id}
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
          <Text style={styles.activityLabel}>Photos</Text>
          <View style={styles.photosCell}>
            {activity.photos && activity.photos.length > 0 ? (
              <View style={styles.photosContainer}>
                {activity.photos.map((photo, idx) => (
                  <Image key={idx} src={photo} style={styles.photo} />
                ))}
              </View>
            ) : (
              <Text>[Attach photos here]</Text>
            )}
          </View>
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
      {activity.certificateAttached && activity.certificateImage && (
        <Image src={activity.certificateImage} style={styles.certificateImage} />
      )}
      <ActivityFooter
        department={department || ""}
        pageOffset={startPageOffset}
      />
    </Page>
  ));
};
