import { apm } from '@elastic/apm-rum'
import { Button, Form, Input, Spin } from 'antd'
import ReCAPTCHA from 'react-google-recaptcha'
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react'

import { ERROR } from '../constants/wordings'
import { SubnetsContext } from '../contexts/subnets'
import useGetSubnetAsset from '../hooks/useGetSubnetAsset'
import SubnetSelect from './SubnetSelect'
import { ErrorsContext } from '../contexts/errors'

interface Values {
  address: string
  subnetIds: string[]
}

const FaucetForm = () => {
  const { loading, getSubnetAsset } = useGetSubnetAsset()
  const { setErrors } = useContext(ErrorsContext)
  const recaptchaRef = useRef<any>()

  const isReCaptchaConfigured = useMemo(
    () => Boolean(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
    []
  )

  useEffect(
    function errorIfNoReCaptcha() {
      if (!isReCaptchaConfigured) {
        setErrors((e) => [
          ...e,
          `ReCaptacha configuration is missing the site key (VITE_RECAPTCHA_SITE_KEY)`,
        ])
      }
    },
    [isReCaptchaConfigured]
  )

  const [form] = Form.useForm()

  const { data: registeredSubnets, loading: getRegisteredSubnetsLoading } =
    useContext(SubnetsContext)

  const onFinish = useCallback(
    ({ address, subnetIds }: Values) => {
      recaptchaRef?.current?.execute()

      const transaction = apm.startTransaction('app', 'app', { managed: true })
      const span = transaction?.startSpan('faucet-form', 'app', {
        blocking: true,
      })
      span?.addLabels({
        registeredSubnets: JSON.stringify(registeredSubnets),
      })
      const traceparent = `00-${(span as any).traceId}-${(span as any).id}-01`

      const subnetEnpoints = subnetIds
        .map((id) => {
          const subnet = registeredSubnets?.find((s) => s.id === id)!
          return subnet.endpointWs || subnet.endpointHttp
        })
        .filter((s) => s)

      if (subnetEnpoints.length) {
        getSubnetAsset(address, subnetEnpoints, traceparent)
          .catch((error) => {
            apm.captureError(error)
          })
          .finally(() => {
            span?.end()
            transaction?.end()
          })
      }
    },
    [registeredSubnets, recaptchaRef]
  )

  useEffect(
    function initFormField() {
      if (registeredSubnets) {
        form.setFieldValue(
          'subnetIds',
          registeredSubnets.map((s) => s.id)
        )
      }
    },
    [form, registeredSubnets]
  )

  const onFinishFailed = useCallback((errorInfo: any) => {
    console.error('Failed:', errorInfo)
    apm.captureError(errorInfo)
  }, [])

  return (
    <>
      {getRegisteredSubnetsLoading ? (
        <Spin size="large" />
      ) : (
        <Form
          form={form}
          name="faucet"
          layout="vertical"
          style={{ margin: '0 auto', maxWidth: 400 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Subnets"
            name="subnetIds"
            rules={[
              {
                required: true,
                message: ERROR.MISSING_SUBNET,
              },
            ]}
          >
            <SubnetSelect
              loading={getRegisteredSubnetsLoading}
              size="large"
              subnets={registeredSubnets}
              disabled={loading || !registeredSubnets || !isReCaptchaConfigured}
            />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <Input
              placeholder="Input your address"
              disabled={loading || !isReCaptchaConfigured}
            />
          </Form.Item>
          <br />
          {isReCaptchaConfigured && (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              size="invisible"
            />
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={!isReCaptchaConfigured}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  )
}

export default FaucetForm
