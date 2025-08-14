import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Image
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Chip } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';

// Définition des types
type ProfileScreenRouteParams = {
  userType?: 'employee' | 'employer';
};

type ProfileScreenProps = {
  route: RouteProp<{ params: ProfileScreenRouteParams }>;
};

export default function ProfileScreen({ route }: ProfileScreenProps) {
  const { userType } = route?.params || { userType: 'employee' };
  const isEmployer = userType === 'employer';
  
  // États du profil
  const [profile, setProfile] = useState({
    name: isEmployer ? "Entreprise XYZ" : "Jean Dupont",
    email: "contact@example.com",
    phone: "+243 81 234 5678",
    address: "123 Avenue de la Paix, Gombe, Kinshasa",
    bio: isEmployer 
      ? "Entreprise spécialisée dans les services informatiques depuis 2010" 
      : "Électricien professionnel avec 5 ans d'expérience",
    skills: isEmployer 
      ? ["Informatique", "Développement", "Réseaux"] 
      : ["Électricité", "Plomberie", "Climatisation"],
    availability: "Disponible",
    jobType: isEmployer ? ["Temps plein", "Freelance"] : ["Temps plein"],
    rating: 4.7,
    reviews: 24
  });
  
  // États pour l'édition
  const [editing, setEditing] = useState(false);
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Section Photo de profil et infos basiques */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={isEmployer 
                ? require('@/assets/images/icon.png') 
                : require('@/assets/images/icon.png')} 
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editPhotoButton}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.basicInfo}>
            <ThemedText type="title">{profile.name}</ThemedText>
            <ThemedText style={styles.subtitle}>
              {isEmployer ? "Entreprise de services" : "Professionnel indépendant"}
            </ThemedText>
            
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <ThemedText style={styles.ratingText}>
                {profile.rating} ({profile.reviews} avis)
              </ThemedText>
            </View>
          </View>
        </View>
        
        {/* Boutons d'action */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => console.log("Contact")}
          >
            <Ionicons name="chatbubble-ellipses" size={18} color="#fff" />
            <ThemedText style={styles.buttonText}>Contacter</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => console.log("Favoris")}
          >
            <Ionicons name={true ? "heart" : "heart-outline"} size={18} color="#4a90e2" />
          </TouchableOpacity>
        </View>
        
        {/* Section Informations */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Informations</ThemedText>
          
          <View style={styles.infoItem}>
            <Ionicons name="mail" size={20} color="#4a90e2" style={styles.infoIcon} />
            <ThemedText style={styles.infoText}>{profile.email}</ThemedText>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="call" size={20} color="#4a90e2" style={styles.infoIcon} />
            <ThemedText style={styles.infoText}>{profile.phone}</ThemedText>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="location" size={20} color="#4a90e2" style={styles.infoIcon} />
            <ThemedText style={styles.infoText}>{profile.address}</ThemedText>
          </View>
          
          {!isEmployer && (
            <View style={styles.infoItem}>
              <Ionicons name="time" size={20} color="#4a90e2" style={styles.infoIcon} />
              <ThemedText style={styles.infoText}>{profile.availability}</ThemedText>
            </View>
          )}
        </View>
        
        {/* Section Bio/Présentation */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {isEmployer ? "À propos de l'entreprise" : "Présentation"}
          </ThemedText>
          <ThemedText style={styles.bioText}>{profile.bio}</ThemedText>
        </View>
        
        {/* Section Compétences/Secteurs */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {isEmployer ? "Secteurs d'activité" : "Compétences"}
          </ThemedText>
          <View style={styles.chipsContainer}>
            {profile.skills.map((skill, index) => (
              <Chip key={index} style={styles.chip} textStyle={styles.chipText}>
                {skill}
              </Chip>
            ))}
          </View>
        </View>
        
        {/* Section Type de poste */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {isEmployer ? "Types de postes proposés" : "Type de poste recherché"}
          </ThemedText>
          <View style={styles.chipsContainer}>
            {profile.jobType.map((type, index) => (
              <Chip key={index} style={styles.chip} textStyle={styles.chipText}>
                {type}
              </Chip>
            ))}
          </View>
        </View>
        
        {/* Section CV/Portfolio (employé seulement) */}
        {!isEmployer && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>CV/Portfolio</ThemedText>
            <TouchableOpacity style={styles.documentButton}>
              <Ionicons name="document-text" size={24} color="#4a90e2" />
              <ThemedText style={styles.documentText}>Mon_CV.pdf</ThemedText>
              <Ionicons name="download" size={20} color="#4a90e2" />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Section Localisation */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Localisation</ThemedText>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: -4.322447,
                longitude: 15.307045,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{ latitude: -4.322447, longitude: 15.307045 }}
                title={isEmployer ? "Siège de l'entreprise" : "Adresse professionnelle"}
              />
            </MapView>
          </View>
        </View>
        
        {/* Section Avis */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Avis</ThemedText>
            <TouchableOpacity onPress={() => console.log("Voir tous")}>
              <ThemedText style={styles.seeAll}>Voir tous</ThemedText>
            </TouchableOpacity>
          </View>
          
          {/* Exemple d'avis */}
          <View style={styles.reviewItem}>
            <Image 
              source={require('@/assets/images/icon.png')} 
              style={styles.reviewAvatar}
            />
            <View style={styles.reviewContent}>
              <ThemedText style={styles.reviewName}>Michel Kamba</ThemedText>
              <View style={styles.reviewRating}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons 
                    key={i} 
                    name={i <= 4 ? "star" : "star-outline"} 
                    size={16} 
                    color="#FFD700" 
                  />
                ))}
              </View>
              <ThemedText style={styles.reviewText}>
                Excellent professionnel, travail soigné et ponctuel. Je recommande vivement!
              </ThemedText>
              <ThemedText style={styles.reviewDate}>15 mars 2023</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Bouton d'édition */}
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => setEditing(!editing)}
      >
        <Ionicons name={editing ? "checkmark" : "create"} size={24} color="#fff" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4a90e2',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4a90e2',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  basicInfo: {
    flex: 1,
  },
  subtitle: {
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#4a90e2',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4a90e2',
    maxWidth: 50,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  seeAll: {
    color: '#4a90e2',
    fontSize: 14,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
    width: 24,
  },
  infoText: {
    flex: 1,
  },
  bioText: {
    lineHeight: 22,
    color: '#555',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#e3f2fd',
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: '#1976d2',
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  documentText: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
  },
  map: {
    flex: 1,
  },
  reviewItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  reviewAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  reviewText: {
    color: '#555',
    marginBottom: 4,
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: 12,
    color: '#888',
  },
  editButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#4a90e2',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});