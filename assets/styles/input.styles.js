import { StyleSheet } from 'react-native'
import { COLORS } from '../../constants/Colors'

const styles = StyleSheet.create({
  searchBarContainer: {
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
})

export default styles
