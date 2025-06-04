// decision-maker.styles.ts
import { StyleSheet, Dimensions } from "react-native"

const screenHeight = Dimensions.get("window").height

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 24,
    paddingTop: 60
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#008080",
    marginBottom: 10,
  },
  appSubtitle: {
    textAlign: "center",
    color: "#ff7f50",
    fontSize: 16,
    marginBottom: 20,
  },
  optionInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  scrollContainer: {
  position: 'relative',
},
scrollIndicator: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  paddingVertical: 8,
  backgroundColor: 'rgba(245, 247, 250, 0.8)',
  alignItems: 'center',
},
scrollIndicatorText: {
  color: '#808080',
  fontSize: 10,
  fontWeight: 'bold',
},
  optionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#808080",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginRight: 8,
    color: "#000",
  },
  optionsSection: {
    marginTop: 4,
  },
  optionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#008080",
  },
  optionsList: {
    maxHeight: screenHeight * 0.2,
    marginTop: 1,
  },
  optionText: {
    fontSize: 16,
    color: "#008080",
  },
  emptyOptionsText: {
    textAlign: "center",
    color: "#808080",
    paddingVertical: 32,
  },
  wheelContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  clickToSpinText: {
    fontSize: 18,
    color: "#008080",
    marginBottom: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 2,
  },
  modalResultText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#ff7f50',
    marginVertical: 20,
    textAlign: 'center',
  },
  modalButton: {
    borderRadius: 8,
    backgroundColor: "#008080",
    paddingVertical: 5,
    width: '100%',
  },
  modalButtonLabel: {
    fontSize: 16,
    color: "#fff",
  },
})