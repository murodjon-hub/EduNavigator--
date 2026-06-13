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
  Modal,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

const SAMPLES = [
  {
    id: 1,
    type: 'BMI',
    icon: '🎓',
    color: '#1565C0',
    title: 'Namuna BM: Ta\'limda raqamli texnologiyalar',
    faculty: 'Informatika va AT',
    year: '2023',
    pages: 72,
    rating: '5.0',
    description: 'O\'zbekiston maktablarida raqamli ta\'lim vositalarini joriy etish samaradorligini o\'rganish.',
    sections: ['Kirish', 'Nazariy asoslar', 'Amaliy tadqiqot', 'Tavsiyalar', 'Xulosa'],
    tips: [
      'Dolzarb mavzu — 2023 yilgi dolzarb muammo',
      'Kuchli nazariy asos — 45 ta manba',
      'Amaliy tadqiqot natijalar bilan',
    ],
  },
  {
    id: 2,
    type: 'BMI',
    icon: '🎓',
    color: '#1565C0',
    title: 'Namuna BM: Marketing strategiyalari',
    faculty: 'Iqtisodiyot',
    year: '2023',
    pages: 68,
    rating: '4.8',
    description: 'O\'zbek kichik bizneslarida zamonaviy marketing strategiyalarini qo\'llash.',
    sections: ['Kirish', 'Nazariy qism', 'Tahlil', 'Tavsiyalar', 'Xulosa'],
    tips: [
      'Mahalliy tadqiqot — O\'zbek kompaniyalar misolida',
      'So\'rovnoma ma\'lumotlari bor',
      'Statistik tahlil qilingan',
    ],
  },
  {
    id: 3,
    type: 'Kurs ishi',
    icon: '📝',
    color: '#6A1B9A',
    title: 'Boshlang\'ich sinf matematika darslarida miqdorlarni o\'rganish metodikasi',
    faculty: 'Boshlang\'ich ta\'lim (309-guruh)',
    year: '2025',
    pages: 34,
    rating: '5.0',
    author: 'Buriyeva Shaxnoza Inat qizi',
    supervisor: 'Toshpo\'latova M.I',
    university: 'O\'zbekiston Milliy Pedagogika Universiteti (O\'zMPU)',
    description: 'Boshlang\'ich sinf matematika darslarida miqdor tushunchasini shakllantirish metodikasi, ko\'rgazmali va o\'yinli usullardan foydalanish.',
    sections: [
      'KIRISH',
      'I.BOB: Miqdor tushunchasi va uni o\'rgatishning nazariy asoslari',
      '  1.1. Miqdor tushunchasi va uning matematik mazmuni',
      '  1.2. Boshlang\'ich sinfda miqdorlarni o\'rgatishning o\'rni va vazifasi',
      'II.BOB: Miqdorlarni o\'rgatish metodikasi va dars jarayoni',
      '  2.1. Miqdorlarni o\'rgatishda qo\'llaniladigan metod va usullar',
      '  2.2. Darsda miqdor tushunchasini shakllantirishda ko\'rgazmalilik va o\'yinli usullar',
      'XULOSA',
      'FOYDALANILGAN ADABIYOTLAR (32 ta manba)',
    ],
    kirish: {
      dolzarbligi: 'Boshlang\'ich ta\'limda matematika fani o\'quvchilarning tafakkuri, mantiqiy fikrlashi, muammoli vaziyatlarni hal qilish ko\'nikmalarini shakllantirishda muhim o\'rin tutadi.',
      maqsad: 'Boshlang\'ich sinf matematika darslarida miqdor tushunchasini shakllantirishning samarali metodikasi va vositalarini o\'rganish, amaliy tavsiyalar ishlab chiqish.',
      vazifalar: [
        'Miqdor tushunchasining nazariy asoslarini o\'rganish',
        'Boshlang\'ich sinflarda miqdorlarni o\'rgatishning metodik xususiyatlarini aniqlash',
        'Dars jarayonida qo\'llaniladigan samarali usul va vositalarni tavsiflash',
        'Tajriba asosida metodik tavsiyalar ishlab chiqish',
      ],
      obyekt: 'Boshlang\'ich sinf matematika darslari',
      predmet: 'Matematika darslarida miqdor tushunchasini shakllantirish metodikasi',
      hajm: '2 bob, 4 bo\'limdan, shuningdek foydalanilgan adabiyotlar mavjud',
    },
    tips: [
      'Kirish qismi to\'liq va aniq yozilgan (dolzarbligi, maqsad, vazifalari)',
      'Nazariy asos kuchli — miqdor turlari tasniflanган',
      'Dars ishlanmasi mavjud (3-sinf, Narx-miqdor-qiymat)',
      'Ko\'rgazmali va o\'yinli metodlar batafsil ko\'rsatilgan',
      '32 ta manba — O\'zbek va xalqaro adabiyotlar',
    ],
  },
  {
    id: 4,
    type: 'Kurs ishi',
    icon: '📝',
    color: '#6A1B9A',
    title: 'Namuna kurs ishi: Bank tizimi tahlili',
    faculty: 'Moliya',
    year: '2024',
    pages: 38,
    rating: '4.7',
    description: 'O\'zbekiston bank tizimining rivojlanishi va zamonaviy holati tahlili.',
    sections: ['Kirish', 'I Bob', 'II Bob', 'Xulosa', 'Adabiyotlar'],
    tips: [
      'Jadvallar va grafiklar to\'g\'ri rasmiylashtirilgan',
      'So\'nggi statistik ma\'lumotlar',
      '20 ta sifatli manba',
    ],
  },
  {
    id: 5,
    type: 'Dissertatsiya',
    icon: '🏆',
    color: '#BF360C',
    title: 'Namuna magistrlik: Sun\'iy intellekt va ta\'lim',
    faculty: 'Pedagogika',
    year: '2023',
    pages: 98,
    rating: '5.0',
    description: 'Sun\'iy intellekt vositalaridan ta\'lim sifatini oshirishda foydalanish imkoniyatlari.',
    sections: ['Annotatsiya', 'Kirish', 'I Bob', 'II Bob', 'III Bob', 'Xulosa', 'Adabiyotlar'],
    tips: [
      'Uch tilda annotatsiya bor',
      '65 ta manba, 40% xorijiy',
      'Ilmiy yangilik aniq ifodalangan',
      'Empirik tadqiqot kuchli',
    ],
  },
  {
    id: 6,
    type: 'Ilmiy maqola',
    icon: '📰',
    color: '#00695C',
    title: 'Namuna maqola: E-commerce O\'zbekistonda',
    faculty: 'Iqtisodiyot',
    year: '2024',
    pages: 12,
    rating: '4.8',
    description: 'O\'zbekistonda elektron tijorat rivojlanishini taqiqlovchi omillar tahlili.',
    sections: ['Muqaddima', 'Adabiyotlar sharhi', 'Metodologiya', 'Natijalar', 'Xulosa'],
    tips: [
      'IMRaD uslubida yozilgan',
      'Xalqaro jurnal formati',
      'Qisqa va aniq yozilgan',
    ],
  },
];

