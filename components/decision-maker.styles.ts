// decision-maker.styles.ts
import { Dimensions, StyleSheet } from "react-native"

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
    marginBottom: 8,
  },
  headerButtons: {
    flexDirection: "row",
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
  lottieBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', 
  },
  fullScreenLottie: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
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
    marginTop: 16,
  },
  modalButtonLabel: {
    fontSize: 16,
    color: "#fff",
  },
  modalButtonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 16,
  },
  modalButtonResponsive: {
    flex: 1,
    minWidth: 120,
    margin: 4,
    borderRadius: 18,
  },
})