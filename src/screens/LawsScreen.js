import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Linking,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { useResponsive } from '../hooks/useResponsive';

const LAWS = [
  {
    id: 1,
    category: 'Qonunlar',
    icon: '🏛️',
    color: '#1565C0',
    items: [
      {
        title: 'O\'zbekiston Respublikasining "Ta\'lim to\'g\'risidagi" qonuni 1-modda',
        number: '2020 yil 9 sentyabr',
        description: 'Ta\'lim sohasidagi barcha munosabatlarni huquqiy tartibga solish.',
      },
      {
        title: 'O\'zbekiston Respublikasining "Ta\'lim to\'g\'risidagi" qonuni 4-modda',
        number: '2020 yil 9 sentyabr',
        description: 'Ta\'lim sohasining asosiy prinsiplari.',
      },
      {
        title: 'O\'zbekiston Respublikasining "Pedagogning maqomi to\'g\'risida"gi qonuni',
        number: '01.02.2024, O\'RQ-901-son',
        description: 'Pedagog xodimlarning huquqlari, kafolatlari va majburiyatlari.',
      },
      {
        title: 'O\'zbekiston Respublikasining "Fan va ilmiy faoliyat to\'g\'risida"gi qonuni',
        number: '29.10.2019, O\'RQ-576-son',
        description: 'Ilmiy tadqiqot va ilmiy-texnik faoliyatni tartibga soladi.',
      },
      {
        title: 'O\'zbekiston Respublikasining "Bola huquqlarining kafolatlari to\'g\'risida"gi qonuni',
        number: '07.01.2008, O\'RQ-139-son',
        description: 'Bolalar va yoshlar huquqlarini himoya qilish.',
      },
      {
        title: 'O\'zbekiston Respublikasining "Yoshlarga oid davlat siyosati to\'g\'risida"gi qonuni',
        number: '14.09.2016, O\'RQ-406-son',
        description: 'Yoshlarni qo\'llab-quvvatlash va rivojlantirish davlat siyosati.',
      },
      {
        title: 'O\'zbekiston Respublikasining "Axborot-kutubxona faoliyati to\'g\'risida"gi qonuni',
        number: '13.04.2011, O\'RQ-280-son',
        description: 'Kutubxona va axborot resurslaridan foydalanish tartibi.',
      },
      {
        title: 'O\'zbekiston Respublikasining "Davlat tili haqida"gi qonuni',
        number: '04.09.2015, O\'RQ-394-son',
        description: 'Davlat tili sifatida o\'zbek tilidan foydalanish qoidalari.',
      },
      {
        title: 'O\'zbekiston Respublikasining "Maktabgacha ta\'lim va tarbiya to\'g\'risida"gi qonuni',
        number: '16.12.2019, O\'RQ-595-son',
        description: 'Maktabgacha ta\'lim tizimini tartibga soluvchi asosiy qonun.',
      },
      {
        title: 'O\'zbekiston Respublikasining "Ta\'lim to\'g\'risidagi" qonuni 4-modda (takror)',
        number: '2020 yil 9 sentyabr',
        description: 'Ta\'lim sohasining asosiy prinsiplari — kengaytirilgan talqin.',
      },
    ],
  },
  {
    id: 2,
    category: 'Prezident Qarorlari',
    icon: '📜',
    color: '#6A1B9A',
    items: [
      {
        title: '"Oliy ta\'lim tizimini yanada rivojlantirish chora-tadbirlari to\'g\'risida"gi qarori',
        number: '20.04.2017, PQ-2909-son',
        description: 'Oliy ta\'lim sifatini oshirish va modernizatsiya qilish choralari.',
      },
      {
        title: '"O\'rta maxsus, Kasb-hunar ta\'limi muassasalari faoliyatini takomillashtirish to\'g\'risida"gi qarori',
        number: '14.03.2017, PQ-2829-son',
        description: 'O\'rta maxsus ta\'lim muassasalarini rivojlantirish.',
      },
      {
        title: '"Sog\'lom ona va bola yili davlat dasturi to\'g\'risida"gi qarori',
        number: '09.02.2016, PQ-2487-son',
        description: 'Ona va bola sog\'ligini himoya qilish davlat dasturi.',
      },
      {
        title: '"O\'zbekistonda ta\'lim sifati va samaradorligini oshirish loyihasini amalga oshirish to\'g\'risida"gi qarori',
        number: '28.04.2025, PQ-152-son',
        description: 'Ta\'lim sifatini oshirishning amaliy choralari.',
      },
      {
        title: '"O\'quvchilarni xorijiy va zamonaviy kasblarga o\'qitish bo\'yicha qo\'shimcha chora-tadbirlar to\'g\'risida"gi qarori',
        number: '02.02.2024, PQ-53-son',
        description: 'Zamonaviy kasb-hunar ta\'limini rivojlantirish.',
      },
      {
        title: '"Ta\'lim sohasidagi loyihalar markazi faoliyatini tashkil etish to\'g\'risida"gi qarori',
        number: '02.02.2024, PQ-54-son',
        description: 'Ta\'lim loyihalari markazini tashkil etish.',
      },
      {
        title: '"Maktabgacha va maktab ta\'limi tashkilotlari xodimlarini uzluksiz kasbiy rivojlantirish tizimini takomillashtirish to\'g\'risida"gi qarori',
        number: '21.06.2024, PQ-231-son',
        description: 'Pedagog kadrlarni uzluksiz kasbiy rivojlantirish.',
      },
      {
        title: '"Yoshlarni xorijiy tillarga o\'qitish tizimi samaradorligini oshirish to\'g\'risida"gi qarori',
        number: '27.06.2024, PQ-239-son',
        description: 'Xorijiy tillarni o\'qitish sifatini oshirish choralari.',
      },
      {
        title: '"Iqtidorli yoshlar bilan ishlash tizimini takomilashtirish to\'g\'risida"gi qarori',
        number: '30.09.2024, PQ-346-son',
        description: 'Iqtidorli yoshlarni aniqlash va qo\'llab-quvvatlash tizimi.',
      },
    ],
  },
  {
    id: 3,
    category: 'Vazirlar Mahkamasi Qarorlari',
    icon: '🏢',
    color: '#00695C',
    items: [
      {
        title: '"Ta\'lim tizimida ma\'naviy-ma\'rifiy ishlar samaradorligini oshirish chora-tadbirlari to\'g\'risida"gi qarori',
        number: '17.09.2018, VMQ-736-son',
        description: 'Ta\'lim muassasalarida ma\'naviy-ma\'rifiy ishlarni tashkil etish.',
      },
      {
        title: '"Oliy ta\'lim muassasalarini o\'quv adabiyotlari bilan ta\'minlash to\'g\'risida"gi qarori',
        number: '10.10.2018, VMQ-816-son',
        description: 'Oliy ta\'lim uchun o\'quv adabiyotlari bilan ta\'minlash tartibi.',
      },
      {
        title: '"Oliy ta\'lim muassasalari rahbar va pedagog kadrlarining malakasini oshirish tizimini takomillashtirish to\'g\'risida"gi qarori',
        number: '24.09.2019, VMQ-797-son',
        description: 'Pedagog kadrlar malakasini oshirish tizimi.',
      },
      {
        title: '"Oliy ta\'lim muassasalarida ta\'lim jarayonini tashkil etish tizimini takomillashtirish chora-tadbirlari to\'g\'risida"gi qarori',
        number: '31.12.2020, VMQ-824-son',
        description: 'Oliy ta\'limda o\'quv jarayonini tashkil etish qoidalari.',
      },
      {
        title: '"Lotin yozuviga asoslangan o\'zbek alifbosiga bosqichma-bosqich to\'liq o\'tishni ta\'minlash chora-tadbirlari to\'g\'risida"gi qarori',
        number: '10.02.2021, VMQ-61-son',
        description: 'Lotin yozuviga to\'liq o\'tish bosqichlari.',
      },
      {
        title: '"Kasbiy ta\'lim tashkilotlari o\'quvchilarining ishlab chiqarish amaliyotini tashkil etish tizimini takomillashtirish to\'g\'risida"gi qarori',
        number: '28.12.2024, VMQ-900-son',
        description: 'Ishlab chiqarish amaliyotini tashkil etish tartibi.',
      },
      {
        title: '"Oliy ta\'lim tizimida dual ta\'limni tashkil etish chora-tadbirlari to\'g\'risida"gi qarori',
        number: '16.01.2025, VMQ-14-son',
        description: 'Oliy ta\'limda dual ta\'lim tizimini joriy etish.',
      },
      {
        title: '"Umumiy o\'rta ta\'lim muassasalarida o\'quvchilarni kasb-hunarga o\'qitishda tadbirkorlik subyektlarini jalb etish chora-tadbirlari to\'g\'risida"gi qarori',
        number: '11.02.2025, VMQ-78-son',
        description: 'Kasb-hunar ta\'limiga tadbirkorlarni jalb etish.',
      },
      {
        title: '"Pedagoglarni attestatsiyadan o\'tkazish va kasbiy sertifikatlash tizimini takomillashtirish to\'g\'risida"gi qarori',
        number: '28.02.2025, VMQ-130-son',
        description: 'Pedagog kadrlarni attestatsiyadan o\'tkazish tartibi.',
      },
      {
        title: '"Uzluksiz ta\'lim tizimida yoshlarni milliy qadriyatlarga sadoqat va vatanparvarlik ruhida tarbiyalash dasturini tasdiqlash to\'g\'risida"gi qarori',
        number: '28.01.2026, VMQ-34-son',
        description: 'Yoshlarni vatanparvarlik ruhida tarbiyalash dasturi.',
      },
    ],
  },
  {
    id: 4,
    category: 'Prezident Farmonlari',
    icon: '📋',
    color: '#BF360C',
    items: [
      {
        title: '"Ta\'lim-tarbiya va kadrlar tayyorlash tizimini tubdan isloh qilish to\'g\'risida"gi farmoni',
        number: '06.10.1997, PF-1869-son',
        description: 'Ta\'lim va kadrlar tayyorlash tizimini isloh qilishning asosiy yo\'nalishlari.',
      },
      {
        title: '"O\'zbekiston Respublikasini yanada rivojlantirish bo\'yicha Harakatlar strategiyasi to\'g\'risida"gi farmoni',
        number: '07.02.2017, PF-4947-son',
        description: '2017–2021 yillarga mo\'ljallangan Harakatlar strategiyasi.',
      },
      {
        title: '"Oliy o\'quv yurtidan keyingi ta\'lim tizimini yanada takomillashtirish to\'g\'risida"gi farmoni',
        number: '16.02.2017, PF-4958-son',
        description: 'Doktorantura va magistratura tizimini rivojlantirish.',
      },
      {
        title: '"Oliy ma\'lumotli mutaxassislar tayyorlash sifatini oshirish chora-tadbirlari to\'g\'risida"gi farmoni',
        number: '27.07.2017, PF-5121-son',
        description: 'Oliy ma\'lumotli kadrlar tayyorlash sifatini oshirish.',
      },
      {
        title: '"Xalq ta\'limi tizimiga boshqaruvning yangi tamoyillarini joriy etish to\'g\'risida"gi farmoni',
        number: '05.09.2018, PF-5538-son',
        description: 'Ta\'limni boshqarishning yangi tamoyillarini joriy etish.',
      },
      {
        title: '"O\'zbekiston Respublikasi xalq ta\'limi tizimini 2030-yilgacha rivojlantirish konsepsiyasini tasdiqlash to\'g\'risida"gi farmoni',
        number: '29.04.2019, PF-6108-son',
        description: 'Ta\'limni 2030 yilgacha rivojlantirish konsepsiyasi.',
      },
      {
        title: '"O\'zbekistonning yangi taraqqiyot davrida ta\'lim-tarbiya va ilm-fan sohalarini rivojlantirish chora-tadbirlari to\'g\'risida"gi farmoni',
        number: '06.11.2020, PF-6108-son',
        description: 'Ta\'lim va ilm-fan sohalarini rivojlantirish yangi choralari.',
      },
      {
        title: '"2022–2026-yillarga mo\'ljallangan Taraqqiyot strategiyasi to\'g\'risida"gi farmoni',
        number: '28.01.2022, PF-60-son',
        description: 'Besh yillik Taraqqiyot strategiyasi asosiy yo\'nalishlari.',
      },
      {
        title: '"O\'zbekiston–2030 strategiyasi to\'g\'risida"gi farmoni',
        number: '11.09.2023, PF-158-son',
        description: 'O\'zbekistonning 2030 yilgacha rivojlanish strategiyasi.',
      },
      {
        title: '"Maktabgacha va maktab ta\'limi sohasida davlat boshqaruvi tizimini takomillashtirish to\'g\'risida"gi farmoni',
        number: '02.07.2024, PF-98-son',
        description: 'Maktabgacha va maktab ta\'limini boshqarish tizimi.',
      },
      {
        title: '"Maktabgacha va maktab ta\'limi sohasida boshqaruv tizimi samaradorligini oshirish to\'g\'risida"gi farmoni',
        number: '19.03.2025, PF-51-son',
        description: 'Ta\'lim boshqaruvi samaradorligini oshirish choralari.',
      },
      {
        title: '"Pedagog kadrlar tayyorlash tizimini 2030-yilgacha rivojlantirish to\'g\'risida"gi farmoni',
        number: '28.04.2025, PF-73-son',
        description: 'Pedagog kadrlar tayyorlash strategiyasi.',
      },
      {
        title: '"Kasbiy ta\'lim tizimini rivojlantirish va boshqaruv samaradorligini oshirish to\'g\'risida"gi farmoni',
        number: '23.10.2025, PF-190-son',
        description: 'Kasbiy ta\'lim tizimini modernizatsiya qilish.',
      },
      {
        title: '"Maktabgacha ta\'lim va tarbiya tizimini yanada takomillashtirish to\'g\'risida"gi farmoni',
        number: '05.02.2026, PF-19-son',
        description: 'Maktabgacha ta\'lim tizimini yanada yaxshilash choralari.',
      },
    ],
  },
];

