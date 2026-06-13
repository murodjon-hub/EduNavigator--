import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

const SURVEY_QUESTIONS = [
  {
    id: 1,
    question: 'Qaysi turdagi ilmiy ish yozyapsiz?',
    type: 'single',
    options: ['Kurs ishi', 'Bitiruv malakaviy ishi (BM)', 'Magistrlik dissertatsiyasi', 'Ilmiy maqola'],
  },
  {
    id: 2,
    question: 'Ilmiy ish yozishda eng ko\'p qaysi qiyinchilikka duch kelasiz?',
    type: 'multiple',
    options: [
      'Mavzu tanlash',
      'Adabiyot topish va tahlil qilish',
      'Ilmiy uslubda yozish',
      'Ma\'lumot yig\'ish va tahlil',
      'Rasmiylash (forma/shablon)',
      'Plagiarizm muammosi',
    ],
  },
  {
    id: 3,
    question: 'Ilmiy rahbaringiz bilan muloqot qanchalik samarali?',
    type: 'single',
    options: [
      'Juda samarali — doim yordam beradi',
      'O\'rtacha — ba\'zan aloqada bo\'lamiz',
      'Kam samarali — siyrak muloqot',
      'Deyarli aloqa yo\'q',
    ],
  },
  {
    id: 4,
    question: 'Qaysi manbalardan ko\'proq foydalanasiz?',
    type: 'multiple',
    options: [
      'O\'zbek tilidagi kitoblar',
      'Xorijiy ilmiy maqolalar',
      'Internet saytlar (Google Scholar va h.k.)',
      'Kutubxona resurslari',
      'AI yordamchilar (ChatGPT va h.k.)',
      'Boshqa talabalar ishlari',
    ],
  },
  {
    id: 5,
    question: 'Ilmiy ish yozish uchun qancha vaqt sarflaysiz (kuniga)?',
    type: 'single',
    options: [
      '1 soatdan kam',
      '1-2 soat',
      '2-4 soat',
      '4 soatdan ortiq',
    ],
  },
  {
    id: 6,
    question: 'Ilmiy ish yozishda siz uchun eng muhim yordam qanday?',
    type: 'single',
    options: [
      'Namuna ishlar ko\'rish',
      'Bosqichma-bosqich yo\'riqnoma',
      'Shablonlar va andozalar',
      'Online maslahatlar',
      'AI yordamchi',
    ],
  },
  {
    id: 7,
    question: 'Umumiy baholash: Ilmiy ish yozish jarayoni qanchalik qiyin?',
    type: 'rating',
    options: ['1 — Oson', '2', '3 — O\'rtacha', '4', '5 — Juda qiyin'],
  },
  {
    id: 8,
    question: 'Ilmiy ishingizning qaysi bo\'limi yozish eng qiyin?',
    type: 'single',
    options: [
      'Kirish (dolzarbligi, maqsad, vazifalar)',
      'Nazariy qism (I Bob)',
      'Amaliy/tadqiqot qismi (II Bob)',
      'Xulosa va tavsiyalar',
    ],
  },
  {
    id: 9,
    question: 'Plagiarizm (ko\'chirma) muammosi bilan duch kelganmisiz?',
    type: 'single',
    options: [
      'Ha, jiddiy muammo bo\'ldi',
      'Ha, lekin hal qildim',
      'Yo\'q, muammo bo\'lmadi',
      'Plagiarizm tekshiruvidan o\'tmaganman',
    ],
  },
  {
    id: 10,
    question: 'Ilmiy ish yozishda qaysi dastur/vositalardan foydalanasiz?',
    type: 'multiple',
    options: [
      'Microsoft Word',
      'Google Docs',
      'ChatGPT / AI yordamchilar',
      'Mendeley / Zotero (adabiyotlar)',
      'Turnitin / Antiplagiat.uz',
      'LaTeX',
    ],
  },
  {
    id: 11,
    question: 'Ilmiy ishingizni qaysi tilda yozasiz?',
    type: 'single',
    options: [
      'O\'zbek tilida',
      'Rus tilida',
      'Ingliz tilida',
      'Bir necha tilda (annotatsiya va h.k.)',
    ],
  },
  {
    id: 12,
    question: 'Ilmiy ish topshirish muddatini qanday bajarasiz?',
    type: 'single',
    options: [
      'Har doim muddatidan oldin topshiraman',
      'Ko\'pincha muddatida topshiraman',
      'Ba\'zan kechiktiraman',
      'Ko\'pincha kechiktiraman',
    ],
  },
  {
    id: 13,
    question: 'Universitetingizda ilmiy ish yozishga qanday yordam ko\'rsatiladi?',
    type: 'multiple',
    options: [
      'Ilmiy rahbar tomonidan',
      'Maxsus kurslar/seminarlar orqali',
      'Kutubxona resurslari orqali',
      'Kafedra yo\'riqnomalari orqali',
      'Amalda yordam yo\'q',
    ],
  },
  {
    id: 14,
    question: 'Ilmiy ish mavzusini qanday tanladingiz?',
    type: 'single',
    options: [
      'O\'zim tanladim (qiziqishim bo\'yicha)',
      'Ilmiy rahbar taklif qildi',
      'Kafedra tayinladi',
      'Hali aniq emas / tanlamadim',
    ],
  },
  {
    id: 15,
    question: 'Bu ilova (EduNavigator) sizga qanchalik foydali?',
    type: 'rating',
    options: ['1 — Foydali emas', '2', '3 — O\'rtacha', '4', '5 — Juda foydali'],
  },
];

