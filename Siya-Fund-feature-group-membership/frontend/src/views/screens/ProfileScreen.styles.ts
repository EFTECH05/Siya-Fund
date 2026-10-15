
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0B1220",
  },

  content: {
    width: "100%",
    maxWidth: 1040,
    alignSelf: "center",
    paddingHorizontal: 28,
    paddingTop: 34,
    paddingBottom: 48,
  },

  contentCompact: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 36,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#0B1220",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: 24,
  },

  loadingMark: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: "#142B29",
    borderWidth: 1,
    borderColor: "#254B40",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  loadingText: {
    color: "#A7B2C4",
    fontSize: 14,
    textAlign: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    marginBottom: 26,
  },

  headerCompact: {
    alignItems: "flex-start",
    marginBottom: 22,
    gap: 10,
  },

  headerCopy: {
    flex: 1,
    minWidth: 0,
  },

  backButton: {
    width: 44,
    height: 44,
    flexShrink: 0,
    borderRadius: 14,
    backgroundColor: "#142B29",
    borderWidth: 1,
    borderColor: "#254B40",
    alignItems: "center",
    justifyContent: "center",
  },

  eyebrow: {
    color: "#46D39A",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2.2,
    marginBottom: 8,
  },

  pageTitle: {
    color: "#F7FAFC",
    fontSize: 32,
    lineHeight: 39,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  subtitle: {
    color: "#9AA8BC",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
    maxWidth: 540,
  },

  refreshButton: {
    width: 46,
    height: 46,
    flexShrink: 0,
    borderRadius: 15,
    backgroundColor: "#142B29",
    borderWidth: 1,
    borderColor: "#254B40",
    alignItems: "center",
    justifyContent: "center",
  },

  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#30291D",
    borderColor: "#65502B",
    borderWidth: 1,
    borderRadius: 15,
    padding: 14,
    marginBottom: 20,
  },

  noticeText: {
    color: "#F2D7A0",
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
    minWidth: 0,
  },

  profileCard: {
    position: "relative",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    gap: 22,
    backgroundColor: "#121D2D",
    borderWidth: 1,
    borderColor: "#29394E",
    borderRadius: 24,
    padding: 26,
    marginBottom: 24,
  },

  profileCardCompact: {
    alignItems: "flex-start",
    gap: 16,
    padding: 19,
    borderRadius: 21,
    marginBottom: 20,
  },

  avatarWrap: {
    position: "relative",
    flexShrink: 0,
  },

  avatar: {
    width: 86,
    height: 86,
    borderRadius: 27,
    backgroundColor: "#174638",
    borderWidth: 1,
    borderColor: "#33785F",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#71E3B2",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  avatarOnlineDot: {
    position: "absolute",
    right: -2,
    bottom: 1,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: "#46D39A",
    borderWidth: 3,
    borderColor: "#121D2D",
  },

  identity: {
    flex: 1,
    minWidth: 0,
  },

  identityCompact: {
    alignSelf: "center",
  },

  profileEyebrow: {
    color: "#67CDA5",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 7,
  },

  fullName: {
    color: "#F7FAFC",
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  email: {
    color: "#9AA8BC",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
    flexShrink: 1,
  },

  profileBadges: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },

  roleBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#17352E",
    borderWidth: 1,
    borderColor: "#245443",
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  roleText: {
    color: "#6EE0AF",
    fontSize: 11,
    fontWeight: "800",
  },

  verificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#142B29",
    borderWidth: 1,
    borderColor: "#254B40",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  verificationPending: {
    backgroundColor: "#30291D",
    borderColor: "#65502B",
  },

  verificationText: {
    color: "#62DDA8",
    fontSize: 11,
    fontWeight: "700",
  },

  verificationPendingText: {
    color: "#F2C879",
  },

  profileDecoration: {
    position: "absolute",
    right: -8,
    bottom: -23,
  },

  section: {
    backgroundColor: "#121D2D",
    borderWidth: 1,
    borderColor: "#253449",
    borderRadius: 21,
    paddingHorizontal: 22,
    paddingVertical: 22,
    marginBottom: 18,
  },

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginBottom: 19,
  },

  sectionIcon: {
    width: 44,
    height: 44,
    flexShrink: 0,
    borderRadius: 14,
    backgroundColor: "#17352E",
    borderWidth: 1,
    borderColor: "#254B40",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionHeadingText: {
    flex: 1,
    minWidth: 0,
  },

  sectionTitle: {
    color: "#F1F5F9",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800",
  },

  sectionSubtitle: {
    color: "#8999AF",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  detailsList: {
    width: "100%",
  },

  detailRow: {
    minHeight: 57,
    borderBottomWidth: 1,
    borderBottomColor: "#243145",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 14,
  },

  detailRowCompact: {
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 8,
    paddingVertical: 13,
  },

  lastDetailRow: {
    borderBottomWidth: 0,
  },

  rowLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    flexShrink: 0,
  },

  rowLabel: {
    color: "#91A0B5",
    fontSize: 13,
    lineHeight: 19,
    flexShrink: 1,
  },

  rowValue: {
    color: "#E8EEF6",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    minWidth: 0,
  },

  rowValueCompact: {
    width: "100%",
    flex: 0,
    textAlign: "left",
    paddingLeft: 26,
  },

  securityNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    backgroundColor: "#0E1827",
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },

  securityNoteText: {
    color: "#8999AF",
    fontSize: 12,
    lineHeight: 19,
    flex: 1,
    minWidth: 0,
  },

  supportCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: "#10251F",
    borderWidth: 1,
    borderColor: "#23483A",
    borderRadius: 19,
    padding: 18,
    marginBottom: 18,
  },

  supportIcon: {
    width: 43,
    height: 43,
    flexShrink: 0,
    borderRadius: 14,
    backgroundColor: "#17352E",
    alignItems: "center",
    justifyContent: "center",
  },

  supportCopy: {
    flex: 1,
    minWidth: 0,
  },

  supportTitle: {
    color: "#EAF8F1",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 5,
  },

  supportText: {
    color: "#A1B8AE",
    fontSize: 12,
    lineHeight: 19,
  },

  signOutButton: {
    position: "relative",
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#2B1D28",
    borderWidth: 1,
    borderColor: "#55303B",
    borderRadius: 16,
    paddingHorizontal: 18,
    marginTop: 2,
  },

  signOutText: {
    color: "#FF9298",
    fontSize: 14,
    fontWeight: "800",
  },

  signOutArrow: {
    position: "absolute",
    right: 17,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },

  buttonPressed: {
    opacity: 0.72,
  },

  footer: {
    color: "#64748B",
    fontSize: 11,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 25,
    paddingHorizontal: 10,
  },
});

export default styles;
