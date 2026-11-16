import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { colors } from './src/theme/colors';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';

import HomeScreen from './src/screens/HomeScreen';
import GuideScreen from './src/screens/GuideScreen';
import SurveyScreen from './src/screens/SurveyScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import LawsScreen from './src/screens/LawsScreen';
import ResourcesScreen from './src/screens/ResourcesScreen';
import SamplesScreen from './src/screens/SamplesScreen';

const TAB_KEYS = [
  { key: 'Home', icon: '🏠' },
  { key: 'Guide', icon: '📖' },
  { key: 'Survey', icon: '📝' },
  { key: 'Resources', icon: '🌐' },
  { key: 'Samples', icon: '📄' },
];

// Screens reachable from Home rather than from the tab bar.
const SUB_SCREEN_KEYS = ['Results', 'Laws'];

// The landing page links straight at a section, e.g. /app/?screen=Guide.
// Anything unrecognised just opens Home.
function initialRouteFromUrl() {
  if (typeof window === 'undefined' || !window.location) {
    return { tab: 'Home', sub: null };
  }
  const requested = new URLSearchParams(window.location.search).get('screen');
  if (TAB_KEYS.some((tb) => tb.key === requested)) return { tab: requested, sub: null };
  if (SUB_SCREEN_KEYS.includes(requested)) return { tab: 'Home', sub: requested };
  return { tab: 'Home', sub: null };
}

function AppContent() {
  const [initialRoute] = useState(initialRouteFromUrl);
  const [activeTab, setActiveTab] = useState(initialRoute.tab);
  const [subScreen, setSubScreen] = useState(initialRoute.sub);
  const { lang, setLang, t } = useLanguage();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const TAB_LABELS = {
    Home: t.nav.home,
    Guide: t.nav.guide,
    Survey: t.nav.survey,
    Resources: t.nav.resources,
    Samples: t.nav.samples,
  };

  const navigation = {
    navigate: (tab, options) => {
      if (TAB_KEYS.find((tb) => tb.key === tab)) {
        setActiveTab(tab);
        setSubScreen(options?.screen || null);
      } else {
        setSubScreen(tab);
      }
    },
    goBack: () => setSubScreen(null),
  };

  const renderScreen = () => {
    if (subScreen === 'Results') return <ResultsScreen navigation={navigation} />;
    if (subScreen === 'Laws') return <LawsScreen navigation={navigation} />;
    switch (activeTab) {
      case 'Home':      return <HomeScreen navigation={navigation} />;
      case 'Guide':     return <GuideScreen navigation={navigation} />;
      case 'Survey':    return <SurveyScreen navigation={navigation} />;
      case 'Resources': return <ResourcesScreen navigation={navigation} />;
      case 'Samples':   return <SamplesScreen navigation={navigation} />;
      default:          return <HomeScreen navigation={navigation} />;
    }
  };

  // ─── Desktop layout ───────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <View style={styles.desktopRoot}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          {/* Logo */}
          <View style={styles.sidebarLogoRow}>
            <View style={styles.sidebarLogoBadge}>
              <Text style={styles.sidebarLogoE}>E</Text>
              <Text style={styles.sidebarLogoN}>N</Text>
            </View>
            <Text style={styles.sidebarLogoName}>EduNavigator</Text>
          </View>

          {/* Nav items */}
          <View style={styles.sidebarNav}>
            {TAB_KEYS.map((tab) => {
              const isActive = activeTab === tab.key && !subScreen;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
                  onPress={() => { setActiveTab(tab.key); setSubScreen(null); }}
                  activeOpacity={0.7}
                >
                  {isActive && <View style={styles.sidebarActiveBar} />}
                  <Text style={styles.sidebarItemIcon}>{tab.icon}</Text>
                  <Text style={[styles.sidebarItemLabel, isActive && styles.sidebarItemLabelActive]}>
                    {TAB_LABELS[tab.key]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Language switcher */}
          <View style={styles.sidebarLang}>
            <Text style={styles.sidebarLangHeading}>Til / Язык</Text>
            <View style={styles.sidebarLangRow}>
              {['uz', 'ru', 'en'].map((l) => (
                <TouchableOpacity
                  key={l}
                  style={[styles.sidebarLangBtn, lang === l && styles.sidebarLangBtnActive]}
                  onPress={() => setLang(l)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.sidebarLangText, lang === l && styles.sidebarLangTextActive]}>
                    {t.lang[l]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Main content */}
        <View style={styles.desktopContent}>
          {renderScreen()}
        </View>
      </View>
    );
  }

  // ─── Mobile layout (unchanged) ────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.screen}>{renderScreen()}</View>
      {!subScreen && (
        <View style={styles.tabBar}>
          {TAB_KEYS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.tab}
                onPress={() => { setActiveTab(tab.key); setSubScreen(null); }}
                activeOpacity={0.7}
              >
                <Text style={styles.tabIcon}>{tab.icon}</Text>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {TAB_LABELS[tab.key]}
                </Text>
                {isActive && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  // ─── Mobile ───────────────────────────────────────────────────────────
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44,
  },
  screen: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E3EAF8',
    paddingBottom: Platform.OS === 'ios' ? 20 : 6,
    paddingTop: 6,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  tabIcon: { fontSize: 20, marginBottom: 2 },
  tabLabel: { fontSize: 9, color: '#90A4AE', fontWeight: '600', textAlign: 'center' },
  tabLabelActive: { color: colors.primary },
  tabIndicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },

  // ─── Desktop ──────────────────────────────────────────────────────────
  desktopRoot: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  sidebar: {
    width: 240,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.cardBorder,
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  sidebarLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  sidebarLogoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sidebarLogoE: { color: '#FFD700', fontSize: 16, fontWeight: '900', letterSpacing: -1 },
  sidebarLogoN: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', letterSpacing: -1 },
  sidebarLogoName: { color: colors.text, fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  sidebarNav: {
    flex: 1,
    gap: 2,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
    position: 'relative',
    gap: 10,
  },
  sidebarItemActive: {
    backgroundColor: '#EEF3FF',
  },
  sidebarActiveBar: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  sidebarItemIcon: { fontSize: 18 },
  sidebarItemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sidebarItemLabelActive: {
    color: colors.primary,
  },
  sidebarLang: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: 16,
  },
  sidebarLangHeading: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sidebarLangRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sidebarLangBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  sidebarLangBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sidebarLangText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  sidebarLangTextActive: {
    color: colors.white,
  },
  desktopContent: {
    flex: 1,
  },
});
