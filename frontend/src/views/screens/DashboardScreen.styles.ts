import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#080D17",
  },

  mainArea: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#080D17",
    position: "relative",
  },

  sidebar: {
    width: 255,
    backgroundColor: "#0D1422",
    borderRightWidth: 1,
    borderRightColor: "#202B3D",
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 18,
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 38,
    gap: 10,
  },

  logo: {
    width: 46,
    height: 46,
  },

  brandTextContainer: {
    flex: 1,
  },

  brandName: {
    color: "#F4F7FC",
    fontSize: 23,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  brandNameAccent: {
    color: "#39D98A",
  },

  brandSubtitle: {
    color: "#8290A6",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginTop: 3,
  },

  menuHeading: {
    color: "#71819A",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 14,
    marginTop: 4,
  },

  sidebarNavigation: {
    gap: 7,
  },

  sidebarItem: {
    minHeight: 47,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    gap: 12,
    position: "relative",
  },

  sidebarItemActive: {
    backgroundColor: "#142B27",
  },

  sidebarItemText: {
    color: "#A9B5C8",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },

  sidebarItemTextActive: {
    color: "#39D98A",
    fontWeight: "700",
  },

  activeIndicator: {
    width: 3,
    height: 23,
    borderRadius: 3,
    backgroundColor: "#39D98A",
    position: "absolute",
    right: 0,
  },

  sidebarFooter: {
    marginTop: "auto",
    gap: 13,
  },

  sidebarFooterDivider: {
    height: 1,
    backgroundColor: "#263246",
    marginBottom: 5,
  },

  signOutButton: {
    minHeight: 45,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    gap: 12,
    borderRadius: 10,
    backgroundColor: "#241B25",
  },

  mobileSignOutButton: {
    marginTop: 10,
    marginBottom: 12,
  },

  signOutText: {
    color: "#F28B82",
    fontSize: 13,
    fontWeight: "700",
  },

  disabled: {
    opacity: 0.5,
  },

  versionText: {
    color: "#71819A",
    fontSize: 10,
    textAlign: "center",
  },

  pressed: {
    opacity: 0.72,
  },

  topBar: {
    minHeight: 82,
    paddingHorizontal: 26,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#202B3D",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    zIndex: 20,
    backgroundColor: "#0B111D",
  },

  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
    minWidth: 0,
  },

  menuButton: {
    width: 43,
    height: 43,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#172234",
    borderWidth: 1,
    borderColor: "#29364B",
  },

  topBarTitle: {
    color: "#F4F7FC",
    fontSize: 20,
    fontWeight: "800",
  },

  topBarSubtitle: {
    color: "#8290A6",
    fontSize: 11,
    marginTop: 4,
  },

  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  secureBadge: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#142B27",
  },

  secureBadgeText: {
    color: "#39D98A",
    fontSize: 11,
    fontWeight: "700",
  },

  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#172234",
    borderWidth: 1,
    borderColor: "#29364B",
    alignItems: "center",
    justifyContent: "center",
  },

  mobileMenu: {
    position: "absolute",
    top: 72,
    left: 12,
    right: 12,
    zIndex: 1000,
    elevation: 12,
    backgroundColor: "#101827",
    borderWidth: 1,
    borderColor: "#29364B",
    borderRadius: 14,
    maxHeight: 420,
    overflow: "hidden",
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 10px 28px rgba(0,0,0,0.4)",
        }
      : {}),
  },

  mobileMenuScroll: {
    flexShrink: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
  },

  mobileMenuFooter: {
    paddingHorizontal: 14,
    paddingTop: 8,
    backgroundColor: "#101827",
    borderTopWidth: 1,
    borderTopColor: "#202B3D",
  },

  contentScroll: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 35,
    gap: 24,
    maxWidth: 1450,
    width: "100%",
    alignSelf: "center",
  },

  mobileContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 110,
    gap: 22,
  },

  welcomeSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    flexWrap: "wrap",
  },

  welcomeTextContainer: {
    flex: 1,
    minWidth: 200,
    gap: 7,
  },

  welcomeEyebrow: {
    color: "#39D98A",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  welcomeTitle: {
    color: "#F4F7FC",
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -0.7,
  },

  welcomeSubtitle: {
    color: "#9AA8BD",
    fontSize: 13,
    lineHeight: 20,
  },

  growthBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#244638",
    backgroundColor: "#10231F",
  },

  growthBadgeTitle: {
    color: "#EAFBF2",
    fontSize: 12,
    fontWeight: "800",
  },

  growthBadgeSubtitle: {
    color: "#8EA99A",
    fontSize: 10,
    marginTop: 4,
  },

  balanceCard: {
    backgroundColor: "#101D2B",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#26394A",
    padding: 23,
    flexDirection: "row",
    gap: 25,
    overflow: "hidden",
  },

  balanceCardContent: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },

  balanceLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  balanceLabel: {
    color: "#A5B4C8",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
  },

  balanceAmount: {
    color: "#F4F7FC",
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1,
    marginTop: 13,
  },

  balanceNote: {
    color: "#8290A6",
    fontSize: 11,
    marginTop: 6,
  },

  balanceDivider: {
    height: 1,
    backgroundColor: "#29394A",
    marginVertical: 19,
  },

  balanceFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  balanceStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: "#39D98A",
  },

  balanceStatusText: {
    color: "#A9B5C8",
    fontSize: 11,
  },

  chartArea: {
    flex: 0.9,
    minWidth: 150,
    justifyContent: "center",
    gap: 15,
  },

  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  chartLabel: {
    color: "#A9B5C8",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  chartBars: {
    height: 100,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 7,
  },

  chartBarTrack: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
  },

  chartBar: {
    width: "100%",
    minHeight: 5,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: "#24634C",
  },

  chartBarHighlighted: {
    backgroundColor: "#39D98A",
  },

  chartCaption: {
    color: "#8290A6",
    fontSize: 10,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  sectionTitle: {
    color: "#F4F7FC",
    fontSize: 17,
    fontWeight: "800",
  },

  sectionSubtitle: {
    color: "#8290A6",
    fontSize: 11,
    marginTop: 5,
  },

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  summaryCard: {
    flexGrow: 1,
    flexBasis: 175,
    minWidth: 0,
    padding: 18,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#253246",
    backgroundColor: "#101827",
    gap: 9,
  },

  summaryIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  summaryLabel: {
    color: "#A9B5C8",
    fontSize: 11,
    fontWeight: "600",
  },

  summaryValue: {
    color: "#F4F7FC",
    fontSize: 23,
    fontWeight: "800",
  },

  summaryFootnote: {
    color: "#71819A",
    fontSize: 10,
  },

  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  quickActionCard: {
    flexGrow: 1,
    flexBasis: 200,
    minWidth: 0,
    minHeight: 160,
    padding: 17,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#253246",
    backgroundColor: "#101827",
    position: "relative",
    gap: 9,
  },

  quickActionIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: "#153C31",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },

  quickActionTitle: {
    color: "#F4F7FC",
    fontSize: 13,
    fontWeight: "800",
  },

  quickActionSubtitle: {
    color: "#8290A6",
    fontSize: 11,
    lineHeight: 17,
  },

  quickActionArrow: {
    position: "absolute",
    right: 16,
    top: 18,
  },

  activityCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#253246",
    backgroundColor: "#101827",
    gap: 10,
  },

  emptyActivityIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#192437",
    marginBottom: 3,
  },

  emptyActivityTitle: {
    color: "#E8EDF6",
    fontSize: 14,
    fontWeight: "800",
  },

  emptyActivitySubtitle: {
    color: "#8290A6",
    fontSize: 11,
    lineHeight: 18,
    textAlign: "center",
    maxWidth: 360,
  },

  footerNote: {
    color: "#65748B",
    fontSize: 10,
    textAlign: "center",
    marginTop: 4,
  },

  bottomNavigation: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 70,
    paddingTop: 9,
    paddingBottom: Platform.OS === "web" ? 9 : 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#0D1422",
    borderTopWidth: 1,
    borderTopColor: "#263246",
    zIndex: 10,
    elevation: 8,
  },

  bottomNavItem: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  bottomNavLabel: {
    color: "#8290A6",
    fontSize: 9,
    fontWeight: "600",
  },

  bottomNavLabelActive: {
    color: "#39D98A",
    fontWeight: "800",
  },
});

export default styles;
