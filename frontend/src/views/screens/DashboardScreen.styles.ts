import { Platform, StyleSheet } from "react-native";

const isWeb = Platform.OS === "web";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: "#080D17",
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  mainWithWideDrawer: {
    marginLeft: 250,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 35,
  },
  contentWithBottomNav: {
    paddingBottom: 110,
  },

  // Header
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#151D2B",
    borderWidth: 1,
    borderColor: "#273247",
  },
  menuButtonText: {
    color: "#EAF0FA",
    fontSize: 21,
  },
  greeting: {
    color: "#8B97AA",
    fontSize: 13,
    marginBottom: 4,
  },
  pageTitle: {
    color: "#F4F7FC",
    fontSize: 25,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  profileButton: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#1D2A3D",
    borderWidth: 1,
    borderColor: "#34435A",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: {
    color: "#66E3A4",
    fontWeight: "800",
    fontSize: 16,
  },

  // Welcome
  welcomeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 23,
  },
  welcomeTitle: {
    color: "#F1F5FB",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  welcomeSubtitle: {
    color: "#8591A5",
    fontSize: 13,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#10271F",
    borderColor: "#214B38",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#55D99A",
  },
  statusText: {
    color: "#7AE6B0",
    fontSize: 11,
    fontWeight: "600",
  },

  // Balance and summary cards
  overviewGrid: {
    gap: 15,
    marginBottom: 30,
  },
  overviewGridWide: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  balanceCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#111B2B",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#27364A",
    padding: 22,
    overflow: "hidden",
  },
  balanceCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardEyebrow: {
    color: "#92A0B5",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 13,
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: 10,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  trendArrow: {
    color: "#5EE6A3",
    fontSize: 15,
    fontWeight: "800",
  },
  trendText: {
    color: "#5EE6A3",
    fontSize: 12,
    fontWeight: "700",
  },
  trendCaption: {
    color: "#8C9AAF",
    fontSize: 11,
  },
  visibilityButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#1C293B",
    alignItems: "center",
    justifyContent: "center",
  },
  visibilityIcon: {
    color: "#C3CEDD",
    fontSize: 18,
  },

  // Decorative savings chart
  chartArea: {
    marginTop: 28,
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  chartLabel: {
    color: "#9BA8BB",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  chartPeriod: {
    color: "#68788F",
    fontSize: 9,
    fontWeight: "600",
  },
  chartBars: {
    height: 88,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#293649",
    paddingHorizontal: 2,
  },
  chartBarTrack: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  chartBar: {
    width: "72%",
    maxWidth: 28,
    minHeight: 8,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: "#285943",
  },
  chartBarActive: {
    backgroundColor: "#5CE5A1",
  },
  chartMonths: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 9,
  },
  chartMonth: {
    color: "#77869B",
    fontSize: 9,
    textAlign: "center",
  },
  summaryColumn: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#111B2B",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#27364A",
    padding: 16,
    justifyContent: "center",
  },
  summaryIconGreen: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "#153A2B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  summaryIconBlue: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "#1B304A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  summaryIconText: {
    color: "#72E6AC",
    fontSize: 19,
    fontWeight: "700",
  },
  summaryLabel: {
    color: "#9AA7BA",
    fontSize: 11,
    marginBottom: 9,
  },
  summaryAmount: {
    color: "#F4F7FC",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 7,
  },
  summaryCaption: {
    color: "#738198",
    fontSize: 10,
    lineHeight: 15,
  },

  // Section headings
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#F0F4FB",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 5,
  },
  sectionSubtitle: {
    color: "#7F8CA1",
    fontSize: 11,
  },
  viewAll: {
    color: "#66DFA2",
    fontSize: 12,
    fontWeight: "700",
  },

  // Quick actions
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 30,
  },
  actionCard: {
    minHeight: 122,
    backgroundColor: "#111B2B",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#263449",
    padding: 15,
    position: "relative",
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#173629",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  actionIconText: {
    color: "#68E4A5",
    fontSize: 20,
    fontWeight: "700",
  },
  actionLabel: {
    color: "#E8EDF6",
    fontSize: 12,
    fontWeight: "600",
  },
  actionArrow: {
    position: "absolute",
    top: 17,
    right: 15,
    color: "#75849A",
    fontSize: 15,
  },

  // Transactions
  transactionsCard: {
    backgroundColor: "#111B2B",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#263449",
    paddingHorizontal: 16,
    marginBottom: 30,
  },
  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#253145",
    gap: 12,
  },
  transactionRowLast: {
    borderBottomWidth: 0,
  },
  transactionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionIconIn: {
    backgroundColor: "#15392B",
  },
  transactionIconOut: {
    backgroundColor: "#30283A",
  },
  transactionSymbol: {
    fontSize: 20,
    fontWeight: "700",
  },
  transactionDetails: {
    flex: 1,
    minWidth: 0,
  },
  transactionTitle: {
    color: "#E7ECF5",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 5,
  },
  transactionSubtitle: {
    color: "#7E8BA0",
    fontSize: 10,
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 5,
  },
  amountPositive: {
    color: "#63E2A0",
  },
  amountNegative: {
    color: "#E7A1A8",
  },
  transactionDate: {
    color: "#7E8BA0",
    fontSize: 10,
  },

  // Savings group
  groupCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    backgroundColor: "#111B2B",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#263449",
    padding: 17,
    marginBottom: 25,
  },
  groupIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#193B2E",
    alignItems: "center",
    justifyContent: "center",
  },
  groupIconText: {
    color: "#70E6AA",
    fontSize: 23,
  },
  groupDetails: {
    flex: 1,
    minWidth: 0,
  },
  groupTitle: {
    color: "#EEF2F9",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 5,
  },
  groupSubtitle: {
    color: "#8794A8",
    fontSize: 10,
    marginBottom: 13,
  },
  progressTrack: {
    height: 5,
    borderRadius: 5,
    backgroundColor: "#273548",
    overflow: "hidden",
  },
  progressFill: {
    width: "68%",
    height: "100%",
    borderRadius: 5,
    backgroundColor: "#5DE3A0",
  },
  progressCaption: {
    color: "#8190A5",
    fontSize: 10,
    marginTop: 7,
  },
  groupArrow: {
    color: "#8290A5",
    fontSize: 26,
  },
  footerText: {
    color: "#5F6C80",
    fontSize: 10,
    textAlign: "center",
    marginTop: 3,
  },

  // Web drawer
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 250,
    backgroundColor: "#0D1522",
    borderRightWidth: 1,
    borderRightColor: "#243146",
    paddingHorizontal: 19,
    paddingTop: 28,
    paddingBottom: 22,
    zIndex: 20,
  },
  drawerOpen: {
    transform: [{ translateX: 0 }],
  },
  drawerClosed: {
    transform: [{ translateX: -260 }],
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 42,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#1C4934",
    alignItems: "center",
    justifyContent: "center",
  },
  logoMarkText: {
    color: "#73E8AD",
    fontSize: 22,
    fontWeight: "900",
  },
  brandName: {
    color: "#F3F6FB",
    fontSize: 16,
    fontWeight: "800",
  },
  brandSubtitle: {
    color: "#7F8EA3",
    fontSize: 8,
    letterSpacing: 1,
    marginTop: 4,
  },
  drawerSectionLabel: {
    color: "#65758B",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 13,
    marginLeft: 9,
  },
  drawerNavItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  drawerNavItemActive: {
    backgroundColor: "#173629",
  },
  drawerNavSymbol: {
    color: "#8795AA",
    fontSize: 19,
    width: 22,
    textAlign: "center",
  },
  drawerNavSymbolActive: {
    color: "#6CE4A7",
  },
  drawerNavText: {
    color: "#A3AEC0",
    fontSize: 12,
    fontWeight: "500",
  },
  drawerNavTextActive: {
    color: "#76E7AE",
    fontWeight: "700",
  },
  drawerSpacer: {
    flex: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#263449",
  },
  logoutSymbol: {
    color: "#E8A0A6",
    fontSize: 20,
  },
  logoutText: {
    color: "#E8A0A6",
    fontSize: 12,
    fontWeight: "600",
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.55)",
    zIndex: 15,
  },

  // Mobile bottom navigation
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    minHeight: 72,
    paddingTop: 9,
    paddingBottom: isWeb ? 9 : Platform.select({ ios: 20, default: 9 }),
    backgroundColor: "#0D1522",
    borderTopWidth: 1,
    borderTopColor: "#253247",
    zIndex: 10,
    ...(isWeb ? { position: "fixed" as const } : {}),
  },
  bottomNavItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 4,
  },
  bottomNavSymbol: {
    color: "#7F8DA2",
    fontSize: 20,
  },
  bottomNavSymbolActive: {
    color: "#69E5A6",
  },
  bottomNavLabel: {
    color: "#7F8DA2",
    fontSize: 9,
    fontWeight: "500",
  },
  bottomNavLabelActive: {
    color: "#69E5A6",
    fontWeight: "700",
  },
});

export default styles;
