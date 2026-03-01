import { StyleSheet } from 'react-native'
import { COLORS } from '../../constants/Colors'

export const styles = StyleSheet.create({
  startContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lottieStart: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  startTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  startSubtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  headerView: {
    flexDirection: 'column',
    rowGap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Daha iyi hizalama
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: COLORS.background, // Arka plan rengi
    elevation: 5, // Android için gölge efekti
    shadowColor: '#000', // iOS için gölge efekti
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  footer: {
    marginTop: 150,
  },
  scoreText: {
    fontSize: 20,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  questionCounter: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  timerContainer: {
    borderRadius: 20,
    backgroundColor: COLORS.error,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  timerText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  progressBarContainer: {
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 7,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressBar: {
    height: '100%',
    borderRadius: 7,
    backgroundColor: 'transparent', // gradient ekleyeceğiz
  },

  questionContainer: {
    backgroundColor: COLORS.cardBackground,
    padding: 25,
    borderRadius: 15,
    marginBottom: 30,
    elevation: 5,
    shadowColor: COLORS.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  questionText: {
    fontSize: 22,
    color: COLORS.textDark,
    textAlign: 'center',
    lineHeight: 30,
  },
  flagContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  flagImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  plateCode: {
    fontWeight: '700',
    fontSize: 26,
    color: COLORS.textPrimary,
  },
  positiveQuestion: {
    color: 'green',
  },

  negativeQuestion: {
    color: 'red',
  },
  optionButton: {
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 15, // Daha dengeli padding
    paddingVertical: 14, // Daha kompakt yapı
    borderRadius: 12,
    marginBottom: 15, // Daha az boşluk
    elevation: 5,
    overflow: 'hidden',
    flexDirection: 'row', // İçerikleri yatay hizala
    alignItems: 'center', // Dikey hizalamayı düzelt
    justifyContent: 'space-between', // İçerikleri dengeli dağıt
    transition: 'background-color 0.3s ease-in-out',
  },
  optionTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1, // İçeriklerin esnek olmasını sağla
  },
  optionView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Daha az boşluk
  },
  alphabetText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  optionText: {
    fontSize: 18,
    fontWeight:'600',
    color: COLORS.textPrimary,
    textAlign: 'left',
    flexShrink: 1, // Uzun metinlerin taşmasını önle
  },
  optionLottie: {
    width: 30, // Daha kompakt animasyon
    height: 30,
    position: 'absolute', // Kaymayı önlemek için sabitle
    right: 10, // Konumu ayarla
  },

  resultContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  lottieConfetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 30,
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 5,
  },
  scoreLabel: {
    fontSize: 20,
    color: 'white',
  },
  resultText: {
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: 40,
    textAlign: 'center',
  },
  restartButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: COLORS.textDark,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
})
