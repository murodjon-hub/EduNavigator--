import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Linking,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

const RESOURCES = [
  {
    category: 'Foydalanish uchun saytlar',
    icon: '🔬',
    color: '#1565C0',
    sites: [
      {
        name: 'Google Scholar',
        desc: 'Eng katta bepul ilmiy maqolalar qidiruvi',
        url: 'https://scholar.google.com',
        tag: 'Bepul',
        tagColor: '#2E7D32',
      },
      {
        name: 'ResearchGate',
        desc: 'Ilmiy maqolalar va tadqiqotchilar tarmog\'i',
        url: 'https://www.researchgate.net',
        tag: 'Bepul',
        tagColor: '#2E7D32',
      },
      {
        name: 'Scopus',
        desc: 'Elsevier\'ning indekslangan ilmiy jurnallar bazasi',
        url: 'https://www.scopus.com',
        tag: 'Pulli',
        tagColor: '#BF360C',
      },
      {
        name: 'Web of Science',
        desc: 'Yuqori sifatli ilmiy jurnallar indeksi',
        url: 'https://www.webofscience.com',
        tag: 'Pulli',
        tagColor: '#BF360C',
      },
    ],
  },
  {
    category: 'O\'zbek resurslari',
    icon: '🇺🇿',
    color: '#00695C',
    sites: [
      {
        name: 'ZiyoNet',
        desc: 'O\'zbekiston ta\'lim portali — darsliklar va qo\'llanmalar',
        url: 'https://ziyonet.uz',
        tag: 'Bepul',
        tagColor: '#2E7D32',
      },
      {
        name: 'e-Library.uz',
        desc: 'O\'zbek elektron kutubxonasi',
        url: 'https://e-library.uz',
        tag: 'Bepul',
        tagColor: '#2E7D32',
      },
      {
        name: 'Intedu.uz',
        desc: 'O\'zbekiston oliy ta\'lim portali',
        url: 'https://intedu.uz',
        tag: 'Bepul',
        tagColor: '#2E7D32',
      },
      {
        name: 'Antiplagiat.uz',
        desc: 'Plagiarizm tekshiruvi uchun milliy tizim',
        url: 'https://antiplagiat.uz',
        tag: 'Bepul',
        tagColor: '#2E7D32',
      },
    ],
  },
  {
    category: 'Elektron kutubxonalar',
    icon: '📚',
    color: '#6A1B9A',
    sites: [
      {
        name: 'Sci-Hub',
        desc: 'Ilmiy maqolalarga bepul kirish (ehtiyotkorlik bilan)',
        url: 'https://sci-hub.se',
        tag: 'Bepul',
        tagColor: '#2E7D32',
      },
      {
        name: 'JSTOR',
        desc: 'Akademik jurnallar va kitoblar arxivi',
        url: 'https://www.jstor.org',
        tag: 'Qisman bepul',
        tagColor: '#F57F17',
      },
      {
        name: 'OpenDOAR',
        desc: 'Ochiq kirish ilmiy resurslar katalogi',
        url: 'https://v2.sherpa.ac.uk/opendoar',
        tag: 'Bepul',
        tagColor: '#2E7D32',
      },
      {
        name: 'BASE Search',
        desc: 'Akademik internet-resurslar qidiruvi',
        url: 'https://www.base-search.net',
        tag: 'Bepul',
        tagColor: '#2E7D32',
      },
    ],
  },
  {
    category: 'Yozish va rasmiylash',
    icon: '✍️',
    color: '#0277BD',
    sites: [
      {
        name: 'Grammarly',
        desc: 'Inglizcha yozuvni tekshirish va yaxshilash',
        url: 'https://grammarly.com',
        tag: 'Bepul versiya',
        tagColor: '#F57F17',
      },
      {
        name: 'Mendeley',
        desc: 'Adabiyotlar boshqaruvi va havola yaratish',
        url: 'https://www.mendeley.com',
        tag: 'Bepul',
        tagColor: '#2E7D32',
      },
      {
        name: 'Zotero',
        desc: 'Bepul manba boshqaruvi dasturi',
        url: 'https://www.zotero.org',
        tag: 'Bepul',
        tagColor: '#2E7D32',
      },
      {
        name: 'Text.ru',
        desc: 'Plagiarizm va grammatika tekshiruvi',
        url: 'https://text.ru',
        tag: 'Bepul',
        tagColor: '#2E7D32',
      },
    ],
  },
];

