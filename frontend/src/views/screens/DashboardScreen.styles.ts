import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // ==========================================
  // MAIN CONTAINER
  // ==========================================

  container: {
    flex: 1,
    backgroundColor: "#F4F8F5",
  },

  // ==========================================
  // SCROLL CONTENT
  // ==========================================

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 35,

    width: "100%",
    maxWidth: 900,

    alignSelf: "center",
  },

  // ==========================================
  // HEADER
  // ==========================================

  header: {
    width: "100%",

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 25,
  },

  smallGreeting: {
    color: "#7A837D",
    fontSize: 14,
    marginBottom: 3,
  },

  userName: {
    color: "#17231B",
    fontSize: 27,
    fontWeight: "700",
  },

  // ==========================================
  // NOTIFICATION
  // ==========================================

  notificationButton: {
    width: 48,
    height: 48,

    borderRadius: 24,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.07,
    shadowRadius: 8,

    elevation: 3,
  },

  notificationIcon: {
    fontSize: 20,
  },

  notificationDot: {
    position: "absolute",

    top: 10,
    right: 11,

    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: "#E45B5B",

    borderWidth: 1,
    borderColor: "#FFFFFF",
  },

  // ==========================================
  // SAVINGS CARD
  // ==========================================

  savingsCard: {
    width: "100%",

    backgroundColor: "#2E8B57",

    borderRadius: 22,

    paddingHorizontal: 24,
    paddingVertical: 24,

    marginBottom: 28,

    shadowColor: "#2E8B57",

    shadowOffset: {
      width: 0,
      height: 7,
    },

    shadowOpacity: 0.18,
    shadowRadius: 14,

    elevation: 5,
  },

  savingsHeader: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",
  },

  savingsLabel: {
    color: "#DDF3E5",
    fontSize: 14,
    fontWeight: "600",
  },

  savingsIcon: {
    fontSize: 22,
  },

  savingsAmount: {
    color: "#FFFFFF",

    fontSize: 34,

    fontWeight: "800",

    marginTop: 7,
  },

  savingsFooter: {
    flexDirection: "row",

    alignItems: "flex-end",
    justifyContent: "space-between",

    marginTop: 18,
  },

  savingsFooterLabel: {
    color: "#DDF3E5",

    fontSize: 12,

    marginBottom: 3,
  },

  savingsFooterValue: {
    color: "#FFFFFF",

    fontSize: 15,

    fontWeight: "700",
  },

  growthBadge: {
    backgroundColor: "rgba(255,255,255,0.16)",

    borderRadius: 20,

    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  growthText: {
    color: "#FFFFFF",

    fontSize: 13,

    fontWeight: "700",
  },

  // ==========================================
  // SECTION TITLE
  // ==========================================

  sectionTitle: {
    color: "#17231B",

    fontSize: 19,

    fontWeight: "700",

    marginBottom: 14,
  },

  // ==========================================
  // SUMMARY
  // ==========================================

  summaryRow: {
    width: "100%",

    flexDirection: "row",

    gap: 12,

    marginBottom: 18,
  },

  summaryCard: {
    flex: 1,

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    padding: 17,

    minHeight: 155,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 2,
  },

  summaryIconGreen: {
    width: 38,
    height: 38,

    borderRadius: 12,

    backgroundColor: "#EAF6EE",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 13,
  },

  summaryIconOrange: {
    width: 38,
    height: 38,

    borderRadius: 12,

    backgroundColor: "#FFF3E8",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 13,
  },

  summaryIconText: {
    color: "#2E8B57",

    fontSize: 19,

    fontWeight: "800",
  },

  summaryLabel: {
    color: "#6B756F",

    fontSize: 12,

    lineHeight: 17,

    marginBottom: 5,
  },

  summaryAmount: {
    color: "#17231B",

    fontSize: 18,

    fontWeight: "700",

    marginBottom: 5,
  },

  summaryStatus: {
    color: "#9AA39D",

    fontSize: 11,
  },

  // ==========================================
  // AVAILABLE LOAN
  // ==========================================

  loanCard: {
    width: "100%",

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    padding: 18,

    flexDirection: "row",

    alignItems: "center",

    marginBottom: 28,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 2,
  },

  loanIconContainer: {
    width: 48,
    height: 48,

    borderRadius: 15,

    backgroundColor: "#EAF6EE",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 13,
  },

  loanIcon: {
    fontSize: 22,
  },

  loanContent: {
    flex: 1,
  },

  loanTitle: {
    color: "#6B756F",

    fontSize: 12,

    marginBottom: 3,
  },

  loanAmount: {
    color: "#17231B",

    fontSize: 20,

    fontWeight: "700",

    marginBottom: 2,
  },

  loanDescription: {
    color: "#9AA39D",

    fontSize: 11,
  },

  loanButton: {
    backgroundColor: "#EAF6EE",

    borderRadius: 10,

    paddingHorizontal: 13,
    paddingVertical: 9,
  },

  loanButtonText: {
    color: "#2E8B57",

    fontSize: 11,

    fontWeight: "800",

    letterSpacing: 0.5,
  },

  // ==========================================
  // QUICK ACTIONS
  // ==========================================

  actionsGrid: {
    width: "100%",

    flexDirection: "row",

    flexWrap: "wrap",

    gap: 12,

    marginBottom: 28,
  },

  actionCard: {
    width: "48%",

    minWidth: 145,

    flexGrow: 1,

    backgroundColor: "#FFFFFF",

    borderRadius: 17,

    padding: 16,

    minHeight: 135,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 2,
  },

  actionIconGreen: {
    width: 38,
    height: 38,

    borderRadius: 12,

    backgroundColor: "#EAF6EE",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,
  },

  actionIconBlue: {
    width: 38,
    height: 38,

    borderRadius: 12,

    backgroundColor: "#EAF2FA",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,
  },

  actionIconPurple: {
    width: 38,
    height: 38,

    borderRadius: 12,

    backgroundColor: "#F1ECFA",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,
  },

  actionIconOrange: {
    width: 38,
    height: 38,

    borderRadius: 12,

    backgroundColor: "#FFF3E8",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,
  },

  actionIconText: {
    color: "#2E8B57",

    fontSize: 18,

    fontWeight: "800",
  },

  blueIconText: {
    color: "#3C7DB5",
  },

  purpleIconText: {
    color: "#7654B5",
  },

  orangeIconText: {
    color: "#D66A43",
  },

  actionTitle: {
    color: "#17231B",

    fontSize: 14,

    fontWeight: "700",

    marginBottom: 4,
  },

  actionDescription: {
    color: "#8A938D",

    fontSize: 11,

    lineHeight: 16,
  },

  // ==========================================
  // SECTION HEADER
  // ==========================================

  sectionHeader: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 14,
  },

  viewAllText: {
    color: "#2E8B57",

    fontSize: 13,

    fontWeight: "700",
  },

  // ==========================================
  // TRANSACTIONS
  // ==========================================

  transactionCard: {
    width: "100%",

    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    padding: 15,

    flexDirection: "row",

    alignItems: "center",

    marginBottom: 10,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.04,
    shadowRadius: 8,

    elevation: 1,
  },

  transactionIconGreen: {
    width: 42,
    height: 42,

    borderRadius: 13,

    backgroundColor: "#EAF6EE",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  transactionIconOrange: {
    width: 42,
    height: 42,

    borderRadius: 13,

    backgroundColor: "#FFF3E8",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  transactionIconText: {
    color: "#2E8B57",

    fontSize: 19,

    fontWeight: "800",
  },

  transactionContent: {
    flex: 1,
  },

  transactionTitle: {
    color: "#27332C",

    fontSize: 13,

    fontWeight: "600",

    marginBottom: 4,
  },

  transactionDate: {
    color: "#9AA39D",

    fontSize: 11,
  },

  transactionAmountContainer: {
    alignItems: "flex-end",
  },

  transactionPositive: {
    color: "#2E8B57",

    fontSize: 13,

    fontWeight: "700",

    marginBottom: 3,
  },

  transactionNegative: {
    color: "#D66A43",

    fontSize: 13,

    fontWeight: "700",

    marginBottom: 3,
  },

  completedText: {
    color: "#9AA39D",

    fontSize: 10,
  },

  // ==========================================
  // GROUP
  // ==========================================

  groupCard: {
    width: "100%",

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    padding: 17,

    flexDirection: "row",

    alignItems: "center",

    marginBottom: 25,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 2,
  },

  groupAvatar: {
    width: 48,
    height: 48,

    borderRadius: 16,

    backgroundColor: "#2E8B57",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 13,
  },

  groupAvatarText: {
    color: "#FFFFFF",

    fontSize: 14,

    fontWeight: "800",
  },

  groupContent: {
    flex: 1,
  },

  groupName: {
    color: "#17231B",

    fontSize: 14,

    fontWeight: "700",

    marginBottom: 4,
  },

  groupMembers: {
    color: "#8A938D",

    fontSize: 11,
  },

  groupButton: {
    backgroundColor: "#EAF6EE",

    borderRadius: 10,

    paddingHorizontal: 13,
    paddingVertical: 9,
  },

  groupButtonText: {
    color: "#2E8B57",

    fontSize: 11,

    fontWeight: "800",
  },

  // ==========================================
  // BOTTOM NAVIGATION
  // ==========================================

  bottomNavigation: {
    width: "100%",

    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    paddingVertical: 12,
    paddingHorizontal: 8,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-around",

    marginTop: 5,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.06,
    shadowRadius: 12,

    elevation: 3,
  },

  navItem: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 4,
  },

  navIcon: {
    color: "#9AA39D",

    fontSize: 18,

    fontWeight: "700",

    marginBottom: 4,
  },

  navIconActive: {
    color: "#2E8B57",

    fontSize: 18,

    fontWeight: "800",

    marginBottom: 4,
  },

  navText: {
    color: "#9AA39D",

    fontSize: 9,

    fontWeight: "600",
  },

  navTextActive: {
    color: "#2E8B57",

    fontSize: 9,

    fontWeight: "700",
  },

  // ==========================================
  // PRESSED STATE
  // ==========================================

  buttonPressed: {
    opacity: 0.75,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },
});
