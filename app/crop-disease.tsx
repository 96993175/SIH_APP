import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Upload, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';

export default function CropDiseaseScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  const demoResults = [
    {
      image: 'healthy',
      status: 'healthy',
      title: 'Healthy Crop ✅',
      confidence: '94%',
      description: 'Your crop appears healthy with no visible signs of disease or pest damage.',
      recommendations: [
        'Continue current care routine',
        'Regular monitoring recommended',
        'Apply preventive organic treatments'
      ]
    },
    {
      image: 'diseased',
      status: 'diseased',
      title: 'Leaf Blight Detected ⚠️',
      confidence: '87%',
      description: 'Early stages of leaf blight detected. Immediate action required to prevent spread.',
      recommendations: [
        'Remove affected leaves immediately',
        'Apply fungicide spray in evening',
        'Improve air circulation around plants',
        'Avoid overhead watering'
      ]
    }
  ];

  const handleImageUpload = () => {
    Alert.alert(
      'Select Image Source',
      'Choose how you want to add an image',
      [
        { text: 'Camera', onPress: simulateImageCapture },
        { text: 'Gallery', onPress: simulateImageUpload },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const simulateImageCapture = () => {
    setSelectedImage('camera');
    setTimeout(() => {
      analyzeImage();
    }, 1500);
  };

  const simulateImageUpload = () => {
    setSelectedImage('gallery');
    setTimeout(() => {
      analyzeImage();
    }, 1500);
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const randomResult = demoResults[Math.floor(Math.random() * demoResults.length)];
      setAnalysisResult(randomResult);
      setIsAnalyzing(false);
    }, 3000);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crop Disease Detection</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {!selectedImage ? (
          <View style={styles.uploadContainer}>
            <View style={styles.uploadIconContainer}>
              <Camera size={48} color="#22C55E" />
            </View>
            <Text style={styles.uploadTitle}>Detect Crop Diseases</Text>
            <Text style={styles.uploadDescription}>
              Take a photo or upload an image of your crop leaves to detect diseases and get treatment recommendations.
            </Text>

            <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
              <Upload size={20} color="#FFFFFF" />
              <Text style={styles.uploadButtonText}>Add Image</Text>
            </TouchableOpacity>

            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Tips for Better Results:</Text>
              <Text style={styles.tipItem}>• Take photos in good lighting</Text>
              <Text style={styles.tipItem}>• Focus on affected leaves</Text>
              <Text style={styles.tipItem}>• Capture close-up details</Text>
              <Text style={styles.tipItem}>• Include healthy parts for comparison</Text>
            </View>
          </View>
        ) : (
          <View style={styles.analysisContainer}>
            <View style={styles.imagePreview}>
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imageText}>
                  {selectedImage === 'camera' ? '📸 Photo Captured' : '🖼️ Image Selected'}
                </Text>
              </View>
            </View>

            {isAnalyzing ? (
              <View style={styles.analyzingContainer}>
                <View style={styles.loadingSpinner} />
                <Text style={styles.analyzingText}>Analyzing crop health...</Text>
                <Text style={styles.analyzingSubtext}>This may take a few seconds</Text>
              </View>
            ) : analysisResult ? (
              <View style={styles.resultContainer}>
                <View style={[
                  styles.resultHeader,
                  { backgroundColor: analysisResult.status === 'healthy' ? '#F0FDF4' : '#FEF2F2' }
                ]}>
                  {analysisResult.status === 'healthy' ? (
                    <CheckCircle size={24} color="#22C55E" />
                  ) : (
                    <AlertTriangle size={24} color="#EF4444" />
                  )}
                  <Text style={styles.resultTitle}>{analysisResult.title}</Text>
                  <Text style={styles.confidenceText}>Confidence: {analysisResult.confidence}</Text>
                </View>

                <Text style={styles.resultDescription}>{analysisResult.description}</Text>

                <View style={styles.recommendationsContainer}>
                  <Text style={styles.recommendationsTitle}>Recommended Actions:</Text>
                  {analysisResult.recommendations.map((rec: string, index: number) => (
                    <View key={index} style={styles.recommendationItem}>
                      <Text style={styles.recommendationBullet}>•</Text>
                      <Text style={styles.recommendationText}>{rec}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.newAnalysisButton} onPress={resetAnalysis}>
                  <Text style={styles.newAnalysisText}>Analyze Another Image</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  uploadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  uploadDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 48,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  tipsContainer: {
    alignSelf: 'stretch',
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  tipItem: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  analysisContainer: {
    flex: 1,
  },
  imagePreview: {
    marginBottom: 24,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  imageText: {
    fontSize: 24,
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#E5E7EB',
    borderTopColor: '#22C55E',
    marginBottom: 24,
  },
  analyzingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  analyzingSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  resultContainer: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  confidenceText: {
    fontSize: 14,
    color: '#6B7280',
  },
  resultDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 24,
  },
  recommendationsContainer: {
    marginBottom: 32,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationBullet: {
    fontSize: 16,
    color: '#22C55E',
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  newAnalysisButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  newAnalysisText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});