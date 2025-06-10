//spinning-wheel.tsx
"use client"

import { useEffect, useRef } from "react"
import { Animated, Dimensions, Easing, Pressable, StyleSheet, View } from "react-native"
import Svg, { G, Path, Text as SvgText } from "react-native-svg"

const { width } = Dimensions.get("window")
const WHEEL_SIZE = Math.min(width - 40, 300)
const WHEEL_STROKE_WIDTH = 2
const WHEEL_RADIUS = WHEEL_SIZE / 2 - WHEEL_STROKE_WIDTH
const ANGLE_BY_SEGMENT = 360

interface SpinningWheelProps {
  options: string[]
  onSpinComplete: (selectedOption: string) => void
  spinning: boolean
  setSpinning: (spinning: boolean) => void
  onSpinStart: () => void
}

export default function SpinningWheel({ 
  options, 
  onSpinComplete, 
  spinning, 
  setSpinning,
  onSpinStart 
}: SpinningWheelProps) {
  const animatedValue = useRef(new Animated.Value(0)).current
  const angle = useRef(0)

  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#8AC926",
    "#1982C4",
    "#6A4C93",
    "#F15BB5",
    "#00BBF9",
    "#00F5D4",
  ]

  useEffect(() => {
    if (spinning) {
      // Random number of spins (3-5 full rotations) plus a random angle
      const targetAngle = 1080 + 1440 * Math.random() + Math.random() * 360
      angle.current = targetAngle

      Animated.timing(animatedValue, {
        toValue: targetAngle,
        duration: 4000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setSpinning(false)

        // Calculate which option was selected
        const normalizedAngle = targetAngle % 360
        const segmentSize = 360 / options.length
        const selectedIndex = Math.floor(normalizedAngle / segmentSize)
        const selectedOption = options[options.length - 1 - selectedIndex]

        onSpinComplete(selectedOption)
      })
    }
  }, [spinning])

  const createWheel = () => {
    if (options.length === 0) return null

    const segmentAngle = ANGLE_BY_SEGMENT / options.length
    const segments = options.map((option, index) => {
      const angle = index * segmentAngle
      return {
        option,
        angle,
        color: colors[index % colors.length],
      }
    })

    return segments.map((segment, index) => {
      const startAngle = (segment.angle * Math.PI) / 180
      const endAngle = ((segment.angle + segmentAngle) * Math.PI) / 180

      // Calculate path for the segment
      const x1 = WHEEL_RADIUS + WHEEL_RADIUS * Math.cos(startAngle)
      const y1 = WHEEL_RADIUS + WHEEL_RADIUS * Math.sin(startAngle)
      const x2 = WHEEL_RADIUS + WHEEL_RADIUS * Math.cos(endAngle)
      const y2 = WHEEL_RADIUS + WHEEL_RADIUS * Math.sin(endAngle)

      const largeArcFlag = segmentAngle > 180 ? 1 : 0

      const pathData = [
        `M ${WHEEL_RADIUS} ${WHEEL_RADIUS}`,
        `L ${x1} ${y1}`,
        `A ${WHEEL_RADIUS} ${WHEEL_RADIUS} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        "Z",
      ].join(" ")

      // Calculate text position
      const textAngle = segment.angle + segmentAngle / 2
      const textRadius = WHEEL_RADIUS * 0.65
      const textX = WHEEL_RADIUS + textRadius * Math.cos((textAngle * Math.PI) / 180)
      const textY = WHEEL_RADIUS + textRadius * Math.sin((textAngle * Math.PI) / 180)

      return (
        <G key={index}>
          <Path d={pathData} fill={segment.color} stroke="#FFFFFF" strokeWidth={WHEEL_STROKE_WIDTH} />
          <SvgText
            x={textX}
            y={textY}
            fill="#FFFFFF"
            fontSize={Math.min(20, 150 / options.length)}
            fontWeight="bold"
            textAnchor="middle"
            rotation={textAngle + 90}
            originX={textX}
            originY={textY}
          >
            {segment.option.length > 10 ? segment.option.substring(0, 10) + "..." : segment.option}
          </SvgText>
        </G>
      )
    })
  }

  return (
    <Pressable 
      onPress={() => !spinning && onSpinStart()}
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.8 }
      ]}
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.wheelContainer,
            {
              transform: [
                {
                  rotate: animatedValue.interpolate({
                    inputRange: [0, 360],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Svg height={WHEEL_SIZE} width={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
            {createWheel()}
          </Svg>
        </Animated.View>

        <View style={styles.pointer} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginVertical: 20,
  },
  wheelContainer: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderRadius: WHEEL_SIZE / 2,
    overflow: "hidden",
  },
pointer: {
  position: "absolute",
  right: -15, 
  top: WHEEL_SIZE / 2 - 15, // center vertically
  width: 0,
  height: 0,
  borderTopWidth: 15,
  borderBottomWidth: 15,
  borderRightWidth: 30, // make it right-pointing
  borderTopColor: "transparent",
  borderBottomColor: "transparent",
  borderRightColor: "#FF5722", // point inward
  zIndex: 10,
},
})