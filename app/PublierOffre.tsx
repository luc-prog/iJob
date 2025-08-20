import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function PublishScreen() {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    category: '',
    description: '',
    skills: '',
    location: '',
    date: new Date(),
    budget: '',
    image: null as string | null,
    showDatePicker: false,
  });

  const publicationTypes = [
    { id: 'job_offer', label: 'Offre d\'emploi' },
    { id: 'service_offer', label: 'Service proposé' },
    { id: 'job_request', label: 'Demande d\'emploi' },
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
    }
  };

  const handlePublish = () => {
    console.log(formData);
    // TODO: save to Firebase or API
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || formData.date;
    setFormData({
      ...formData,
      showDatePicker: Platform.OS === 'ios',
      date: currentDate,
    });
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <ThemedView style={styles.formContainer}>
        <ThemedText type="title" style={styles.title}>Publier une annonce</ThemedText>

        <ThemedText style={styles.label}>Titre de l'annonce*</ThemedText>
        <TextInput
          placeholder="Ex: Développeur React Native expérimenté"
          style={styles.input}
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />

        <ThemedText style={styles.label}>Type de publication*</ThemedText>
        <View style={styles.typeContainer}>
          {publicationTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeButton,
                formData.type === type.id && styles.typeButtonSelected
              ]}
              onPress={() => setFormData({ ...formData, type: type.id })}
            >
              <ThemedText style={formData.type === type.id ? styles.typeButtonTextSelected : styles.typeButtonText}>
                {type.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <ThemedText style={styles.label}>Catégorie*</ThemedText>
        <TextInput
          placeholder="Ex: Informatique, BTP, Restauration..."
          style={styles.input}
          value={formData.category}
          onChangeText={(text) => setFormData({ ...formData, category: text })}
        />

        <ThemedText style={styles.label}>Description détaillée*</ThemedText>
        <TextInput
          placeholder="Décrivez en détail votre annonce..."
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
        />

        <ThemedText style={styles.label}>Compétences requises</ThemedText>
        <TextInput
          placeholder="Ex: React Native, Python, Gestion de projet..."
          style={styles.input}
          value={formData.skills}
          onChangeText={(text) => setFormData({ ...formData, skills: text })}
        />

        <ThemedText style={styles.label}>Lieu*</ThemedText>
        <TextInput
          placeholder="Ex: Kinshasa, Gombe"
          style={styles.input}
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
        />

        <ThemedText style={styles.label}>Date de disponibilité*</ThemedText>
        <TouchableOpacity 
          style={styles.input} 
          onPress={() => setFormData({ ...formData, showDatePicker: true })}
        >
          <ThemedText>{formData.date.toLocaleDateString()}</ThemedText>
        </TouchableOpacity>
        {formData.showDatePicker && (
          <DateTimePicker
            value={formData.date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <ThemedText style={styles.label}>Budget ou salaire proposé</ThemedText>
        <TextInput
          placeholder="Ex: 500$ par mois ou 50$ par jour"
          style={styles.input}
          value={formData.budget}
          onChangeText={(text) => setFormData({ ...formData, budget: text })}
          keyboardType="numeric"
        />

        <ThemedText style={styles.label}>Image (optionnelle)</ThemedText>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color="#4a90e2" />
          <ThemedText style={styles.imageButtonText}>Ajouter une image</ThemedText>
        </TouchableOpacity>
        {formData.image && (
          <Image
            source={{ uri: formData.image }}
            style={styles.imagePreview}
            contentFit="cover"
          />
        )}

        <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
          <ThemedText style={styles.publishButtonText}>Publier l'annonce</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 15,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  typeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  typeButtonSelected: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  typeButtonText: {
    color: '#333',
  },
  typeButtonTextSelected: {
    color: '#fff',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#4a90e2',
    borderRadius: 8,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  imageButtonText: {
    color: '#4a90e2',
    marginLeft: 10,
    fontWeight: '500',
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 16,
  },
  publishButton: {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  publishButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});