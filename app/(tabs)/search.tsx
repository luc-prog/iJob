import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View, 
  TouchableOpacity, 
  Platform, 
  ScrollView, 
  Modal,
  Pressable,
  FlatList
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import MapView, { Marker } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SearchScreen() {
  // États pour les filtres
  const [profileType, setProfileType] = useState<string>('');
  const [jobCategory, setJobCategory] = useState<string>('');
  const [location, setLocation] = useState({
    country: '',
    region: '',
    city: '',
    neighborhood: '',
    radius: 5
  });
  const [availability, setAvailability] = useState<string[]>([]);
  const [experience, setExperience] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [gender, setGender] = useState<string>('');
  const [languages, setLanguages] = useState<string[]>([]);
  
  // États pour les fonctionnalités avancées
  const [showMap, setShowMap] = useState(false);
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Options pour les dropdowns
  const profileTypes = [
    { id: 'employee', label: 'Employé' },
    { id: 'employer', label: 'Employeur' },
    { id: 'service_provider', label: 'Prestataire de service' },
    { id: 'agency', label: 'Agence ou entreprise' },
  ];
  
  const jobCategories = [
    'Bâtiment, électricité, plomberie',
    'Informatique / digital',
    'Nettoyage',
    'Coiffure / Esthétique',
    'Transport / Livraison',
    'Santé',
    'Garde d\'enfants / Assistance à domicile',
    'Autres'
  ];
  
  const availabilityOptions = [
    'Disponible maintenant',
    'Disponible aujourd\'hui',
    'Libre les week-ends',
    'À plein temps',
    'À temps partiel'
  ];
  
  const experienceLevels = [
    '0 à 1 an',
    '1 à 3 ans',
    '3 à 5 ans',
    '5 ans et plus'
  ];
  
  const languagesList = [
    'Français',
    'Anglais',
    'Lingala',
    'Swahili',
    'Tshiluba'
  ];
  
  // Fonction pour activer la recherche vocale
  const startVoiceSearch = () => {
    setVoiceSearchActive(true);
    // Ici vous intégreriez l'API de reconnaissance vocale
    // Pour l'exemple, nous simulons un résultat après 2 secondes
    setTimeout(() => {
      setVoiceSearchActive(false);
      setJobCategory('Bâtiment, électricité, plomberie');
      setLocation({
        ...location,
        city: 'Gombe'
      });
      setAvailability(['Libre les week-ends']);
    }, 2000);
  };
  
  // Fonction pour basculer la sélection d'une option de disponibilité
  const toggleAvailability = (option: string) => {
    if (availability.includes(option)) {
      setAvailability(availability.filter(item => item !== option));
    } else {
      setAvailability([...availability, option]);
    }
  };
  
  // Fonction pour basculer la sélection d'une langue
  const toggleLanguage = (language: string) => {
    if (languages.includes(language)) {
      setLanguages(languages.filter(item => item !== language));
    } else {
      setLanguages([...languages, language]);
    }
  };
  
  // Fonction pour réinitialiser tous les filtres
  const resetFilters = () => {
    setProfileType('');
    setJobCategory('');
    setLocation({
      country: '',
      region: '',
      city: '',
      neighborhood: '',
      radius: 5
    });
    setAvailability([]);
    setExperience('');
    setPriceRange([0, 1000]);
    setGender('');
    setLanguages([]);
  };
  
  return (
    <ThemedView style={styles.container}>
      {/* Barre de recherche principale */}
      <View style={styles.searchBarContainer}>
        <TextInput
          placeholder="Rechercher un service, un métier..."
          style={styles.searchInput}
        />
        <TouchableOpacity 
          style={styles.voiceSearchButton}
          onPress={startVoiceSearch}
        >
          <Ionicons 
            name={voiceSearchActive ? "mic" : "mic-outline"} 
            size={24} 
            color={voiceSearchActive ? "#FF0000" : "#4a90e2"} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons 
            name="filter" 
            size={24} 
            color={showFilters ? "#4a90e2" : "#666"} 
          />
        </TouchableOpacity>
      </View>
      
      {voiceSearchActive && (
        <View style={styles.voiceSearchIndicator}>
          <ThemedText>Parlez maintenant...</ThemedText>
        </View>
      )}
      
      {/* Boutons de vue rapide */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.quickFiltersContainer}
      >
        <TouchableOpacity style={styles.quickFilter}>
          <ThemedText>Urgent</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickFilter}>
          <ThemedText>À proximité</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickFilter}>
          <ThemedText>4+ étoiles</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickFilter}>
          <ThemedText>Vérifiés</ThemedText>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Toggle entre carte et liste */}
      <View style={styles.viewToggle}>
        <TouchableOpacity 
          style={[styles.viewToggleButton, !showMap && styles.viewToggleButtonActive]}
          onPress={() => setShowMap(false)}
        >
          <ThemedText>Liste</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.viewToggleButton, showMap && styles.viewToggleButtonActive]}
          onPress={() => setShowMap(true)}
        >
          <ThemedText>Carte</ThemedText>
        </TouchableOpacity>
      </View>
      
      {/* Contenu principal - Carte ou Liste */}
      {showMap ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: -4.322447,
              longitude: 15.307045,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{ latitude: -4.322447, longitude: 15.307045 }}
              title="Exemple de prestataire"
              description="Électricien disponible"
            />
          </MapView>
        </View>
      ) : (
        <FlatList
          data={[1, 2, 3, 4, 5]} // Données factices pour l'exemple
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <View style={styles.resultImage} />
              <View style={styles.resultDetails}>
                <ThemedText style={styles.resultTitle}>Électricien professionnel</ThemedText>
                <ThemedText style={styles.resultSubtitle}>Bâtiment, électricité, plomberie</ThemedText>
                <ThemedText style={styles.resultLocation}>Gombe, Kinshasa</ThemedText>
                <View style={styles.resultRating}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <ThemedText style={styles.ratingText}>4.8 (24 avis)</ThemedText>
                </View>
                <ThemedText style={styles.resultPrice}>25$/heure</ThemedText>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={styles.resultsList}
        />
      )}
      
      {/* Modal des filtres avancés */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showFilters}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText type="title" style={styles.modalTitle}>Filtres avancés</ThemedText>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.filtersContainer}>
            {/* Type de profil */}
            <View style={styles.filterSection}>
              <ThemedText style={styles.filterSectionTitle}>Type de profil</ThemedText>
              <View style={styles.radioGroup}>
                {profileTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.radioButton,
                      profileType === type.id && styles.radioButtonSelected
                    ]}
                    onPress={() => setProfileType(type.id)}
                  >
                    <View style={[
                      styles.radioCircle,
                      profileType === type.id && styles.radioCircleSelected
                    ]}>
                      {profileType === type.id && <View style={styles.radioInnerCircle} />}
                    </View>
                    <ThemedText style={styles.radioLabel}>{type.label}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Catégorie de métier/service */}
            <View style={styles.filterSection}>
              <ThemedText style={styles.filterSectionTitle}>Catégorie de métier/service</ThemedText>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={jobCategory}
                  onValueChange={(itemValue) => setJobCategory(itemValue)}
                >
                  <Picker.Item label="Sélectionnez une catégorie" value="" />
                  {jobCategories.map((category, index) => (
                    <Picker.Item key={index} label={category} value={category} />
                  ))}
                </Picker>
              </View>
            </View>
            
            {/* Localisation géographique */}
            <View style={styles.filterSection}>
              <ThemedText style={styles.filterSectionTitle}>Localisation géographique</ThemedText>
              <TextInput
                placeholder="Pays"
                style={styles.input}
                value={location.country}
                onChangeText={(text) => setLocation({...location, country: text})}
              />
              <TextInput
                placeholder="Province/Région"
                style={styles.input}
                value={location.region}
                onChangeText={(text) => setLocation({...location, region: text})}
              />
              <TextInput
                placeholder="Ville/Commune"
                style={styles.input}
                value={location.city}
                onChangeText={(text) => setLocation({...location, city: text})}
              />
              <TextInput
                placeholder="Quartier exact"
                style={styles.input}
                value={location.neighborhood}
                onChangeText={(text) => setLocation({...location, neighborhood: text})}
              />
              <View style={styles.radiusContainer}>
                <ThemedText>Rayon de distance: {location.radius} km</ThemedText>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={50}
                  step={1}
                  value={location.radius}
                  onValueChange={(value) => setLocation({...location, radius: value})}
                  minimumTrackTintColor="#4a90e2"
                  maximumTrackTintColor="#ddd"
                  thumbTintColor="#4a90e2"
                />
              </View>
            </View>
            
            {/* Disponibilité */}
            <View style={styles.filterSection}>
              <ThemedText style={styles.filterSectionTitle}>Disponibilité</ThemedText>
              <View style={styles.checkboxGroup}>
                {availabilityOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.checkboxContainer}
                    onPress={() => toggleAvailability(option)}
                  >
                    <View style={[
                      styles.checkbox,
                      availability.includes(option) && styles.checkboxSelected
                    ]}>
                      {availability.includes(option) && (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      )}
                    </View>
                    <ThemedText style={styles.checkboxLabel}>{option}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#4a90e2" />
                <ThemedText style={styles.datePickerButtonText}>
                  {selectedDate.toLocaleDateString()}
                </ThemedText>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) setSelectedDate(date);
                  }}
                />
              )}
            </View>
            
            {/* Expérience */}
            <View style={styles.filterSection}>
              <ThemedText style={styles.filterSectionTitle}>Expérience</ThemedText>
              <View style={styles.radioGroup}>
                {experienceLevels.map((level, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.radioButton,
                      experience === level && styles.radioButtonSelected
                    ]}
                    onPress={() => setExperience(level)}
                  >
                    <View style={[
                      styles.radioCircle,
                      experience === level && styles.radioCircleSelected
                    ]}>
                      {experience === level && <View style={styles.radioInnerCircle} />}
                    </View>
                    <ThemedText style={styles.radioLabel}>{level}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Tarif/Salaire */}
            <View style={styles.filterSection}>
              <ThemedText style={styles.filterSectionTitle}>Tarif/Salaire souhaité</ThemedText>
              <View style={styles.priceRangeContainer}>
                <ThemedText>{priceRange[0]} $</ThemedText>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={5000}
                  step={100}
                  value={priceRange[1]}
                  onValueChange={(value) => setPriceRange([priceRange[0], value])}
                  minimumTrackTintColor="#4a90e2"
                  maximumTrackTintColor="#ddd"
                  thumbTintColor="#4a90e2"
                />
                <ThemedText>{priceRange[1]} $</ThemedText>
              </View>
              <View style={styles.priceTypeContainer}>
                <ThemedText>Par:</ThemedText>
                <TouchableOpacity style={styles.priceTypeButton}>
                  <ThemedText>Heure</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.priceTypeButton}>
                  <ThemedText>Jour</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.priceTypeButton}>
                  <ThemedText>Mois</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Genre */}
            <View style={styles.filterSection}>
              <ThemedText style={styles.filterSectionTitle}>Genre</ThemedText>
              <View style={styles.radioGroupHorizontal}>
                <TouchableOpacity
                  style={[
                    styles.radioButtonHorizontal,
                    gender === 'male' && styles.radioButtonSelected
                  ]}
                  onPress={() => setGender('male')}
                >
                  <ThemedText>Homme</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButtonHorizontal,
                    gender === 'female' && styles.radioButtonSelected
                  ]}
                  onPress={() => setGender('female')}
                >
                  <ThemedText>Femme</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButtonHorizontal,
                    gender === 'any' && styles.radioButtonSelected
                  ]}
                  onPress={() => setGender('any')}
                >
                  <ThemedText>Peu importe</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Langues parlées */}
            <View style={styles.filterSection}>
              <ThemedText style={styles.filterSectionTitle}>Langues parlées</ThemedText>
              <View style={styles.checkboxGroup}>
                {languagesList.map((language, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.checkboxContainer}
                    onPress={() => toggleLanguage(language)}
                  >
                    <View style={[
                      styles.checkbox,
                      languages.includes(language) && styles.checkboxSelected
                    ]}>
                      {languages.includes(language) && (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      )}
                    </View>
                    <ThemedText style={styles.checkboxLabel}>{language}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Boutons d'action */}
            <View style={styles.filterActions}>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={resetFilters}
              >
                <ThemedText style={styles.resetButtonText}>Réinitialiser</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
              >
                <ThemedText style={styles.applyButtonText}>Appliquer les filtres</ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  voiceSearchButton: {
    padding: 8,
    marginLeft: 8,
  },
  filterButton: {
    padding: 8,
    marginLeft: 8,
  },
  voiceSearchIndicator: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  quickFiltersContainer: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
  },
  quickFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  viewToggle: {
    flexDirection: 'row',
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  viewToggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  viewToggleButtonActive: {
    backgroundColor: '#4a90e2',
  },
  mapContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  resultsList: {
    padding: 10,
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  resultImage: {
    width: 80,
    height: 80,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginRight: 10,
  },
  resultDetails: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  resultLocation: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  resultRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 13,
    marginLeft: 4,
  },
  resultPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filtersContainer: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  radioGroup: {
    gap: 12,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonSelected: {},
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioCircleSelected: {
    borderColor: '#4a90e2',
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4a90e2',
  },
  radioLabel: {
    fontSize: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  radiusContainer: {
    marginTop: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  checkboxGroup: {
    gap: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxSelected: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  checkboxLabel: {
    fontSize: 15,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 12,
  },
  datePickerButtonText: {
    marginLeft: 8,
    fontSize: 15,
  },
  radioGroupHorizontal: {
    flexDirection: 'row',
    gap: 8,
  },
  radioButtonHorizontal: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  priceTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  resetButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#4a90e2',
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  resetButtonText: {
    color: '#4a90e2',
    fontWeight: 'bold',
  },
  applyButton: {
    padding: 16,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});