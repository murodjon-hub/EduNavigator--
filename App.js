import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
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

function AppContent() {
  const [activeTab, setActiveTab] = useState('Home');
  const [subScreen, setSubScreen] = useState(null);
  const { t } = useLanguage();

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
});
