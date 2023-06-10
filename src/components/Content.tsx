import { Alert, Button, Result, Space, Typography } from 'antd'

import logo from '/logo.svg'
import { useCallback, useContext, useMemo } from 'react'
import useTracingCreateSpan from '../hooks/useTracingCreateSpan'
import { TracingContext } from '../contexts/tracing'
import { INFO } from '../constants/wordings'

const { Text } = Typography

interface Props {
  children: React.ReactNode
}

const Content = ({ children }: Props) => {
  const { rootSpan } = useContext(TracingContext)
  const span = useMemo(
    () => useTracingCreateSpan('show-content', rootSpan),
    [rootSpan]
  )

  const handleClick = useCallback(() => {
    span.addEvent('click on builders program link')
    span.end()
    rootSpan?.end()
  }, [span])

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
                  onClick={handleClick}
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
        subTitle="Request TOPOS to participate in Topos testnet!"
        icon={<img src={logo} width={200} />}
        extra={[<div key="form">{children}</div>]}
      />
    </Space>
  )
}

export default Content
