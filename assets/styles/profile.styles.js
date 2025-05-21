import { StyleSheet } from 'react-native'
import { COLORS } from '../../constants/Colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  profileCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.inputBackground,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: 15,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 15,
  },
  roleBadge: {
    backgroundColor: COLORS.store,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 5,
  },
  roleText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.inputBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoLabel: {
    color: COLORS.placeholderText,
    fontSize: 14,
  },
  infoValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },

  // address styles

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 8,
    gap: 8,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },

  addressList: {
    padding: 10,
    rowGap: 20,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    borderColor: COLORS.borderLight,
  },
  addressSection: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    gap: 10,
    justifyContent: 'space-between',
  },

  addressNumber: { fontWeight: '700', color: COLORS.primaryDark, fontSize: 18 },
  addressTitle: { fontWeight: '700', color: COLORS.primaryDark, fontSize: 18 },

  addressView: {
    flexDirection: 'row',
    columnGap: 10,
  },

  addressInfoView: {
    flexDirection: 'column',
  },

  icon: {
    padding: 4,
    backgroundColor: COLORS.background,
    borderRadius: 15,
  },
  actionIcons: {
    flexDirection: 'row',
    columnGap: 15,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 40,
    gap: 10,
    alignItems: 'center',
    width: '75%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  updateButton: {
    color: COLORS.warning,
    backgroundColor: COLORS.border,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  updateText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
})

export default styles
