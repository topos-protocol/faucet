import { Button, Form, Input } from 'antd'
import { useCallback } from 'react'

interface Values {
  address: string
}

const FaucetForm = () => {
  const onFinish = useCallback(({ address }: Values) => {
    console.log('Success:', address)
  }, [])

  const onFinishFailed = useCallback((errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }, [])

  return (
    <Form
      name="faucet"
      style={{ margin: '0 auto', maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        name="address"
        help="Available soon!"
        rules={[{ required: true, message: 'Please input your address!' }]}
      >
        <Input placeholder="Input your address" disabled={true} />
      </Form.Item>
      <br />
      <Form.Item>
        <Button type="primary" htmlType="submit" disabled>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default FaucetForm
