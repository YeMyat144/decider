"use client"
import LottieView from "lottie-react-native"
import { useState } from "react"
import { Dimensions, Keyboard, Modal, ScrollView, Share, Text, TextInput, View } from "react-native"
import * as Animatable from "react-native-animatable"
import { Button, IconButton, List } from "react-native-paper"
import { styles } from "./decision-maker.styles"
import SpinningWheel from "./spinning-wheel"

const screenHeight = Dimensions.get("window").height
type Option = {
  id: number
  text: string
}

export default function DecisionMaker() {
  // Option state
  const [options, setOptions] = useState<Option[]>([])
  const [newOption, setNewOption] = useState("")

  // Decision state
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [showLottie, setShowLottie] = useState(false)

  const handleAddOption = () => {
    if (newOption.trim() === "") return

    const newOptionItem = {
      id: Date.now(), 
      text: newOption.trim()
    }
    
    setOptions([...options, newOptionItem])
    setNewOption("")
    Keyboard.dismiss()
  }

  const handleRemoveOption = (id: number) => {
    setOptions(options.filter((opt) => opt.id !== id))
  }

  const handleSpin = () => {
    if (options.length < 2) return
    setIsSpinning(true)
    setSelectedOption(null)
    setShowResult(false)
  }

  const handleSpinComplete = (selectedOptionText: string) => {
    setSelectedOption(selectedOptionText)
    setIsSpinning(false)
    setShowLottie(true)
    setShowResult(true)
    
    // Hide Lottie after animation duration
    setTimeout(() => {
      setShowLottie(false)
    }, 2000) // Adjust this duration to match your Lottie animation length
  }

  const handleShare = async () => {
    try {
      const message = `The Decider chose: ${selectedOption} 🍥`;
      await Share.share({
        message,
        title: 'My Decision from The Decider',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={[styles.container, { padding: 24, paddingTop: 60 }]}>
      {showLottie && (
        <View style={styles.lottieBackground}>
          <LottieView
            source={require('@/assets/lottie.json')}
            autoPlay
            loop={false}
            style={styles.fullScreenLottie}
          />
        </View>
      )}

      <Animatable.Text animation="fadeInDown" style={styles.appTitle}>
        🍥 The Decider
      </Animatable.Text>

        {/* Options Input */}
        <Animatable.View animation="fadeInUp" duration={500}>
          <View style={styles.optionInputContainer}>
            <TextInput
              placeholder="Enter an option..."
              placeholderTextColor="#808080"
              value={newOption}
              onChangeText={setNewOption}
              onSubmitEditing={handleAddOption}
              style={styles.optionInput}
            />
            <IconButton
              icon="plus-circle"
              onPress={handleAddOption}
              disabled={newOption.trim() === ""}
              size={30}
              iconColor="#ff7f50"
            />
          </View>
        </Animatable.View>

        {/* Options List */}
        <View style={styles.optionsSection}>
          <View style={styles.optionsHeader}>
            <Text style={styles.sectionTitle}>Your Options</Text>
            {options.length > 0 && (
              <Button mode="text" onPress={() => setOptions([])} icon="delete-outline" compact textColor="#ff7f50">
                Clear All
              </Button>
            )}
          </View>

          {options.length === 0 ? (
            <Animatable.Text animation="fadeIn" style={styles.emptyOptionsText}>
              No options added yet.
            </Animatable.Text>
          ) : (
            <View style={styles.scrollContainer}>
              <ScrollView 
                style={styles.optionsList}
                showsVerticalScrollIndicator={false}
              >
                <Animatable.View animation="fadeInUp" delay={200}>
                  <List.Section>
                    {options.map((option) => (
                      <List.Item
                        key={option.id}
                        title={option.text}
                        titleStyle={styles.optionText}
                        right={() => (
                          <IconButton
                            icon="close-circle-outline"
                            size={22}
                            onPress={() => handleRemoveOption(option.id)}
                            iconColor="#808080"
                          />
                        )}
                      />
                    ))}
                  </List.Section>
                </Animatable.View>
              </ScrollView>
              {options.length > 2 && (
                <Animatable.View 
                  animation="fadeIn"
                  iterationCount="infinite"
                  direction="alternate"
                  style={styles.scrollIndicator}
                >
                  <Text style={styles.scrollIndicatorText}>↓ Scroll ↓</Text>
                </Animatable.View>
              )}
            </View>
          )}
        </View>

        {/* Spinning Wheel */}
        {options.length >= 2 && (
          <Animatable.View animation="fadeIn" style={styles.wheelContainer}>
            <Text style={styles.clickToSpinText}>
              {isSpinning ? "Spinning..." : "Click the wheel to spin!"}
            </Text>
            <SpinningWheel
              options={options.map((opt) => opt.text)}
              onSpinComplete={handleSpinComplete}
              spinning={isSpinning}
              setSpinning={setIsSpinning}
              onSpinStart={handleSpin}
            />
          </Animatable.View>
        )}

        {/* Result Modal */}
      <Modal
        visible={showResult}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowResult(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View 
            animation="bounceIn" 
            duration={600}
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>Result</Text>
            <Text style={styles.modalResultText}>{selectedOption}</Text>
            <View style={styles.modalButtonContainer}>
              <Button
                mode="contained"
                onPress={handleShare}
                style={styles.modalButtonResponsive}
                labelStyle={styles.modalButtonLabel}
                icon="share"
              >
                Share
              </Button>
              <Button
                mode="contained"
                onPress={() => setShowResult(false)}
                style={styles.modalButtonResponsive}
                labelStyle={styles.modalButtonLabel}
              >
                Close
              </Button>
            </View>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  )
}