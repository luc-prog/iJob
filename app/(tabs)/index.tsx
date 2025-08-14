import React from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Text,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type CategoryItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap; // Ceci garantit que l'icône est valide
  label: string;
};

const HomeScreen = () => {
  const { colors } = useTheme();
  const userName = "Luc";
  const isProvider = false;

  // Données des catégories
  const categories = [
    { id: '1', icon: 'briefcase', label: 'Trouver un emploi' },
    { id: '2', icon: 'construct', label: 'Engager un prestataire' },
    { id: '3', icon: 'add-circle', label: 'Publier une offre' },
    { id: '4', icon: 'add-circle', label: 'Bourse d étude' },
    { id: '5', icon: 'add-circle', label: 'Trouver un stage' },
    { id: '6', icon: 'add-circle', label: 'Trouver une formation' },
    { id: '7', icon: 'person', label: 'Mon profil' },
    { id: '8', icon: 'chatbubbles', label: 'Messagerie' },
    { id: '9', icon: 'calendar', label: 'Rendez-vous' },
  ];

  // Données des prestataires recommandés
  const recommendedProviders = [
    { id: '1', name: 'Jean K.', service: 'Électricien', rating: 4.8, city: 'Kinshasa' },
    { id: '2', name: 'Marie L.', service: 'Développeuse', rating: 4.9, city: 'Lubumbashi' },
    { id: '3', name: 'Paul M.', service: 'Plombier', rating: 4.7, city: 'Kinshasa' },
    { id: '4', name: 'Sophie N.', service: 'Designer', rating: 4.5, city: 'Goma' },
  ];

  // Données des offres récentes
  const recentOffers = [
    { id: '1', title: 'Développeur Mobile', company: 'Tech Solutions', city: 'Kinshasa' },
    { id: '2', title: 'Comptable', company: 'Finance Pro', city: 'Lubumbashi' },
    { id: '3', title: 'Infirmier', company: 'Hôpital Central', city: 'Kinshasa' },
  ];

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.avatar}
          />
          <ThemedText style={styles.welcomeText}>Bonjour {userName} 👋</ThemedText>
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Bannière Hero */}
        <View style={[styles.hero, { backgroundColor: colors.primary }]}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.heroImage}
          />
          <ThemedText style={styles.heroText}>
            Votre réseau professionnel, dans votre poche
          </ThemedText>
        </View>

        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Que cherchez-vous ? un service, un emploi, un profil..."
            style={[styles.searchInput, { color: colors.text }]}
            placeholderTextColor={colors.text}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Catégories principales */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>Services</ThemedText>
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
  <TouchableOpacity 
    key={category.id} 
    style={[styles.categoryCard, { backgroundColor: colors.card }]}
  >
    <Ionicons 
      name={category.icon as keyof typeof Ionicons.glyphMap} 
      size={24} 
      color={colors.primary} 
      style={styles.categoryIcon}
    />
    <ThemedText style={styles.categoryText}>{category.label}</ThemedText>
  </TouchableOpacity>
))}
        </View>

        {/* Prestataires recommandés */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>Prestataires recommandés</ThemedText>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={recommendedProviders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.providerCard, { backgroundColor: colors.card }]}>
              <Image 
                source={require('@/assets/images/icon.png')} 
                style={styles.providerImage}
              />
              <ThemedText style={styles.providerName}>{item.name}</ThemedText>
              <ThemedText style={styles.providerService}>{item.service}</ThemedText>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
                <ThemedText style={styles.providerCity}>{item.city}</ThemedText>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.providersList}
        />

        {/* Offres récentes */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>Offres récentes</ThemedText>
        <View style={styles.offersContainer}>
          {recentOffers.map((offer) => (
            <TouchableOpacity 
              key={offer.id} 
              style={[styles.offerCard, { backgroundColor: colors.card }]}
            >
              <View style={styles.offerTextContainer}>
                <ThemedText style={styles.offerTitle}>{offer.title}</ThemedText>
                <ThemedText style={styles.offerCompany}>{offer.company}</ThemedText>
                <ThemedText style={styles.offerCity}>{offer.city}</ThemedText>
              </View>
              <TouchableOpacity style={styles.seeButton}>
                <ThemedText style={styles.seeButtonText}>Voir</ThemedText>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section Proposer ses services */}
        <View style={[styles.serviceSection, { backgroundColor: colors.primary }]}>
          <ThemedText style={styles.serviceText}>
            {isProvider 
              ? "Optimisez votre visibilité ? Mettez à jour votre profil" 
              : "Vous cherchez du travail ? Publiez votre CV"}
          </ThemedText>
          <TouchableOpacity style={styles.serviceButton}>
            <ThemedText style={styles.serviceButtonText}>
              {isProvider ? "Compléter mon profil" : "Commencer maintenant"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '500',
  },
  hero: {
    height: 150,
    borderRadius: 12,
    margin: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  heroImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  heroText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginLeft: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#4a90e2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  categoryCard: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    marginBottom: 8,
  },
  categoryText: {
    textAlign: 'center',
    fontSize: 12,
  },
  providersList: {
    paddingHorizontal: 16,
  },
  providerCard: {
    width: 140,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  providerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 8,
  },
  providerName: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  providerService: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    marginLeft: 4,
    marginRight: 8,
  },
  providerCity: {
    fontSize: 12,
    color: '#666',
  },
  offersContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  offerCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  offerTextContainer: {
    flex: 1,
  },
  offerTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  offerCompany: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  offerCity: {
    fontSize: 12,
    color: '#888',
  },
  seeButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  seeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  serviceSection: {
    borderRadius: 12,
    padding: 20,
    margin: 16,
    alignItems: 'center',
  },
  serviceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  serviceButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  serviceButtonText: {
    color: '#4a90e2',
    fontWeight: 'bold',
  },
});

export default HomeScreen;