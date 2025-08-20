import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

const Bourse = () => {
  return (
    <ThemedView style={styles.container}>
      <Text>Écran de recherche d'emploi</Text>
      {/* Ajoutez vos filtres et résultats ici */}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default Bourse;