const REQUIREMENTS = [
  {
    title: 'Oliy ta\'lim talablari',
    icon: '🎓',
    items: [
      'BM — kamida 60 sahifa, 70% original matn',
      'Magistrlik — kamida 80 sahifa, 85% original matn',
      'Kurs ishi — 25-40 sahifa, 75% original matn',
      'Manbalar GOST yoki APA uslubida rasmiylashtirilishi shart',
      'Barcha jadval va rasmlar sarlavhali bo\'lishi kerak',
    ],
  },
  {
    title: 'Topshirish muddatlari',
    icon: '📅',
    items: [
      'BM: Yakuniy davr boshlanishidan 2 hafta oldin',
      'Magistrlik: Himoyadan 1 oy oldin kafedrada taqdimot',
      'Kurs ishi: Semestr yakuniga 2 hafta qolguncha',
      'Plagiarizm tekshiruvi topshirish bilan birga',
    ],
  },
];

function LawItem({ item }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity
      style={styles.lawItem}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.lawItemHeader}>
        <Text style={styles.lawTitle}>{item.title}</Text>
        <Text style={styles.expandIcon}>{expanded ? '▲' : '▼'}</Text>
      </View>
      <Text style={styles.lawNumber}>{item.number}</Text>
      {expanded && (
        <View style={styles.lawDetails}>
          <Text style={styles.lawDescription}>{item.description}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function LawsScreen({ navigation }) {
  const { isDesktop } = useResponsive();
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Orqaga</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⚖️ Qonunlar va me'yorlar</Text>
        <Text style={styles.headerSubtitle}>Ilmiy ish yozishga oid huquqiy asoslar</Text>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, isDesktop && styles.scrollContentDesktop]}
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Ilmiy ish yozishda qonunlarni bilish plagirizm va huquqiy muammolardan saqlaydi.
            Kategoriyaga bosing — batafsil ma'lumot ochiladi.
          </Text>
        </View>

        {/* Laws by Category */}
        <View style={isDesktop ? styles.lawsCategoriesDesktop : null}>
        {LAWS.map((category) => (
          <View key={category.id} style={[styles.categorySection, isDesktop && styles.categorySectionDesktop]}>
            <View style={[styles.categoryHeader, { borderLeftColor: category.color }]}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[styles.categoryTitle, { color: category.color }]}>
                {category.category}
              </Text>
            </View>
            {category.items.map((item, index) => (
              <LawItem key={index} item={item} />
            ))}
          </View>
        ))}
        </View>

        {/* Requirements */}
        {REQUIREMENTS.map((req, index) => (
          <View key={index} style={styles.reqSection}>
            <Text style={styles.reqTitle}>{req.icon} {req.title}</Text>
            <View style={styles.reqCard}>
              {req.items.map((item, i) => (
                <View key={i} style={styles.reqItem}>
                  <View style={styles.reqDot} />
                  <Text style={styles.reqText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Useful Links */}
        <View style={styles.linksCard}>
          <Text style={styles.linksTitle}>🔗 Foydali havolalar</Text>
          {[
            { label: 'Lex.uz — O\'zbekiston qonunlari bazasi', url: 'https://lex.uz' },
            { label: 'ZiyoNet — Ta\'lim portali', url: 'https://ziyonet.uz' },
            { label: 'VAK — Oliy Attestatsiya Komissiyasi', url: 'https://vak.uz' },
          ].map((link, index) => (
            <TouchableOpacity
              key={index}
              style={styles.linkItem}
              onPress={() => Linking.openURL(link.url)}
            >
              <Text style={styles.linkText}>{link.label}</Text>
              <Text style={styles.linkArrow}>→</Text>
            </TouchableOpacity>
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
  infoBanner: {
    backgroundColor: '#E3F2FD',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSizeSM,
    color: '#1565C0',
    lineHeight: 22,
  },
  categorySection: {
    marginBottom: spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    paddingLeft: spacing.sm,
    marginBottom: spacing.xs,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  categoryTitle: {
    fontSize: typography.fontSizeMD,
    fontWeight: '700',
  },
  lawItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  lawItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  lawTitle: {
    fontSize: typography.fontSizeSM,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
    lineHeight: 20,
  },
  expandIcon: {
    fontSize: 10,
    color: colors.textLight,
  },
  lawNumber: {
    fontSize: typography.fontSizeXS,
    color: colors.primary,
    marginTop: 2,
    fontStyle: 'italic',
  },
  lawDetails: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  lawDescription: {
    fontSize: typography.fontSizeSM,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  relevanceBox: {
    backgroundColor: '#F3F8FF',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  relevanceLabel: {
    fontSize: typography.fontSizeXS,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  relevanceText: {
    fontSize: typography.fontSizeXS,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  reqSection: {
    marginBottom: spacing.md,
  },
  reqTitle: {
    fontSize: typography.fontSizeMD,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  reqCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  reqItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  reqDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: spacing.sm,
  },
  reqText: {
    fontSize: typography.fontSizeSM,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  linksCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: spacing.md,
  },
  linksTitle: {
    fontSize: typography.fontSizeMD,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  linkText: {
    fontSize: typography.fontSizeSM,
    color: colors.primary,
    fontWeight: '500',
    flex: 1,
  },
  linkArrow: {
    color: colors.primary,
    fontWeight: '700',
  },
  scrollContentDesktop: {
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },
  lawsCategoriesDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categorySectionDesktop: {
    width: '48%',
  },
});
