import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CalendarOutlined, CheckOutlined, FileOutlined, HomeOutlined, MessageOutlined } from '@ant-design/icons'
import PorjectList from './PorjectList'
import UserInfo from './UserInfo'
import { Checkbox, Col, Row, Tag } from 'antd'

interface Nav {
  name: string
  path: string
  icon: JSX.Element
  component?:JSX.Element
}

interface ProjectRef {
  setCurrentProject: (val: number) => void
}
const OptComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const refreshWithParams = (newOpt:string[]) => {
    const searchParams = new URLSearchParams(location.search);
    const opts = searchParams.get('opts')
    console.log('opts',opts);
    searchParams.set('opts',newOpt.join(','))
    // if (!opts) {
    //   // 如果没有 opts 参数，直接添加
    //   searchParams.set('opts', newOpt);
    // } else {
    //   // 如果已有 opts 参数，解析并处理
    //   const optsArray = opts.split(',');
    //   if (!optsArray.includes(newOpt)) {
    //     // 如果新的 opt 不在 optsArray 中，则添加
    //     optsArray.push(newOpt);
    //     searchParams.set('opts', optsArray.join(','));
    //   } else {
    //     // 如果新的 opt 已存在，则删除
    //     const updatedOptsArray = optsArray.filter(opt => opt !== newOpt);
    //     searchParams.set('opts', updatedOptsArray.join(','));
    //   }
    // }
    // 参数是个opt 的数组
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(newUrl);
  };

  return (
    <Checkbox.Group style={{ width: '100%' }} onChange={refreshWithParams} defaultValue={['0','1','2']}>
      <Row>
        <Col span={12}>
          <Checkbox value="-1">已删除</Checkbox>
        </Col>
        <Col span={12}>
          <Checkbox value="0">待处理</Checkbox>
        </Col>
        <Col span={12}>
          <Checkbox value="1">进行中</Checkbox>
        </Col>
        <Col span={12}>
          <Checkbox value="2">待测试</Checkbox>
        </Col>
        <Col span={12}>
          <Checkbox value="3">已完成</Checkbox>
        </Col>
        <Col span={12}>
          <Checkbox value="4">已取消</Checkbox>
        </Col>
      </Row>
    </Checkbox.Group>
  )
}


const NavSide = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [currentPath, setCurrentPath] = useState('')
  const projectRef = useRef<ProjectRef>()

  const navList: Nav[] = [
    {
      name: '仪表盘',
      path: '/',
      icon: <HomeOutlined />
    },
    {
      name: '日历',
      path: '/calendar',
      icon: <CalendarOutlined />
    },
    {
      name: '消息',
      path: '/message',
      icon: <MessageOutlined />
    },
    {
      name: '文件',
      path: '/file',
      icon: <FileOutlined />
    },
    {
      name:"过滤器",
      path:"/filter",
      icon: <CheckOutlined />,
      component: <OptComponent/>,
    }
  ]

  const clickNav = (item: Nav) => {
    if(item.name == "过滤器"){
      return
    }else{
      setCurrentPath(item.path)
      navigate(item.path)
      projectRef.current?.setCurrentProject(-1)
    }

  }

  const setPath = (val: string) => {
    setCurrentPath(val)
  }

  useEffect(() => {
    setCurrentPath(location.pathname)
  }, [])

  return (
    <div className="p-5">
      <UserInfo />
      <div className="my-5">
        {navList.map((item, index) => {
          return (
            <div
              key={index}
              className="flex items-center p-3 mb-3 cursor-pointer"
              style={{ background: currentPath === item.path ? '#fff' : 'inherit' }}
              onClick={() => clickNav(item)}
            >
              <div className="flex items-center text-[#d9d9da] text-lg">{item.icon}</div>
              <div className="ml-4 text-[#6b6e72]">{item.component || item.name}</div>
            </div>
          )
        })}
      </div>
      <PorjectList ref={projectRef} setPath={setPath} />
    </div>
  )
}

export default NavSide
