import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Use any icon library like Ionicons
import useThemeContext from '../../theme/useThemeContext';
import {ThemeColors} from '../../theme/colors.ts';

const FAQItem = ({ question, answer, colors }) => {
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useState(new Animated.Value(0))[0];
  const rotateAnimation = useState(new Animated.Value(0))[0];

  const toggleAccordion = () => {
    if (expanded) {
      // Close the accordion
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setExpanded(false));

      // Rotate chevron back
      Animated.timing(rotateAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setExpanded(true);

      // Expand accordion
      Animated.timing(animatedHeight, {
        toValue: 100,
        duration: 300,
        useNativeDriver: false,
      }).start();

      // Rotate chevron 180 degrees
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  // Interpolate rotate value
  const rotateChevron = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles(colors).faqItem]}>
      <Pressable onPress={toggleAccordion} style={styles(colors).questionContainer}>
        <Text style={styles(colors).question}>{question}</Text>
        <Animated.View style={{ transform: [{ rotate: rotateChevron }] }}>
          <Icon name="chevron-down" size={20} color={colors.icon.muted} />
        </Animated.View>
      </Pressable>
      {expanded && (
        <Animated.View style={[styles(colors).answerContainer, { height: animatedHeight }]}>
          <Text style={styles(colors).answer}>{answer}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const HelpScreen = () => {
  const { colors } = useThemeContext();
  const themeStyles = styles(colors);

  const faqs = [
    { question: 'Hvordan opretter jeg en konto?', answer: 'Tryk på "Opret konto" på forsiden.' },
    { question: 'Hvordan deler jeg et opslag?', answer: 'Gå til "Netværk", find det netværk du ønsker at oprette et nyt opslag under, tryk på "+" i højre hjørne (kræver du er administrator) og tryk herefter på "Opret opslag."' },
    { question: 'Hvordan får jeg adgang til dokumenter?', answer: 'Find vigtige dokumenter under "Netværk" og under menupunktet: "Dokumenter". Alle dokumenter tildeles et projekt som herefter kan fremsøges.' },
    { question: 'Hvordan ændrer jeg mine profilindstillinger?', answer: 'Gå til "Profil" og tryk på "Rediger".' },
  ];

  return (
    <ScrollView contentContainerStyle={themeStyles.container}>
      <Text style={themeStyles.header}>Hjælp & Ofte Stillede Spørgsmål</Text>
      <Text style={themeStyles.description}>
        Her finder du svar på de mest almindelige spørgsmål.
      </Text>
      {faqs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} colors={colors} />
      ))}
    </ScrollView>
  );
};

const styles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.text.default,
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
  },
  answerContainer: {
    overflow: 'hidden',
    paddingVertical: 10,
  },
  answer: {
    fontSize: 16,
    color: colors.text.default,
    lineHeight: 22,
  },
});

export default HelpScreen;
