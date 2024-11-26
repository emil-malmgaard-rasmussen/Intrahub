import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import useThemeContext from '../../theme/useThemeContext.ts';
import {ThemeColors} from '../../theme/colors.ts';

const AboutScreen = () => {
  const {colors} = useThemeContext();
  const themeStyles = styles(colors);

  return (
    <ScrollView contentContainerStyle={themeStyles.container}>
      <Text style={themeStyles.header}>Om Appen</Text>
      <Text style={themeStyles.description}>
        Velkommen til vores app, der er skabt for at forbedre kommunikationen og
        samarbejdet på tværs af virksomheder og netværk. Vores mål er at tilbyde
        en enkel og effektiv platform til deling af opslag, aktiviteter,
        dokumenter som APV’er og manualer, så alle kan holde sig opdaterede og
        organiserede.
      </Text>

      <Text style={themeStyles.subHeader}>Funktioner</Text>
      <Text style={themeStyles.description}>
        - Opslag: Del og læs nyheder, opdateringer og meddelelser fra netværket.
      </Text>
      <Text style={themeStyles.description}>
        - Aktiviteter: Planlæg og deltag i aktiviteter på tværs af teams.
      </Text>
      <Text style={themeStyles.description}>
        - Dokumenthåndtering: Opbevar og organiser vigtige dokumenter ét sted.
      </Text>

      <Text style={themeStyles.subHeader}>Vores Mission</Text>
      <Text style={themeStyles.description}>
        Vi stræber efter at skabe en brugervenlig platform, der hjælper
        virksomheder med at forbedre informationsdeling og skabe en
        sammenhængende arbejdsoplevelse.
      </Text>

      <Text style={themeStyles.subHeader}>Kontakt Os</Text>
      <Text style={themeStyles.description}>
        Hvis du har spørgsmål, feedback, eller forslag til forbedringer, så
        kontakt os endelig. Vi værdsætter din mening og ser frem til at høre fra
        dig!
      </Text>
    </ScrollView>
  );
};

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 12,
      color: colors.header.main,
    },
    subHeader: {
      fontSize: 18,
      fontWeight: '600',
      marginVertical: 10,
      color: colors.header.main,
    },
    description: {
      fontSize: 16,
      color: '#333',
      lineHeight: 24,
    },
  });

export default AboutScreen;
