import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react-native';

interface Scheme {
  id: string;
  name: string;
  benefit: string;
  eligibility: string;
  description: string;
  amount: string;
  documents: string[];
}

const schemes: Scheme[] = [
  {
    id: '1',
    name: 'PM-KISAN Scheme',
    benefit: '₹6,000 per year',
    eligibility: 'Small and marginal farmers',
    description: 'Direct income support to farmers. ₹2,000 transferred every 4 months in 3 installments.',
    amount: '₹6,000 annually',
    documents: ['Aadhaar Card', 'Bank Account Details', 'Land Records'],
  },
  {
    id: '2',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    benefit: 'Crop Insurance Coverage',
    eligibility: 'All farmers (loanee and non-loanee)',
    description: 'Comprehensive crop insurance scheme covering pre-sowing to post-harvest losses.',
    amount: 'Up to ₹2 lakhs coverage',
    documents: ['Aadhaar Card', 'Bank Account', 'Land Documents', 'Sowing Certificate'],
  },
  {
    id: '3',
    name: 'Kisan Credit Card (KCC)',
    benefit: 'Easy farm credit',
    eligibility: 'All farmers including sharecroppers',
    description: 'Flexible credit facility for crop production, post-harvest expenses, and asset maintenance.',
    amount: 'Based on farming area',
    documents: ['Identity Proof', 'Address Proof', 'Land Records'],
  },
  {
    id: '4',
    name: 'Soil Health Card Scheme',
    benefit: 'Free soil testing',
    eligibility: 'All farmers',
    description: 'Soil health cards with nutrient status and fertilizer recommendations for better yield.',
    amount: 'Free service',
    documents: ['Farmer Registration', 'Land Records'],
  },
  {
    id: '5',
    name: 'National Agriculture Market (eNAM)',
    benefit: 'Online trading platform',
    eligibility: 'All farmers and traders',
    description: 'Pan-India electronic trading portal for agricultural commodities.',
    amount: 'Better price discovery',
    documents: ['Registration on eNAM portal', 'Quality certificates'],
  },
];

export default function SchemesScreen() {
  const [expandedScheme, setExpandedScheme] = useState<string | null>(null);

  const toggleExpansion = (schemeId: string) => {
    setExpandedScheme(expandedScheme === schemeId ? null : schemeId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Government Schemes</Text>
        <Text style={styles.headerSubtitle}>Financial support and benefits for farmers</Text>
      </View>

      <ScrollView style={styles.schemesList} showsVerticalScrollIndicator={false}>
        {schemes.map((scheme) => (
          <View key={scheme.id} style={styles.schemeCard}>
            <TouchableOpacity
              style={styles.schemeHeader}
              onPress={() => toggleExpansion(scheme.id)}
            >
              <View style={styles.schemeInfo}>
                <Text style={styles.schemeName}>{scheme.name}</Text>
                <Text style={styles.schemeBenefit}>{scheme.benefit}</Text>
              </View>
              {expandedScheme === scheme.id ? (
                <ChevronUp size={24} color="#6B7280" />
              ) : (
                <ChevronDown size={24} color="#6B7280" />
              )}
            </TouchableOpacity>

            {expandedScheme === scheme.id && (
              <View style={styles.schemeDetails}>
                <Text style={styles.schemeDescription}>{scheme.description}</Text>
                
                <View style={styles.detailSection}>
                  <Text style={styles.detailTitle}>Eligibility:</Text>
                  <Text style={styles.detailText}>{scheme.eligibility}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailTitle}>Financial Benefit:</Text>
                  <Text style={styles.detailAmount}>{scheme.amount}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailTitle}>Required Documents:</Text>
                  {scheme.documents.map((doc, index) => (
                    <Text key={index} style={styles.documentItem}>• {doc}</Text>
                  ))}
                </View>

                <TouchableOpacity style={styles.applyButton}>
                  <Text style={styles.applyButtonText}>Learn More</Text>
                  <ExternalLink size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            Visit your nearest agricultural office or call the Kisan Call Center at 1800-180-1551 for assistance with applications.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  schemesList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  schemeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  schemeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  schemeInfo: {
    flex: 1,
  },
  schemeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  schemeBenefit: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '600',
  },
  schemeDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  schemeDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginVertical: 12,
  },
  detailSection: {
    marginVertical: 8,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  documentItem: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    marginVertical: 2,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  helpCard: {
    backgroundColor: '#EBF8FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
});