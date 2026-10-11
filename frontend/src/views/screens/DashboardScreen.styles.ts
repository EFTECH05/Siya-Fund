import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#080D0C",
  },

  pressed: {
    opacity: 0.75,
  },

  disabled: {
    opacity: 0.5,
  },

  // Desktop sidebar
  sidebar: {
    width: 250,
    backgroundColor: "#0D1513",
    borderRightWidth: 1,
    borderRightColor: "#1D2B26",
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 43,
    paddingHorizontal: 4,
  },

  logo: {
    width: 43,
    height: 43,
  },

  brandName: {
    color: "#F4F8F5",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.1,
  },

  brandCaption: {
    color: "#7D9189",
    fontSize: 11,
    marginTop: 3,
  },

  sidebarSectionTitle: {
    color: "#657871",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.7,
    marginBottom: 14,
    marginLeft: 12,
  },

  sidebarNavigation: {
    gap: 7,
  },

  sidebarItem: {
    minHeight: 47,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
    position: "relative",
  },

  sidebarItemActive: {
    backgroundColor: "#173026",
  },

  sidebarItemText: {
    color: "#A1B0AA",
    fontSize: 13,
    fontWeight: "500",
  },

  navigationTextActive: {
    color: "#82E8A8",
    fontWeight: "700",
  },

  activeIndicator: {
    width: 3,
    height: 23,
    backgroundColor: "#76E0A0",
    borderRadius: 4,
    position: "absolute",
    right: 0,
  },

  sidebarBottom: {
    marginTop: "auto",
    gap: 17,
  },

  helpCard: {
    backgroundColor: "#111E19",
    borderWidth: 1,
    borderColor: "#23372D",
    borderRadius: 13,
    padding: 15,
    gap: 8,
  },

  helpTitle: {
    color: "#E6F0E9",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },

  helpText: {
    color: "#8FA199",
    fontSize: 11,
    lineHeight: 17,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 45,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  logoutText: {
    color: "#F28B82",
    fontSize: 13,
    fontWeight: "600",
  },

  // Main layout
  main: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#080D0C",
  },

  topBar: {
    minHeight: 78,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#1A2722",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  topBarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  topBarTitle: {
    color: "#F3F7F5",
    fontSize: 19,
    fontWeight: "800",
  },

  topBarSubtitle: {
    color: "#82938C",
    fontSize: 12,
    marginTop: 4,
  },

  profileBadge: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: "#14241C",
    borderWidth: 1,
    borderColor: "#294333",
    alignItems: "center",
    justifyContent: "center",
  },

  signOutIconButton: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#211715",
    borderWidth: 1,
    borderColor: "#49302C",
    alignItems: "center",
    justifyContent: "center",
  },

  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#121C18",
    borderWidth: 1,
    borderColor: "#24342D",
    alignItems: "center",
    justifyContent: "center",
  },

  scrollView: {
    flex: 1,
  },

  content: {
    width: "100%",
    maxWidth: 1240,
    alignSelf: "center",
    paddingHorizontal: 30,
    paddingTop: 28,
    paddingBottom: 36,
  },

  mobileContent: {
    paddingHorizontal: 17,
    paddingTop: 23,
    paddingBottom: 28,
  },

  welcomeSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 23,
  },

  welcomeTextContainer: {
    flexShrink: 1,
  },

  welcomeTitle: {
    color: "#F3F7F5",
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -0.6,
  },

  welcomeSubtitle: {
    color: "#91A19A",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },

  secureBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#12241B",
    borderWidth: 1,
    borderColor: "#254332",
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 30,
  },

  secureBadgeText: {
    color: "#A8D9B8",
    fontSize: 11,
    fontWeight: "600",
  },

  // Balance card and chart
  balanceCard: {
    backgroundColor: "#101A16",
    borderWidth: 1,
    borderColor: "#263B30",
    borderRadius: 19,
    padding: 23,
    marginBottom: 30,
    overflow: "hidden",
  },

  balanceCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },

  balanceLabel: {
    color: "#93A79C",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  balanceValueRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 11,
  },

  balanceAmount: {
    color: "#F4F8F5",
    fontSize: 33,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  currencyBadge: {
    backgroundColor: "#1C3024",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },

  currencyBadgeText: {
    color: "#83E5A6",
    fontSize: 10,
    fontWeight: "800",
  },

  balanceCaption: {
    color: "#82958A",
    fontSize: 12,
    marginTop: 7,
  },

  balanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#1B3023",
    borderWidth: 1,
    borderColor: "#34563D",
    alignItems: "center",
    justifyContent: "center",
  },

  chartArea: {
    marginTop: 24,
    paddingTop: 17,
    borderTopWidth: 1,
    borderTopColor: "#26372E",
  },

  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  chartTitle: {
    color: "#DCE8E0",
    fontSize: 12,
    fontWeight: "700",
  },

  chartLegend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#76E0A0",
  },

  chartLegendText: {
    color: "#8FA198",
    fontSize: 11,
  },

  chart: {
    height: 72,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 7,
  },

  chartColumn: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
  },

  chartBar: {
    width: "100%",
    minHeight: 5,
    backgroundColor: "#28523A",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  chartBarHighlight: {
    backgroundColor: "#76E0A0",
  },

  chartFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 11,
  },

  chartFooterText: {
    color: "#83968B",
    fontSize: 11,
  },

  // Section headings
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 15,
    marginTop: 2,
  },

  sectionTitle: {
    color: "#F0F5F2",
    fontSize: 17,
    fontWeight: "800",
  },

  sectionSubtitle: {
    color: "#84958D",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  // Financial summary cards
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 13,
    marginBottom: 30,
  },

  summaryCard: {
    flexGrow: 1,
    flexBasis: 200,
    minWidth: 0,
    backgroundColor: "#101714",
    borderWidth: 1,
    borderColor: "#202E27",
    borderRadius: 14,
    padding: 17,
  },

  summaryCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  summaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#192A20",
    alignItems: "center",
    justifyContent: "center",
  },

  summaryValue: {
    color: "#F2F7F3",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },

  summaryTitle: {
    color: "#DCE7DF",
    fontSize: 12,
    fontWeight: "700",
  },

  summaryCaption: {
    color: "#819188",
    fontSize: 11,
    marginTop: 6,
    lineHeight: 16,
  },

  // Quick action cards
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 30,
  },

  actionCard: {
    flexGrow: 1,
    flexBasis: 210,
    minWidth: 0,
    minHeight: 85,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    backgroundColor: "#101714",
    borderWidth: 1,
    borderColor: "#24332A",
    borderRadius: 14,
  },

  actionCardPressed: {
    backgroundColor: "#19271F",
    borderColor: "#477454",
  },

  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#1A2D21",
    alignItems: "center",
    justifyContent: "center",
  },

  actionTitle: {
    flex: 1,
    flexShrink: 1,
    color: "#E5EEE8",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
  },

  actionArrow: {
    width: 29,
    height: 29,
    borderRadius: 9,
    backgroundColor: "#18231D",
    alignItems: "center",
    justifyContent: "center",
  },

  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 8,
    paddingLeft: 8,
  },

  viewAllText: {
    color: "#76E0A0",
    fontSize: 12,
    fontWeight: "700",
  },

  // Recent activity
  activityCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 30,
    backgroundColor: "#101714",
    borderWidth: 1,
    borderColor: "#202E27",
    borderRadius: 15,
    marginBottom: 24,
  },

  activityIcon: {
    width: 51,
    height: 51,
    borderRadius: 16,
    backgroundColor: "#1A2D21",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },

  activityTitle: {
    color: "#E4EEE7",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  activityDescription: {
    color: "#84958D",
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    maxWidth: 340,
    marginTop: 7,
  },

  footerText: {
    color: "#596A61",
    fontSize: 10,
    textAlign: "center",
    paddingVertical: 8,
  },

  // Mobile dropdown menu
  mobileMenu: {
    position: "absolute",
    top: 78,
    left: 12,
    right: 12,
    zIndex: 20,
    elevation: 12,
    backgroundColor: "#0E1713",
    borderWidth: 1,
    borderColor: "#293A30",
    borderRadius: 15,
    padding: 15,
    gap: 6,
  },

  mobileMenuBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 15,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#26352C",
  },

  mobileLogo: {
    width: 39,
    height: 39,
  },

  mobileMenuItem: {
    minHeight: 45,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    borderRadius: 9,
  },

  mobileMenuItemActive: {
    backgroundColor: "#173026",
  },

  mobileMenuText: {
    flex: 1,
    color: "#A1B0AA",
    fontSize: 13,
    fontWeight: "600",
  },

  mobileLogoutButton: {
    minHeight: 45,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#26352C",
    marginTop: 6,
    paddingTop: 10,
  },

  // Fixed mobile bottom navigation
  bottomNav: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#0D1512",
    borderTopWidth: 1,
    borderTopColor: "#25352C",
    paddingHorizontal: 4,
    paddingTop: 6,
    paddingBottom: 7,
  },

  mobileNavItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minHeight: 49,
  },

  mobileNavText: {
    color: "#82938E",
    fontSize: 10,
    fontWeight: "600",
  },

  mobileNavTextActive: {
    color: "#76E0A0",
    fontWeight: "800",
  },
});
