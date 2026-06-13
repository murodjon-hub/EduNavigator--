import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

const SECTION_META = [
  { id: 1, icon: '📖', color: '#1565C0', tab: 'Guide' },
  { id: 2, icon: '📝', color: '#6A1B9A', tab: 'Survey' },
  { id: 3, icon: '📊', color: '#00695C', tab: 'Survey', screen: 'Results' },
  { id: 4, icon: '⚖️', color: '#BF360C', tab: 'Guide', screen: 'Laws' },
  { id: 5, icon: '🌐', color: '#0277BD', tab: 'Resources' },
  { id: 6, icon: '📄', color: '#2E7D32', tab: 'Samples' },
];

function AppLogo() {
  return (
    <View style={styles.logoRow}>
      <View style={styles.logoBox}>
        <Text style={styles.logoI}>E</Text>
        <Text style={styles.logoY}>N</Text>
      </View>
      <Text style={styles.logoName}>EduNavigator</Text>
    </View>
  );
}

function LangSwitcher() {
  const { lang, setLang, t } = useLanguage();
  const langs = ['uz', 'ru', 'en'];
  return (
    <View style={styles.langRow}>
      {langs.map((l) => (
        <TouchableOpacity
          key={l}
          style={[styles.langBtn, lang === l && styles.langBtnActive]}
          onPress={() => setLang(l)}
          activeOpacity={0.7}
        >
          <Text style={[styles.langText, lang === l && styles.langTextActive]}>
            {t.lang[l]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { t } = useLanguage();

  const handleSectionPress = (meta) => {
    if (meta.screen) {
      navigation.navigate(meta.tab, { screen: meta.screen });
    } else {
      navigation.navigate(meta.tab);
    }
  };

  const sections = t.home.sections_data.map((s, i) => ({ ...s, ...SECTION_META[i] }));
  const stats = [
    { value: '500+', label: t.home.stats.students },
    { value: '50+', label: t.home.stats.samples },
    { value: '7', label: t.home.stats.sections },
    { value: '100%', label: t.home.stats.free },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <AppLogo />
            <Text style={styles.headerTitle}>{t.home.tagline}</Text>
            <Text style={styles.headerSubtitle}>{t.home.subtitle}</Text>
            <LangSwitcher />
          </View>
          <View style={styles.headerDecoration}>
            <Text style={styles.decorationIcon}>📚</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t.home.sections_title}</Text>

        <View style={styles.cardsGrid}>
          {sections.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={[styles.card, { borderLeftColor: section.color }]}
              onPress={() => handleSectionPress(section)}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIconBg, { backgroundColor: section.color + '15' }]}>
                <Text style={styles.cardIcon}>{section.icon}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{section.title}</Text>
                <Text style={styles.cardSubtitle}>{section.subtitle}</Text>
                <Text style={styles.cardDescription}>{section.description}</Text>
              </View>
              <Text style={[styles.cardArrow, { color: section.color }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* About */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>{t.home.about_title}</Text>
          <Text style={styles.aboutText}>{t.home.about_text}</Text>
          <View style={styles.creatorRow}>
            <Text style={styles.creatorText}>{t.home.author}</Text>
          </View>
          <View style={styles.creatorRow}>
            <Text style={styles.creatorText}>{t.home.supervisor}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.xl },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl + 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: { flex: 1 },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  logoBox: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.55)',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
  },
  logoI: { color: '#FFD700', fontSize: 18, fontWeight: '900', letterSpacing: -1 },
  logoY: { color: '#FFFFFF', fontSize: 18, fontWeight: '900', letterSpacing: -1 },
  logoName: { color: colors.white, fontSize: 22, fontWeight: '800', letterSpacing: 0.5 },
  headerTitle: { color: colors.white, fontSize: typography.fontSizeXXL, fontWeight: '800', lineHeight: 32, marginBottom: spacing.sm },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: typography.fontSizeSM, lineHeight: 20, marginBottom: spacing.sm },
  langRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  langBtn: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  langBtnActive: { backgroundColor: colors.white },
  langText: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.85)' },
  langTextActive: { color: colors.primary },
  headerDecoration: { marginLeft: spacing.md },
  decorationIcon: { fontSize: 56 },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: -spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: typography.fontSizeXL, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: typography.fontSizeXS, color: colors.textSecondary, marginTop: 2, fontWeight: '500' },
  sectionTitle: {
    fontSize: typography.fontSizeLG, fontWeight: '700', color: colors.text,
    marginHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm,
  },
  cardsGrid: { paddingHorizontal: spacing.md, gap: spacing.sm },
  card: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    padding: spacing.md, flexDirection: 'row', alignItems: 'center',
    borderLeftWidth: 4, elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, marginBottom: spacing.xs,
  },
  cardIconBg: { width: 52, height: 52, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  cardIcon: { fontSize: 26 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: typography.fontSizeMD, fontWeight: '700', color: colors.text, marginBottom: 2 },
  cardSubtitle: { fontSize: typography.fontSizeXS, color: colors.primary, fontWeight: '600', marginBottom: 2 },
  cardDescription: { fontSize: typography.fontSizeXS, color: colors.textLight, lineHeight: 16 },
  cardArrow: { fontSize: 28, fontWeight: '300', marginLeft: spacing.xs },
  aboutCard: {
    backgroundColor: colors.surface, marginHorizontal: spacing.md,
    marginTop: spacing.lg, borderRadius: borderRadius.lg, padding: spacing.md,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  aboutTitle: { fontSize: typography.fontSizeMD, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  aboutText: { fontSize: typography.fontSizeSM, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.md },
  creatorRow: { marginBottom: spacing.xs },
  creatorText: { fontSize: typography.fontSizeSM, color: colors.textSecondary, fontWeight: '500' },
});
