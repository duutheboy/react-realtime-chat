import React, {useRef, useState, useEffect} from 'react'
import {Input} from '@mui/material'
import SendIcon from '@mui/icons-material/Send';

import style from './Chat.module.css'

export default function Chat({socket}) 
{
  const messageRef = useRef()
  const [messageList, setMessageList] = useState([])
  const bottomRef = useRef()

  useEffect(()=>
    {
      socket.on("receive_message", data =>
        {
          setMessageList((current) => [...current, data]) // recebendo o data do backend do evento "receive_message"
        }
      )

      return () => socket.off("receive_message")
    }, [socket])

  useEffect(()=>
    {
      scrollDown()
    }, [messageList])

  const handleSubmit = () => 
    {
      const message = messageRef.current.value
      if(!message.trim()) return
      
      socket.emit("message", message)
      focusInput()
      clearInput() // limpar o campo ao enviar a mensagem
    }

  const clearInput = () => 
    {
      messageRef.current.value = "" // substituir o valor da mensagem por nada
    }  

  const focusInput = () => 
    {
      messageRef.current.focus()
    }

  const getEnterKey = (e) => // enviar mensagem ao pressionar enter
    {
      if(e.key === 'Enter')
        handleSubmit()
    }
  
  const scrollDown = () => 
    {
      bottomRef.current.scrollIntoView({behavior: 'smooth'}) // scrollar para baixo quando enviar uma mensagem muito grande
    }

    return (
      <div>
        <div className={style['chat-container']}>
          <div className={style["chat-body"]}>
          {
            messageList.map((message,index) => (
              <div className={`${style["message-container"]} ${message.authorId === socket.id && style["message-mine"]}`} key={index}>
                <div className="message-author"><strong>{message.author}</strong></div>
                <div className="message-text">{message.text}</div>
              </div>
            ))
          }
          <div ref={bottomRef} />
          </div>
          <div className={style["chat-footer"]}>
            <Input inputRef={messageRef} placeholder='Mensagem' onKeyDown={(e)=>getEnterKey(e)} fullWidth />
            <SendIcon sx={{m:1, cursor: 'pointer'}} onClick={()=>handleSubmit()} color="primary" />
          </div>
        </div>
      </div>
    )
}
