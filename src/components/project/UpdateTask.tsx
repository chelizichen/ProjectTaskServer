import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, DatePicker, message, Switch } from 'antd'
import { ProjectItem } from '../../types/project'
import { LoginUser } from '../../api/modules/user/types'
import { TaskItem } from '../../types/task'
import dayjs from 'dayjs'
import api from '../../api'
import EditorComponent from '../editor/Editor'

const { RangePicker } = DatePicker

interface Props {
  project?: ProjectItem
  task: TaskItem
  visible: boolean
  setVisible: (val: boolean) => void
  getTaskDetail: () => void
}

const UpdateTask = (props: Props) => {
  const { project, task, visible, setVisible, getTaskDetail } = props
  const [abled, setAbled] = useState(false)
  const [editorContent, setEditorContent] = useState('')



  const onChange = (checked: boolean) => {
    setAbled(checked)
    const value = form.getFieldValue('desc')
    setEditorContent(value)
  }

  const [form] = Form.useForm()
  const user: LoginUser['user'] = JSON.parse(localStorage.getItem('task-user') as string)
  const rangeConfig = {
    rules: [{ type: 'array' as const, required: true, message: '请选择时间' }]
  }

  const confirm = () => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue()
        api.task
          .updateTask(task.id, {
            ...values,
            startTime: dayjs(values.time[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime: dayjs(values.time[1]).format('YYYY-MM-DD HH:mm:ss'),
            desc:editorContent,
          })
          .then((res) => {
            if (res.code === 200) {
              message.success(res.msg)
              getTaskDetail()
              setVisible(false)
            } else {
              message.error(res.msg)
            }
          })
      })
      .catch(() => {
        message.error('表单填写有误,请检查')
      })
  }

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        name: task.name,
        desc: task.desc,
        level: task.level,
        time: [dayjs(task.startTime), dayjs(task.endTime)],
        users: task.users && task.users.length && task.users.map((item) => item.id)
      })
    }
  }, [task])

  useEffect(()=>{
    setAbled(false)
    return ()=>{
      setAbled(false)
    }
  },[])

  return task ? (
    <Modal
      title={task.name}
      open={visible}
      onOk={confirm}
      onCancel={() => setVisible(false)}
      maskClosable={false}
    >
      <Switch defaultValue={false} onChange={onChange} />
      <Form form={form}>
        <Form.Item name="name" rules={[{ required: true, message: '任务名称不能为空' }]}>
          <Input placeholder="任务名称" allowClear autoComplete="off" disabled={!abled} />
        </Form.Item>
        {project && project.users.length ? (
          <Form.Item name="users">
            <Select placeholder="项目负责人" showSearch allowClear mode="multiple">
              {project.users.map((item) => {
                return (
                  <Select.Option key={item.id} value={item.id} disabled={item.id === user.id}>
                    {item.username}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
        ) : null}
        <Form.Item name="level" rules={[{ required: true, message: '优先级不能为空' }]}>
          <Select placeholder="优先级"  disabled={!abled}>
            <Select.Option value="P1">P1</Select.Option>
            <Select.Option value="P2">P2</Select.Option>
            <Select.Option value="P3">P3</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="time" {...rangeConfig} >
          <RangePicker
            style={{ width: '100%' }}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={['开始时间', '结束时间']}
            disabled={!abled}
          />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: '任务描述不能为空' }]}
          className="desc-border"
        >
          {abled ? (
            <EditorComponent emitChange={setEditorContent} initContent={editorContent}></EditorComponent>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: form.getFieldValue('desc') }}></div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  ) : null
}

export default UpdateTask