const TEMPLATES = [
  {
    name: 'BMI titul varog\'i',
    icon: '📄',
    desc: 'O\'zMPU standart shakli',
    color: '#1565C0',
  },
  {
    name: 'Kurs ishi reja shakli',
    icon: '📋',
    desc: 'Standart reja shablon',
    color: '#6A1B9A',
  },
  {
    name: 'Adabiyotlar ro\'yxati (GOST)',
    icon: '📚',
    desc: 'GOST 7.32 uslubida',
    color: '#00695C',
  },
  {
    name: 'Dissertatsiya annotatsiya',
    icon: '📝',
    desc: '3 tilda annotatsiya shakli',
    color: '#BF360C',
  },
];

function SampleModal({ sample, visible, onClose }) {
  if (!sample) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={[styles.modalHeader, { backgroundColor: sample.color }]}>
            <Text style={styles.modalIcon}>{sample.icon}</Text>
            <Text style={styles.modalTitle}>{sample.title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            <View style={styles.modalInfoRow}>
              <Text style={styles.modalInfoItem}>🏫 {sample.faculty}</Text>
              <Text style={styles.modalInfoItem}>📅 {sample.year}</Text>
              <Text style={styles.modalInfoItem}>📄 {sample.pages} bet</Text>
              <Text style={styles.modalInfoItem}>⭐ {sample.rating}</Text>
            </View>
            {sample.author && (
              <View style={styles.modalAuthorBox}>
                <Text style={styles.modalAuthorText}>✍️ Muallif: {sample.author}</Text>
                {sample.supervisor && <Text style={styles.modalAuthorText}>👨‍🏫 Rahbar: {sample.supervisor}</Text>}
                {sample.university && <Text style={styles.modalAuthorText}>🏛️ {sample.university}</Text>}
              </View>
            )}
            <Text style={styles.modalDesc}>{sample.description}</Text>
            <Text style={styles.modalSectionTitle}>📐 Tuzilma:</Text>
            {sample.sections.map((s, i) => (
              <Text key={i} style={styles.modalSection}>  {i + 1}. {s}</Text>
            ))}
            <Text style={styles.modalSectionTitle}>✨ Afzalliklari:</Text>
            {sample.tips.map((t, i) => (
              <Text key={i} style={styles.modalTip}>✅ {t}</Text>
            ))}
            {sample.kirish && (
              <>
                <Text style={styles.modalSectionTitle}>🚪 Kirish qismi:</Text>
                <View style={styles.kirishBox}>
                  <Text style={styles.kirishRow}><Text style={styles.kirishKey}>Dolzarbligi: </Text>{sample.kirish.dolzarbligi}</Text>
                  <Text style={styles.kirishRow}><Text style={styles.kirishKey}>Maqsad: </Text>{sample.kirish.maqsad}</Text>
                  <Text style={styles.kirishKey}>Vazifalar:</Text>
                  {sample.kirish.vazifalar && sample.kirish.vazifalar.map((v, i) => (
                    <Text key={i} style={styles.kirishRow}>  {i + 1}. {v}</Text>
                  ))}
                  {sample.kirish.obyekt && <Text style={styles.kirishRow}><Text style={styles.kirishKey}>Obyekt: </Text>{sample.kirish.obyekt}</Text>}
                  {sample.kirish.predmet && <Text style={styles.kirishRow}><Text style={styles.kirishKey}>Predmet: </Text>{sample.kirish.predmet}</Text>}
                </View>
              </>
            )}
            <TouchableOpacity
              style={[styles.downloadBtn, { backgroundColor: sample.color }]}
              onPress={onClose}
            >
              <Text style={styles.downloadText}>✓ Yopish</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function SamplesScreen() {
  const { t } = useLanguage();
  const st = t.samples;
  const [filter, setFilter] = useState('all');
  const [selectedSample, setSelectedSample] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filters = [
    { key: 'all', label: st.filter_all },
    { key: 'BMI', label: 'BMI' },
    { key: 'Kurs ishi', label: 'Kurs ishi' },
    { key: 'Dissertatsiya', label: 'Dissertatsiya' },
    { key: 'Ilmiy maqola', label: 'Ilmiy maqola' },
  ];
  const filtered = filter === 'all' ? SAMPLES : SAMPLES.filter((s) => s.type === filter);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{st.header_title}</Text>
        <Text style={styles.headerSubtitle}>{st.header_subtitle}</Text>
      </View>

      {/* Filter Row */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, filter === f.key && styles.filterActive]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Samples */}
        <Text style={styles.sectionTitle}>📚 Namuna ishlar ({filtered.length})</Text>
        {filtered.map((sample) => (
          <TouchableOpacity
            key={sample.id}
            style={styles.sampleCard}
            onPress={() => {
              setSelectedSample(sample);
              setModalVisible(true);
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.sampleType, { backgroundColor: sample.color }]}>
              <Text style={styles.sampleTypeText}>{sample.type}</Text>
            </View>
            <View style={styles.sampleBody}>
              <Text style={styles.sampleTitle}>{sample.title}</Text>
              <View style={styles.sampleMeta}>
                <Text style={styles.sampleMetaText}>🏫 {sample.faculty}</Text>
                <Text style={styles.sampleMetaText}>📄 {sample.pages} bet</Text>
                <Text style={styles.sampleMetaText}>⭐ {sample.rating}</Text>
              </View>
              <Text style={styles.sampleDesc} numberOfLines={2}>{sample.description}</Text>
            </View>
            <Text style={[styles.sampleArrow, { color: sample.color }]}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Templates */}
        <Text style={styles.sectionTitle}>📋 Shablonlar va andozalar</Text>
        <View style={styles.templatesGrid}>
          {TEMPLATES.map((t, i) => (
            <TouchableOpacity
              key={i}
              style={styles.templateCard}
              onPress={() =>
                Alert.alert(
                  t.name,
                  'Shablon yuklab olish funksiyasi keyingi versiyada qo\'shiladi.',
                  [{ text: 'OK' }]
                )
              }
              activeOpacity={0.7}
            >
              <View style={[styles.templateIconBg, { backgroundColor: t.color + '15' }]}>
                <Text style={styles.templateIcon}>{t.icon}</Text>
              </View>
              <Text style={[styles.templateName, { color: t.color }]}>{t.name}</Text>
              <Text style={styles.templateDesc}>{t.desc}</Text>
              <Text style={[styles.downloadLink, { color: t.color }]}>⬇️ Yuklab olish</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips for using samples */}
        <View style={styles.usageTipsCard}>
          <Text style={styles.usageTipsTitle}>💡 Namunalardan qanday foydalanish kerak?</Text>
          {[
            '✅ Faqat tuzilma va uslubni ko\'rib chiqing — mazmunan ko\'chirmang',
            '✅ Adabiyotlar rasmiylash formatiga e\'tibor bering',
            '✅ Jadval va rasmlar bezatilish usulini kuzating',
            '✅ Kirish va xulosa yozish uslubini o\'rganing',
            '⚠️ Hech qachon namunani to\'liq ko\'chirish plagiarizm hisoblanadi!',
          ].map((tip, i) => (
            <Text key={i} style={styles.usageTip}>{tip}</Text>
          ))}
        </View>
      </ScrollView>

      <SampleModal
        sample={selectedSample}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
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
  },
  filterContainer: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginRight: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  filterActive: {
    backgroundColor: colors.white,
  },
  filterText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.fontSizeSM,
    fontWeight: '600',
  },
  filterTextActive: {
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
  sectionTitle: {
    fontSize: typography.fontSizeMD,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  sampleCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  sampleType: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    alignSelf: 'stretch',
  },
  sampleTypeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
    transform: [{ rotate: '-90deg' }],
    width: 60,
    textAlign: 'center',
  },
  sampleBody: {
    flex: 1,
    padding: spacing.md,
  },
  sampleTitle: {
    fontSize: typography.fontSizeSM,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  sampleMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  sampleMetaText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  sampleDesc: {
    fontSize: typography.fontSizeXS,
    color: colors.textLight,
    lineHeight: 16,
  },
  sampleArrow: {
    fontSize: 28,
    marginRight: spacing.sm,
    fontWeight: '300',
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  templateCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  templateIconBg: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  templateIcon: {
    fontSize: 22,
  },
  templateName: {
    fontSize: typography.fontSizeSM,
    fontWeight: '700',
    marginBottom: 2,
  },
  templateDesc: {
    fontSize: typography.fontSizeXS,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  downloadLink: {
    fontSize: typography.fontSizeXS,
    fontWeight: '600',
  },
  usageTipsCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  usageTipsTitle: {
    fontSize: typography.fontSizeMD,
    fontWeight: '700',
    color: '#E65100',
    marginBottom: spacing.sm,
  },
  usageTip: {
    fontSize: typography.fontSizeSM,
    color: '#4E342E',
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  modalIcon: {
    fontSize: 28,
    marginRight: spacing.sm,
  },
  modalTitle: {
    color: colors.white,
    fontSize: typography.fontSizeMD,
    fontWeight: '700',
    flex: 1,
    lineHeight: 22,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  modalBody: {
    padding: spacing.md,
  },
  modalInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  modalInfoItem: {
    fontSize: typography.fontSizeSM,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modalAuthorBox: {
    backgroundColor: '#F3E5F5',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#6A1B9A',
  },
  modalAuthorText: {
    fontSize: typography.fontSizeSM,
    color: '#4A148C',
    marginBottom: 2,
    lineHeight: 20,
    fontWeight: '500',
  },
  modalDesc: {
    fontSize: typography.fontSizeSM,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  modalSectionTitle: {
    fontSize: typography.fontSizeMD,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  modalSection: {
    fontSize: typography.fontSizeSM,
    color: colors.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  modalTip: {
    fontSize: typography.fontSizeSM,
    color: '#2E7D32',
    marginBottom: 4,
    lineHeight: 20,
  },
  kirishBox: {
    backgroundColor: '#F3E5F5',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#7B1FA2',
  },
  kirishRow: {
    fontSize: typography.fontSizeXS,
    color: '#4A148C',
    lineHeight: 18,
    marginBottom: 4,
  },
  kirishKey: {
    fontWeight: '700',
    color: '#6A1B9A',
    fontSize: typography.fontSizeXS,
  },
  downloadBtn: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  downloadText: {
    color: colors.white,
    fontSize: typography.fontSizeMD,
    fontWeight: '700',
  },
});