const AI_SUGGESTIONS = [
  'BM kirish qismini qanday yozaman?',
  'Dissertatsiya uchun mavzu topishda yordam ber',
  'Kurs ishi adabiyotlar ro\'yxatini qanday rasmiylashaman?',
  'Ilmiy uslub bilan oddiy uslub farqi nima?',
  'Plagiarizm nisbatini kamaytirish uchun nima qilsam bo\'ladi?',
  'Google Scholar da maqola qidirish usullari',
];

const AI_RESPONSES = {
  default: (question) => `🤖 "${question}" haqida:\n\nBu savolga javob berish uchun kursim bo'yicha eng foydali ma'lumot:\n\nIlmiy ish yozishda eng muhim qadamlar:\n1. Mavzuni to'liq tushunish\n2. Adabiyotlarni tizimli ko'rib chiqish\n3. Ilmiy uslubda yozish\n4. Plagiarizm tekshiruvi\n\nBatafsil ma'lumot uchun Yo'riqnoma bo'limiga o'ting.`,
  bm: `🤖 BM kirish qismi:\n\n**Kirish qismiga kiritish kerak:**\n• Mavzuning dolzarbligi (nima uchun muhim?)\n• Tadqiqot maqsadi (nima uchun yozyapsiz?)\n• Vazifalar (maqsadni qanday amalga oshirasiz?)\n• Ob'ekt (nimani o'rganasiz?)\n• Predmet (qaysi tomonini o'rganasiz?)\n• Ish tuzilishi\n\n**Hajm:** 3-5 bet\n**Maslahat:** Kirishni oxirida yozing — asosiy qismni yozgandan keyin.`,
  plagiarizm: `🤖 Plagiarizm kamaytirish usullari:\n\n1. **Parafrazlash** — g'oyani o'z so'zingiz bilan ifodalang\n2. **To'g'ri iqtibos** — manba ko'rsating (Muallif, yil, bet)\n3. **Sintez** — bir nechta manbadan g'oyalarni birlashtiring\n4. **O'z tahlili** — faqat manba keltirmay, o'zingizning fikrni qo'shing\n5. **Antiplagiat.uz** — topshirishdan oldin tekshiring\n\n**Minimal original matn:** BM uchun 70%, Magistrlik uchun 85%`,
};

