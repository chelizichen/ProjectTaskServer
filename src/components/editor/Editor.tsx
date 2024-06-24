import React, { useEffect, useRef, useState } from 'react'
import { AiEditor } from 'aieditor'
import 'aieditor/dist/style.css'
import api from '../../api'

type IEditorComponent = {
  emitChange: (value: string) => void
  initContent:string
}

function EditorComponent(props:IEditorComponent) {
  const emitChange = props.emitChange
  const BASE_UPLOAD = import.meta.env.VITE_API_BASE_UPLOAD
  const initContent = props.initContent
  //定义 ref
  const divRef = useRef(null)
  const imageConf = {
    allowBase64: true,
    defaultSize: 350,
    uploadUrl: BASE_UPLOAD,
    uploadFormName: 'image', //上传时的文件表单名称
    // uploadHeaders: {
    //     "jwt": "xxxxx",
    //     "other": "xxxx",
    // },
    uploader: async (file, uploadUrl, headers, formName) => {
      //可自定义图片上传逻辑
      console.log('uploader', file, uploadUrl, headers, formName)
      return new Promise((resolve)=>{
        api.file.upload({ file: file, dirId: null }).then((res:any)=>{
          res.errorCode = res.code == 200 ? 0 : res.code
          res.data.src = res.data.url
          res.data.alt = ""
          resolve(res)
        })
      }) 
    },
    uploaderEvent: {
        onUploadBefore: (file, uploadUrl, headers) => {
          console.log('onUploadBefore',file, uploadUrl, headers);
            //监听图片上传之前，此方法可以不用回任何内容，但若返回 false，则终止上传
        },
        onSuccess: (file, response) => {
            console.log('onSuccess',file, response);
            //监听图片上传成功
            //注意：
            // 1、如果此方法返回 false，则图片不会被插入到编辑器
            // 2、可以在这里返回一个新的 json 给编辑器
        },
        onFailed: (file, response) => {
          console.log('onFailed',file, response);
            //监听图片上传失败，或者返回的 json 信息不正确
        },
        onError: (file, error) => {
          console.log('onError',file, error);
            //监听图片上传错误，比如网络超时等
        },
    },
    bubbleMenuItems: ['AlignLeft', 'AlignCenter', 'AlignRight', 'delete']
  }
  //初始化 AiEditor
  useEffect(() => {
    if (divRef.current) {
      const aiEditor = new AiEditor({
        element: divRef.current,
        placeholder: '任务描述',
        content: initContent,
        image: imageConf,
        onChange: (content:AiEditor) => {
          emitChange(content.getHtml())
          console.log(content.getHtml())
        },
      })
      return () => {
        aiEditor.destroy()
      }
    }
  }, [])

  return <div ref={divRef} style={{ height: '400px' }} />
}

export default EditorComponent
