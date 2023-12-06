import { Result, Space } from 'antd'

import logo from '/logo.svg'

interface Props {
  children: React.ReactNode
}

const Content = ({ children }: Props) => {
  return (
    <Space direction="vertical">
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
