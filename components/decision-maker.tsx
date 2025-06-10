"use client"
import LottieView from "lottie-react-native"
import { useState } from "react"
import { Dimensions, Keyboard, Modal, ScrollView, Share, Text, TextInput, View } from "react-native"
import * as Animatable from "react-native-animatable"
import { Button, IconButton, List } from "react-native-paper"
import CategoryManager from "./category-manager"
import { styles } from "./decision-maker.styles"
import SpinningWheel from "./spinning-wheel"

const screenHeight = Dimensions.get("window").height
type Option = {
  id: number
  text: string
}

const TRUTH_OR_DARE_OPTIONS = [
  'Truth: What is your biggest fear?',
  'Truth: What is your most embarrassing moment?',
  'Truth: What is your biggest regret?',
  'Truth: What is your biggest secret?',
  'Truth: What is your biggest dream?',
  'Dare: Do your best dance move',
  'Dare: Sing a song out loud',
  'Dare: Call a friend and tell them you love them',
  'Dare: Do 10 push-ups',
  'Dare: Let someone post anything they want on your social media',
  'Dare: Let the group give you a makeover',
  'Dare: Let someone tickle you for 30 seconds'
];

export default function DecisionMaker() {
  // Option state
  const [options, setOptions] = useState<Option[]>([])
  const [newOption, setNewOption] = useState("")
  const [showCategories, setShowCategories] = useState(false)
  const [showTruthOrDare, setShowTruthOrDare] = useState(false)

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
    
    setTimeout(() => {
      setShowLottie(false)
    }, 2000)
  }

  const handleShare = async () => {
    try {
      const message = `I spun 🍥 and got ${selectedOption}! Try it: https://expo.dev/artifacts/eas/buYbKtWNYgzPBqBzJbPiDB.aab`
      await Share.share({
        message,
        title: 'My Decision from The Decider',
      })
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const handleCategorySelect = (category: { options: string[] }) => {
    const newOptions = category.options.map((text, index) => ({
      id: Date.now() + index,
      text
    }))
    setOptions(newOptions)
    setShowCategories(false)
  }

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
        🍥 <Text 
          onPress={() => {
            handleCategorySelect({ options: TRUTH_OR_DARE_OPTIONS });
          }}
          style={[styles.appTitle, { color: '#ff7f50' }]}
        >T</Text>he <Text 
          onPress={() => {
            handleCategorySelect({ options: TRUTH_OR_DARE_OPTIONS });
          }}
          style={[styles.appTitle, { color: '#ff7f50' }]}
        >D</Text>ecider
      </Animatable.Text>

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

      <View style={styles.optionsHeader}>
          <Button
            onPress={() => setShowCategories(true)}
            style={{ marginRight: 8 }}
            icon="format-list-bulleted"
          >
            Category
          </Button>
          {options.length > 0 && (
            <Button
              onPress={() => setOptions([])}
              icon="delete"
              compact
              textColor="#ff7f50"
            >
              {""}
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
          
          <Animatable.View 
            animation="fadeIn"
            iterationCount="infinite"
            direction="alternate"
            style={styles.scrollIndicator}
          >
            <Text style={styles.scrollIndicatorText}>↓ Scroll ↓</Text>
          </Animatable.View>
        </View>
      )}

      {options.length >= 2 && (
        <Animatable.View animation="fadeIn" style={styles.wheelContainer}>
          <SpinningWheel
            options={options.map((opt) => opt.text)}
            onSpinComplete={handleSpinComplete}
            spinning={isSpinning}
            setSpinning={setIsSpinning}
            onSpinStart={handleSpin}
          />
        </Animatable.View>
      )}

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

      <Modal
        visible={showCategories}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategories(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '80%' }]}>
            <CategoryManager onSelectCategory={handleCategorySelect} />
            <Button
              mode="contained"
              onPress={() => setShowCategories(false)}
              style={styles.modalButton}
            >
              Close
            </Button>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showTruthOrDare}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTruthOrDare(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Truth or Dare</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setShowTruthOrDare(false)}
              />
            </View>
            <ScrollView style={styles.modalScrollView}>
              <Button
                mode="contained"
                onPress={() => {
                  handleCategorySelect({ options: TRUTH_OR_DARE_OPTIONS });
                }}
                style={styles.modalButton}
                icon="gamepad-variant"
              >
                Use Truth or Dare Wheel
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}