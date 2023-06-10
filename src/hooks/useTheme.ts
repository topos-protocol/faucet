import { theme } from 'antd'

export default function useTheme() {
  const { token } = theme.useToken()
  token.colorPrimary = '#27c794'
  token.colorPrimaryHover = '#27c794'
  token.colorLink = '#27c794'
  token.colorLinkHover = '#27c794'

  return token
}
