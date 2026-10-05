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
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },


  // ==========================================
  // LOADING
  // ==========================================

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F4F8F5",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  loadingText: {
    marginTop: 15,
    color: "#657169",
    fontSize: 15,
  },


  // ==========================================
  // HEADER
  // ==========================================

  header: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.06,
    shadowRadius: 15,

    elevation: 3,
  },

  headerTextContainer: {
    flex: 1,
    paddingRight: 15,
  },

  smallHeaderText: {
    color: "#2E8B57",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.3,
    marginBottom: 6,
  },

  title: {
    color: "#17231B",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 5,
  },

  welcomeText: {
    color: "#6B756F",
    fontSize: 14,
  },


  // ==========================================
  // LOGOUT
  // ==========================================

  logoutButton: {
    minWidth: 85,
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#C0392B",
    alignItems: "center",
    justifyContent: "center",
  },

  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
  },

  buttonPressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.97,
      },
    ],
  },


  // ==========================================
  // SECTION HEADER
  // ==========================================

  sectionHeader: {
    marginTop: 30,
    marginBottom: 15,
  },

  sectionTitle: {
    color: "#17231B",
    fontSize: 21,
    fontWeight: "700",
    marginBottom: 5,
  },

  sectionDescription: {
    color: "#758078",
    fontSize: 14,
    lineHeight: 20,
  },


  // ==========================================
  // STATISTICS GRID
  // ==========================================

  statsGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  statCard: {
    flexGrow: 1,
    flexBasis: 170,
    minWidth: 150,

    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,

    elevation: 2,
  },

  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EAF5EE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  statIcon: {
    fontSize: 20,
  },

  statValue: {
    color: "#17231B",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },

  statLabel: {
    color: "#737D76",
    fontSize: 13,
    fontWeight: "500",
  },


  // ==========================================
  // MANAGEMENT
  // ==========================================

  managementContainer: {
    width: "100%",
    gap: 12,
  },

  managementCard: {
    width: "100%",
    minHeight: 82,

    backgroundColor: "#FFFFFF",
    borderRadius: 17,

    paddingHorizontal: 18,
    paddingVertical: 15,

    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 2,
  },

  managementCardPressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.99,
      },
    ],
  },

  managementIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,

    backgroundColor: "#EAF5EE",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 15,
  },

  managementIconText: {
    fontSize: 21,
  },

  managementTextContainer: {
    flex: 1,
  },

  managementTitle: {
    color: "#1C2920",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  managementDescription: {
    color: "#7A837D",
    fontSize: 13,
    lineHeight: 18,
  },

  arrow: {
    color: "#2E8B57",
    fontSize: 30,
    fontWeight: "300",
    marginLeft: 10,
  },


  // ==========================================
  // FOOTER
  // ==========================================

  footer: {
    marginTop: 30,
    marginBottom: 20,

    padding: 22,

    backgroundColor: "#EAF5EE",

    borderRadius: 18,

    alignItems: "center",
  },

  footerTitle: {
    color: "#246B45",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 7,
  },

  footerText: {
    color: "#617069",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    maxWidth: 500,
  },

  footerVersion: {
    color: "#89958D",
    fontSize: 11,
    marginTop: 12,
  },

});