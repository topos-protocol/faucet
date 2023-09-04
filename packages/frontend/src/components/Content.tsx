import { Alert, Button, Result, Space, Typography } from 'antd'

import logo from '/logo.svg'
import { INFO } from '../constants/wordings'

const { Text } = Typography

interface Props {
  children: React.ReactNode
}

const Content = ({ children }: Props) => {
  return (
    <Space direction="vertical">
      <Alert
        message={
          <Space direction="vertical" size={0}>
            <Text>{INFO.JOIN_BUILDERS_PROGRAM}</Text>
            <Text>
              <Space>
                👉
                <Button
                  href="https://builders.toposware.com/topos-builders-program-v1-0"
                  target="_blank"
                  type="link"
                  style={{ paddingLeft: '0.2rem', paddingRight: '0.2rem' }}
                >
                  {INFO.BUILDERS_PROGRAM}
                </Button>
              </Space>
            </Text>
          </Space>
        }
        banner
        type="info"
      />
      <Result
        title="Topos Faucet"
        subTitle={
          <>
            <div>
              Request 1 subnet native asset of multiple subnets to participate
              in Topos testnet!
            </div>
            <div>
              The Topos faucet is limited to one request per 24h so be sure to
              select all the needed subnets!
            </div>
          </>
        }
        icon={<img src={logo} width={200} />}
        extra={[<div key="form">{children}</div>]}
      />
    </Space>
  )
}

export default Content
