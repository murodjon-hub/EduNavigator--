import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { getGuideData } from '../i18n/guideDataI18n';

function AccordionItem({ item, index, mundarija, kirishItems, color }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.accordionLeft}>
          <View style={[styles.stepBadge, color && { backgroundColor: color }]}>
            <Text style={styles.stepNumber}>{index + 1}</Text>
          </View>
          <Text style={styles.accordionIcon}>{item.icon}</Text>
          <Text style={styles.accordionTitle}>{item.title}</Text>
        </View>
        <Text style={styles.accordionArrow}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.accordionBody}>
          {mundarija ? (
            <View style={styles.documentCard}>
              <Text style={styles.documentTitle}>MUNDARIJA</Text>
              {mundarija.map((row, i) => (
                <View key={i} style={[styles.mundarijRow, { paddingLeft: row.indent * 16 }]}>
                  <Text style={[styles.mundarijText, row.bold && styles.mundarijBold]}>
                    {row.label}
                  </Text>
                </View>
              ))}
            </View>
          ) : kirishItems ? (
            <View style={styles.documentCard}>
              <Text style={styles.documentTitle}>Kirish</Text>
              {kirishItems.map((kItem, i) => (
                <View key={i} style={styles.kirishItem}>
                  <Text style={styles.kirishLabel}>{kItem.label}:{' '}
                    <Text style={styles.kirishText}>{kItem.text}</Text>
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.accordionContent}>{item.content}</Text>
          )}
        </View>
      )}
    </View>
  );
}

export default function GuideScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('bm');
  const { lang, t } = useLanguage();
  const GUIDE_DATA = getGuideData(lang);
  const data = GUIDE_DATA[activeTab];
  const gt = t.guide;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{gt.header_title}</Text>
        <Text style={styles.headerSubtitle}>{gt.header_subtitle}</Text>
        <TouchableOpacity
          style={styles.lawsButton}
          onPress={() => navigation.navigate('Laws')}
        >
          <Text style={styles.lawsButtonText}>{gt.laws_btn}</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        {gt.tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Intro Card */}
        <View style={[styles.introCard, { borderLeftColor: data.color }]}>
          <Text style={styles.introIcon}>{data.icon}</Text>
          <Text style={[styles.introTitle, { color: data.color }]}>{data.title}</Text>
          <Text style={styles.introText}>{data.intro}</Text>
        </View>

        {/* Structure Section */}
        <Text style={styles.sectionTitle}>{gt.structure_title}</Text>
        <View style={styles.accordionContainer}>
          {data.structure.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              index={index}
              color={data.color}
              mundarija={index === 1 ? data.mundarija : null}
              kirishItems={index === 2 ? data.kirish : null}
            />
          ))}
        </View>

        {/* Requirements */}
        <Text style={styles.sectionTitle}>{gt.requirements_title}</Text>
        <View style={styles.requirementsCard}>
          {data.requirements.map((req, index) => (
            <View key={index} style={styles.requirementItem}>
              <View style={[styles.reqDot, { backgroundColor: data.color }]} />
              <Text style={styles.requirementText}>{req}</Text>
            </View>
          ))}
        </View>

        {/* Tips */}
        <Text style={styles.sectionTitle}>{gt.tips_title}</Text>
        <View style={styles.tipsCard}>
          {data.tips.map((tip, index) => (
            <Text key={index} style={styles.tipText}>{tip}</Text>
          ))}
        </View>
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    color: colors.white,
    fontSize: typography.fontSizeXL,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: typography.fontSizeSM,
    marginTop: 2,
  },
  lawsButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  lawsButtonText: {
    color: colors.white,
    fontSize: typography.fontSizeSM,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  activeTab: {
    backgroundColor: colors.white,
  },
  tabIcon: {
    fontSize: 14,
  },
  tabLabel: {
    fontSize: typography.fontSizeXS,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  activeTabLabel: {
    color: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  introCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderLeftWidth: 4,
    marginBottom: spacing.md,
  },
  introIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  introTitle: {
    fontSize: typography.fontSizeLG,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  introText: {
    fontSize: typography.fontSizeSM,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: typography.fontSizeMD,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  accordionContainer: {
    marginHorizontal: spacing.md,
  },
  accordionItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  accordionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  stepNumber: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  accordionIcon: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  accordionTitle: {
    fontSize: typography.fontSizeSM,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  accordionArrow: {
    fontSize: 10,
    color: colors.textLight,
  },
  accordionBody: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: 0,
  },
  accordionContent: {
    fontSize: typography.fontSizeSM,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  requirementsCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  reqDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
    marginRight: spacing.sm,
  },
  requirementText: {
    fontSize: typography.fontSizeSM,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: '#FFF8E1',
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  tipText: {
    fontSize: typography.fontSizeSM,
    color: '#4E342E',
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  documentCard: {
    backgroundColor: '#FAFBFF',
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#C5CAE9',
    elevation: 2,
    shadowColor: '#3949AB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  documentTitle: {
    fontSize: typography.fontSizeMD,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#C5CAE9',
    paddingBottom: spacing.sm,
  },
  mundarijRow: {
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E8EAF6',
  },
  mundarijText: {
    fontSize: typography.fontSizeSM,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  mundarijBold: {
    fontWeight: '700',
    color: colors.text,
  },
  kirishItem: {
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E8EAF6',
  },
  kirishLabel: {
    fontSize: typography.fontSizeSM,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 22,
  },
  kirishText: {
    fontWeight: '400',
    color: colors.textSecondary,
  },
});
