"use client"

import { useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import SpinningWheel from "./spinning-wheel"

const TRUTH_QUESTIONS = [
  "What's the most embarrassing thing you've done in public?",
  "What's your biggest regret?",
  "What's the biggest lie you've ever told?",
  "What's your biggest fear?",
  "What's the most trouble you've ever been in?",
]

const DARE_QUESTIONS = [
  "Do your best dance move right now",
  "Let the group post anything they want on your social media",
  "Call your mom and tell her you're getting married",
  "Let someone in the group go through your phone for 1 minute",
  "Do 10 push-ups right now",
]

export default function TruthOrDare() {
  const [spinning, setSpinning] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [gameMode, setGameMode] = useState<"truth" | "dare" | null>(null)

  const handleSpinComplete = (option: string) => {
    setSelectedOption(option)
    if (option === "Truth") {
      const randomTruth = TRUTH_QUESTIONS[Math.floor(Math.random() * TRUTH_QUESTIONS.length)]
      setSelectedQuestion(randomTruth)
      setGameMode("truth")
    } else {
      const randomDare = DARE_QUESTIONS[Math.floor(Math.random() * DARE_QUESTIONS.length)]
      setSelectedQuestion(randomDare)
      setGameMode("dare")
    }
  }

  const handleSpinStart = () => {
    setSelectedOption(null)
    setSelectedQuestion(null)
    setGameMode(null)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Truth or Dare</Text>
      
      <SpinningWheel
        options={["Truth", "Dare"]}
        onSpinComplete={handleSpinComplete}
        spinning={spinning}
        setSpinning={setSpinning}
        onSpinStart={handleSpinStart}
      />

      {selectedQuestion && (
        <View style={styles.questionContainer}>
          <Text style={styles.questionLabel}>
            {gameMode === "truth" ? "Truth:" : "Dare:"}
          </Text>
          <Text style={styles.question}>{selectedQuestion}</Text>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.spinButton,
          pressed && styles.spinButtonPressed,
        ]}
        onPress={() => !spinning && setSpinning(true)}
      >
        <Text style={styles.spinButtonText}>
          {spinning ? "Spinning..." : "Spin the Wheel"}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(245, 245, 245, 0.8)",
    backdropFilter: "blur(10px)",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  questionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  questionLabel: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  question: {
    fontSize: 18,
    color: "#666",
    lineHeight: 24,
  },
  spinButton: {
    backgroundColor: "rgba(76, 175, 80, 0.8)",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spinButtonPressed: {
    opacity: 0.8,
  },
  spinButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
}) 