export default function SurveyScreen({ navigation }) {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();
  const st = t.survey;

  const handleSingleSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleMultipleSelect = (questionId, option) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      if (current.includes(option)) {
        return { ...prev, [questionId]: current.filter((o) => o !== option) };
      }
      return { ...prev, [questionId]: [...current, option] };
    });
  };

  const isAnswered = (questionId) => {
    const answer = answers[questionId];
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return true;
  };

  const answeredCount = SURVEY_QUESTIONS.filter((q) => isAnswered(q.id)).length;
  const progress = answeredCount / SURVEY_QUESTIONS.length;

  const handleSubmit = async () => {
    if (answeredCount < SURVEY_QUESTIONS.length) {
      Alert.alert(
        'Barcha savollar javoblanmadi',
        `Iltimos, barcha ${SURVEY_QUESTIONS.length} ta savolga javob bering. (${answeredCount}/${SURVEY_QUESTIONS.length})`,
        [{ text: 'OK' }]
      );
      return;
    }

    setSubmitting(true);
    try {
      const existing = await AsyncStorage.getItem('survey_responses');
      const responses = existing ? JSON.parse(existing) : [];
      responses.push({ answers, timestamp: new Date().toISOString() });
      await AsyncStorage.setItem('survey_responses', JSON.stringify(responses));
      setSubmitted(true);
    } catch (e) {
      Alert.alert('Xatolik', 'So\'rovnoma saqlanmadi. Qayta urinib ko\'ring.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>🎉</Text>
          <Text style={styles.successTitle}>{st.completed_title}</Text>
          <Text style={styles.successText}>{st.completed_text}</Text>
          <TouchableOpacity
            style={styles.resultsButton}
            onPress={() => navigation.navigate('Results')}
          >
            <Text style={styles.resultsButtonText}>{st.view_results}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => {
              setSubmitted(false);
              setAnswers({});
            }}
          >
            <Text style={styles.retakeButtonText}>{st.restart}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{st.header_title}</Text>
        <Text style={styles.headerSubtitle}>{st.header_subtitle}</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{answeredCount}/{SURVEY_QUESTIONS.length}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {SURVEY_QUESTIONS.map((question, qIndex) => (
          <View key={question.id} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={[
                styles.questionBadge,
                isAnswered(question.id) && styles.questionBadgeAnswered
              ]}>
                <Text style={styles.questionNumber}>
                  {isAnswered(question.id) ? '✓' : qIndex + 1}
                </Text>
              </View>
              <Text style={styles.questionText}>{question.question}</Text>
            </View>

            {question.type === 'multiple' && (
              <Text style={styles.multipleHint}>✅ {st.select_multiple}</Text>
            )}

            <View style={styles.optionsContainer}>
              {question.options.map((option, oIndex) => {
                const isSelected = question.type === 'multiple'
                  ? (answers[question.id] || []).includes(option)
                  : answers[question.id] === option;

                return (
                  <TouchableOpacity
                    key={oIndex}
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => {
                      if (question.type === 'multiple') {
                        handleMultipleSelect(question.id, option);
                      } else {
                        handleSingleSelect(question.id, option);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    {question.type === 'multiple' ? (
                      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                        {isSelected && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                    ) : (
                      <View style={[styles.optionDot, isSelected && styles.optionDotSelected]}>
                        {isSelected && <View style={styles.optionDotInner} />}
                      </View>
                    )}
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            answeredCount < SURVEY_QUESTIONS.length && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {answeredCount < SURVEY_QUESTIONS.length
                ? `${st.progress(answeredCount, SURVEY_QUESTIONS.length)}`
                : st.submit}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewResultsLink}
          onPress={() => navigation.navigate('Results')}
        >
          <Text style={styles.viewResultsLinkText}>{st.view_results} →</Text>
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
    marginBottom: spacing.sm,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accentLight,
    borderRadius: 3,
  },
  progressText: {
    color: colors.white,
    fontSize: typography.fontSizeSM,
    fontWeight: '700',
    minWidth: 35,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  questionBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
    flexShrink: 0,
  },
  questionBadgeAnswered: {
    backgroundColor: colors.success,
  },
  questionNumber: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  questionText: {
    fontSize: typography.fontSizeMD,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  multipleHint: {
    fontSize: typography.fontSizeXS,
    color: colors.primary,
    marginBottom: spacing.sm,
    marginLeft: 40,
    fontStyle: 'italic',
  },
  optionsContainer: {
    gap: spacing.xs,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    backgroundColor: colors.background,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EEF3FF',
  },
  optionDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  optionDotSelected: {
    borderColor: colors.primary,
  },
  optionDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.textLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    backgroundColor: colors.white,
  },
  checkboxSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  optionText: {
    fontSize: typography.fontSizeSM,
    color: colors.textSecondary,
    flex: 1,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: colors.textLight,
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: typography.fontSizeMD,
    fontWeight: '700',
  },
  viewResultsLink: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  viewResultsLinkText: {
    color: colors.primary,
    fontSize: typography.fontSizeSM,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  successIcon: {
    fontSize: 80,
    marginBottom: spacing.md,
  },
  successTitle: {
    fontSize: typography.fontSizeTitle,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  successText: {
    fontSize: typography.fontSizeMD,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  resultsButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  resultsButtonText: {
    color: colors.white,
    fontSize: typography.fontSizeMD,
    fontWeight: '700',
  },
  retakeButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  retakeButtonText: {
    color: colors.primary,
    fontSize: typography.fontSizeMD,
    fontWeight: '600',
  },
});
