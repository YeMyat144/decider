import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Keyboard, Dimensions } from "react-native";
import { Button, List, IconButton } from "react-native-paper";
import * as Animatable from "react-native-animatable";

const screenHeight = Dimensions.get("window").height;

export default function DecisionMaker() {
  const [newOption, setNewOption] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleAddOption = () => {
    if (newOption.trim() !== "" && !options.includes(newOption.trim())) {
      setOptions((prev) => [...prev, newOption.trim()]);
      setNewOption("");
      Keyboard.dismiss();
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleRandomPick = () => {
    if (options.length === 0) return;
    setIsSelecting(true);
    setSelectedOption(null);

    let count = 0;
    const totalIterations = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * options.length);
      setSelectedOption(options[randomIndex]);
      count++;

      if (count >= totalIterations) {
        clearInterval(interval);
        setIsSelecting(false);
      }
    }, 100);
  };

  const handleClearOptions = () => {
    setOptions([]);
    setSelectedOption(null);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F5F7FA",
        paddingTop: screenHeight > 800 ? 40 : 20,
      }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        <Animatable.Text
          animation="fadeInDown"
          style={{
            fontSize: 32,
            fontWeight: "bold",
            textAlign: "center",
            color: "#008080",
            marginBottom: 4,
          }}
        >
          🎲 Decision Pulse
        </Animatable.Text>
        <Text
          style={{
            textAlign: "center",
            color: "#ff7f50",
            fontSize: 16,
            marginBottom: 20,
          }}
        >
          Let fate choose for you
        </Text>

        <Animatable.View animation="fadeInUp" duration={500}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <TextInput
              placeholder="Enter an option..."
              placeholderTextColor="#808080"
              value={newOption}
              onChangeText={setNewOption}
              onSubmitEditing={handleAddOption}
              style={{
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
              }}
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

        <View style={{ marginTop: 14 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16, color: "#008080" }}>
              Your Options
            </Text>
            {options.length > 0 && (
              <Button
                mode="text"
                onPress={handleClearOptions}
                icon="delete-outline"
                compact
                textColor="#ff7f50"
              >
                Clear All
              </Button>
            )}
          </View>

          <ScrollView style={{ maxHeight: screenHeight * 0.3, marginTop: 10 }}>
            {options.length === 0 ? (
              <Animatable.Text
                animation="fadeIn"
                style={{
                  textAlign: "center",
                  color: "#808080",
                  paddingVertical: 32,
                }}
              >
                No options added yet.
              </Animatable.Text>
            ) : (
              <Animatable.View animation="fadeInUp" delay={200}>
                <List.Section>
                  {options.map((option, index) => (
                    <List.Item
                      key={index}
                      title={option}
                      titleStyle={{ fontSize: 16, color: "#008080" }}
                      right={() => (
                        <IconButton
                          icon="close-circle-outline"
                          size={22}
                          onPress={() => handleRemoveOption(index)}
                          iconColor="#808080"
                        />
                      )}
                    />
                  ))}
                </List.Section>
              </Animatable.View>
            )}
          </ScrollView>

          {options.length > 3 && (
            <Animatable.Text
              animation="pulse"
              iterationCount="infinite"
              direction="alternate"
              style={{
                textAlign: "center",
                marginTop: 8,
                fontSize: 12,
                color: "#ff7f50",
              }}
            >
              ⬇ Scroll ⬇
            </Animatable.Text>
          )}
        </View>

        {selectedOption && (
          <Animatable.View
            animation="fadeInUp"
            duration={600}
            style={{
              marginTop: 32,
              padding: 15,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: "#ff7f50",
              backgroundColor: "#fff",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 34,
                fontWeight: "bold",
                color: "#ff7f50",
              }}
            >
              {selectedOption}
            </Text>
          </Animatable.View>
        )}
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 140,
          left: 20,
          right: 20,
        }}
      >
        <Animatable.View animation="fadeInUp" delay={400}>
          <Button
            mode="contained"
            onPress={handleRandomPick}
            disabled={options.length < 2 || isSelecting}
            loading={isSelecting}
            icon="dice-multiple"
            style={{
              borderRadius: 50,
              backgroundColor: "#008080",
              paddingVertical: 8,
            }}
            contentStyle={{ flexDirection: "row-reverse" }}
            labelStyle={{ fontSize: 16, color: "#fff" }}
          >
            {isSelecting ? "Deciding..." : "Make a Decision"}
          </Button>
        </Animatable.View>
      </View>
    </View>
  );
}
