import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { useResponsive } from '../hooks/useResponsive';

function BarChart({ data, color }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <View style={styles.chartContainer}>
      {data.map((item, index) => (
        <View key={index} style={styles.barRow}>
          <Text style={styles.barLabel} numberOfLines={2}>{item.label}</Text>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${(item.count / max) * 100}%`,
                  backgroundColor: color || colors.primary,
                },
              ]}
            />
            <Text style={styles.barCount}>{item.count}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const DEMO_DATA = [
  {
    question: 'Qaysi turdagi ilmiy ish yozyapsiz?',
    color: '#1565C0',
    data: [
      { label: 'Kurs ishi', count: 145 },
      { label: 'BM (Bitiruv)', count: 112 },
      { label: 'Magistrlik dissertatsiyasi', count: 43 },
      { label: 'Ilmiy maqola', count: 28 },
    ],
  },
  {
    question: 'Eng ko\'p uchraydigan qiyinchilik',
    color: '#6A1B9A',
    data: [
      { label: 'Ilmiy uslubda yozish', count: 143 },
      { label: 'Adabiyot topish', count: 128 },
      { label: 'Plagiarizm muammosi', count: 97 },
      { label: 'Ma\'lumot tahlili', count: 84 },
      { label: 'Rasmiylash', count: 71 },
      { label: 'Mavzu tanlash', count: 45 },
    ],
  },
  {
    question: 'Ilmiy rahbar bilan muloqot',
    color: '#00695C',
    data: [
      { label: 'Juda samarali', count: 89 },
      { label: 'O\'rtacha', count: 167 },
      { label: 'Kam samarali', count: 102 },
      { label: 'Deyarli aloqa yo\'q', count: 42 },
    ],
  },
  {
    question: 'Eng muhim yordam turi',
    color: '#0277BD',
    data: [
      { label: 'Bosqichma-bosqich yo\'riqnoma', count: 178 },
      { label: 'Namuna ishlar', count: 156 },
      { label: 'AI yordamchi', count: 134 },
      { label: 'Shablonlar', count: 98 },
      { label: 'Online maslahatlar', count: 67 },
    ],
  },
];

const DIFFICULTY_DATA = [
  { score: 1, label: 'Oson', count: 12 },
  { score: 2, label: 'Biroz qiyin', count: 45 },
  { score: 3, label: 'O\'rtacha', count: 134 },
  { score: 4, label: 'Qiyin', count: 189 },
  { score: 5, label: 'Juda qiyin', count: 148 },
];

export default function ResultsScreen({ navigation }) {
  const [localResponses, setLocalResponses] = useState(0);
  const { isDesktop } = useResponsive();
  const totalResponses = 528;
  const avgDifficulty = '3.9';

  useEffect(() => {
    AsyncStorage.getItem('survey_responses').then((data) => {
      if (data) {
        setLocalResponses(JSON.parse(data).length);
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Orqaga</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📊 Natijalar</Text>
        <Text style={styles.headerSubtitle}>So'rovnoma statistikasi</Text>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, isDesktop && styles.scrollContentDesktop]}
      >
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderTopColor: colors.primary }]}>
            <Text style={styles.summaryValue}>{totalResponses + localResponses}</Text>
            <Text style={styles.summaryLabel}>Jami ishtirokchilar</Text>
          </View>
          <View style={[styles.summaryCard, { borderTopColor: '#6A1B9A' }]}>
            <Text style={[styles.summaryValue, { color: '#6A1B9A' }]}>{avgDifficulty}/5</Text>
            <Text style={styles.summaryLabel}>O'rtacha qiyinlik</Text>
          </View>
          <View style={[styles.summaryCard, { borderTopColor: '#00695C' }]}>
            <Text style={[styles.summaryValue, { color: '#00695C' }]}>{localResponses}</Text>
            <Text style={styles.summaryLabel}>Qurilmadagi</Text>
          </View>
        </View>

        {/* Difficulty Rating */}
        <Text style={styles.sectionTitle}>⭐ Qiyinlik darajasi</Text>
        <View style={styles.ratingCard}>
          {DIFFICULTY_DATA.map((item) => {
            const max = Math.max(...DIFFICULTY_DATA.map((d) => d.count));
            const pct = (item.count / max) * 100;
            return (
              <View key={item.score} style={styles.ratingRow}>
                <Text style={styles.ratingLabel}>{item.score} — {item.label}</Text>
                <View style={styles.ratingTrack}>
                  <View
                    style={[
                      styles.ratingFill,
                      {
                        width: `${pct}%`,
                        backgroundColor: item.score <= 2 ? '#43A047' : item.score === 3 ? '#FB8C00' : '#E53935',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.ratingCount}>{item.count}</Text>
              </View>
            );
          })}
          <Text style={styles.ratingNote}>
            * Talabalarning 63% ilmiy ish yozishni qiyin deb baholaydi
          </Text>
        </View>

        {/* Charts */}
        {DEMO_DATA.map((chart, index) => (
          <View key={index}>
            <Text style={styles.sectionTitle}>{chart.question}</Text>
            <View style={styles.chartCard}>
              <BarChart data={chart.data} color={chart.color} />
            </View>
          </View>
        ))}

        {/* Key Insights */}
        <Text style={styles.sectionTitle}>🔍 Asosiy xulosalar</Text>
        <View style={styles.insightsCard}>
          {[
            '📌 Talabalarning 56% eng katta muammo sifatida ilmiy uslubda yozishni ko\'rsatdi',
            '📌 Talabalarning 66% ilmiy rahbar bilan o\'rtacha yoki kam samarali muloqot qiladi',
            '📌 63% bosqichma-bosqich yo\'riqnomani eng muhim yordam deb biladi',
            '📌 AI yordamlarga qiziqish yuqori — 25% dan ortiq talaba AI ni afzal ko\'radi',
            '📌 Kurs ishi yozayotgan talabalar ko\'pchilikni tashkil etadi (43%)',
          ].map((insight, i) => (
            <Text key={i} style={styles.insightText}>{insight}</Text>
          ))}
        </View>

        <TouchableOpacity
          style={styles.surveyButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.surveyButtonText}>📝 So'rovnomada ishtirok etish</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
  },
  backButton: {
    marginBottom: spacing.xs,
  },
  backText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.fontSizeSM,
  },
  headerTitle: {
    color: colors.white,
    fontSize: typography.fontSizeXL,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: typography.fontSizeSM,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderTopWidth: 3,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  summaryValue: {
    fontSize: typography.fontSizeXL,
    fontWeight: '800',
    color: colors.primary,
  },
  summaryLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: typography.fontSizeMD,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  ratingCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ratingLabel: {
    width: 120,
    fontSize: typography.fontSizeXS,
    color: colors.textSecondary,
  },
  ratingTrack: {
    flex: 1,
    height: 10,
    backgroundColor: colors.background,
    borderRadius: 5,
    marginHorizontal: spacing.xs,
  },
  ratingFill: {
    height: '100%',
    borderRadius: 5,
  },
  ratingCount: {
    width: 30,
    fontSize: typography.fontSizeXS,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  ratingNote: {
    fontSize: typography.fontSizeXS,
    color: colors.textLight,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  chartContainer: {
    gap: spacing.sm,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barLabel: {
    width: 120,
    fontSize: typography.fontSizeXS,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  barTrack: {
    flex: 1,
    height: 20,
    backgroundColor: colors.background,
    borderRadius: 4,
    marginLeft: spacing.xs,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  barFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 4,
  },
  barCount: {
    fontSize: typography.fontSizeXS,
    color: colors.text,
    fontWeight: '600',
    zIndex: 1,
    marginLeft: spacing.xs,
  },
  insightsCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#A5D6A7',
    gap: spacing.sm,
  },
  insightText: {
    fontSize: typography.fontSizeSM,
    color: '#1B5E20',
    lineHeight: 22,
  },
  surveyButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  surveyButtonText: {
    color: colors.white,
    fontSize: typography.fontSizeMD,
    fontWeight: '700',
  },
  scrollContentDesktop: {
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
});