export default function ResourcesScreen() {
  const { t } = useLanguage();
  const rt = t.resources;
  const [aiInput, setAiInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'ai', text: rt.ai_welcome }]);
  const scrollRef = useRef(null);
  const [activeSection, setActiveSection] = useState('resources');

  const handleAiSend = () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiInput('');

    const newMessages = [...messages, { role: 'user', text: userMsg }];

    let response;
    const lower = userMsg.toLowerCase();
    if (lower.includes('bm') || lower.includes('bitiruv') || lower.includes('kirish')) {
      response = AI_RESPONSES.bm;
    } else if (lower.includes('plagiarizm') || lower.includes('original')) {
      response = AI_RESPONSES.plagiarizm;
    } else {
      response = AI_RESPONSES.default(userMsg);
    }

    setMessages([...newMessages, { role: 'ai', text: response }]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{rt.header_title}</Text>
        <Text style={styles.headerSubtitle}>{rt.header_subtitle}</Text>

        {/* Section Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, activeSection === 'resources' && styles.toggleActive]}
            onPress={() => setActiveSection('resources')}
          >
            <Text style={[styles.toggleText, activeSection === 'resources' && styles.toggleTextActive]}>
              {rt.tab_sites}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, activeSection === 'ai' && styles.toggleActive]}
            onPress={() => setActiveSection('ai')}
          >
            <Text style={[styles.toggleText, activeSection === 'ai' && styles.toggleTextActive]}>
              {rt.tab_ai}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeSection === 'resources' ? (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {rt.categories.map((section, sIndex) => (
            <View key={sIndex} style={styles.resourceSection}>
              <View style={[styles.sectionHeader, { borderLeftColor: section.color }]}>
                <Text style={styles.sectionIcon}>{section.icon}</Text>
                <Text style={[styles.sectionTitle, { color: section.color }]}>
                  {section.category}
                </Text>
              </View>
              {section.sites.map((site, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.siteCard}
                  onPress={async () => {
                    try {
                      const supported = await Linking.canOpenURL(site.url);
                      if (supported) {
                        await Linking.openURL(site.url);
                      } else {
                        Alert.alert(rt.open_err_title, rt.open_err_msg(site.url));
                      }
                    } catch {
                      Alert.alert(rt.net_err_title, rt.net_err_msg(site.url));
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.siteInfo}>
                    <View style={styles.siteTitleRow}>
                      <Text style={styles.siteName}>{site.name}</Text>
                      <View style={[styles.siteTag, { backgroundColor: site.tagColor + '20' }]}>
                        <Text style={[styles.siteTagText, { color: site.tagColor }]}>{site.tag}</Text>
                      </View>
                    </View>
                    <Text style={styles.siteDesc}>{site.desc}</Text>
                    <Text style={styles.siteUrl}>{site.url}</Text>
                  </View>
                  <Text style={[styles.openIcon, { color: section.color }]}>↗</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      ) : (
        <KeyboardAvoidingView
          style={styles.aiContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={90}
        >
          {/* Suggestions */}
          <View style={styles.suggestionsBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {AI_SUGGESTIONS.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.suggestionChip}
                  onPress={() => setAiInput(s)}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Chat Messages */}
          <ScrollView
            ref={scrollRef}
            style={styles.chatContainer}
            contentContainerStyle={styles.chatContent}
          >
            {messages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  msg.role === 'user' ? styles.userBubble : styles.aiBubble,
                ]}
              >
                <Text style={[
                  styles.messageText,
                  msg.role === 'user' ? styles.userText : styles.aiText,
                ]}>
                  {msg.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={aiInput}
              onChangeText={setAiInput}
              placeholder={rt.ai_placeholder}
              placeholderTextColor={colors.textLight}
              multiline
              maxLength={300}
            />
            <TouchableOpacity
              style={[styles.sendButton, !aiInput.trim() && styles.sendButtonDisabled]}
              onPress={handleAiSend}
              disabled={!aiInput.trim()}
            >
              <Text style={styles.sendIcon}>➤</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
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
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    color: colors.white,
    fontSize: typography.fontSizeXL,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: typography.fontSizeSM,
    marginBottom: spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.full,
    padding: 3,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: colors.white,
  },
  toggleText: {
    fontSize: typography.fontSizeSM,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  toggleTextActive: {
    color: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  resourceSection: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    paddingLeft: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.fontSizeMD,
    fontWeight: '700',
  },
  siteCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  siteInfo: {
    flex: 1,
  },
  siteTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  siteName: {
    fontSize: typography.fontSizeMD,
    fontWeight: '700',
    color: colors.text,
    marginRight: spacing.xs,
  },
  siteTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  siteTagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  siteDesc: {
    fontSize: typography.fontSizeXS,
    color: colors.textSecondary,
    marginBottom: 2,
    lineHeight: 16,
  },
  siteUrl: {
    fontSize: 10,
    color: colors.textLight,
  },
  openIcon: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  aiContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  suggestionsBar: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  suggestionChip: {
    backgroundColor: colors.accentLight + '40',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.accentLight,
  },
  suggestionText: {
    fontSize: typography.fontSizeXS,
    color: colors.primary,
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  userBubble: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.surface,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  messageText: {
    fontSize: typography.fontSizeSM,
    lineHeight: 22,
  },
  userText: {
    color: colors.white,
  },
  aiText: {
    color: colors.text,
  },
  inputRow: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSizeMD,
    color: colors.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  sendIcon: {
    color: colors.white,
    fontSize: 16,
  },
});
