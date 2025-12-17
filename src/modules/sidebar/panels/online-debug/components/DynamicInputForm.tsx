import { Form, Input, Button, Checkbox, InputNumber } from "antd";
import { useMemo } from "react";
import { InputTypeEnum, type NodeIOData } from "~/modules/nodes/types";

type Props = {
  userInputs: NodeIOData[];
  onSubmit?: (values: Record<string, unknown>) => void;
};

export function DynamicInputForm({ userInputs, onSubmit }: Props) {
  const [form] = Form.useForm();

  const formItems = useMemo(() => {
    return userInputs.map((item) => {
      const rules = item.required
        ? [{ required: true, message: `${item.label}不能为空` }]
        : [];

      switch (item.type) {
        case InputTypeEnum.TEXT:
          return (
            <Form.Item
              key={item.name}
              name={item.name}
              label={item.label}
              rules={rules}
            >
              <Input placeholder={`请输入${item.label}`} />
            </Form.Item>
          );

        case InputTypeEnum.NUMBER:
          return (
            <Form.Item
              key={item.name}
              name={item.name}
              label={item.label}
              rules={rules}
            >
              <InputNumber
                className="w-full"
                placeholder={`请输入${item.label}`}
              />
            </Form.Item>
          );

        case InputTypeEnum.BOOLEAN:
          return (
            <Form.Item
              key={item.name}
              name={item.name}
              valuePropName="checked"
              rules={rules}
            >
              <Checkbox>{item.label}</Checkbox>
            </Form.Item>
          );

        default:
          return null;
      }
    });
  }, [userInputs]);

  return (
    <div className="px-3">
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => onSubmit?.(values)}
      >
        {formItems}
        <Form.Item>
          <Button htmlType="submit" block>
            调试
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
