import
  React,
  {
    useState,
    useEffect
  }
from 'react'
import {
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBBtn,
  MDBInputGroup,
  MDBIcon,
} from 'mdb-react-ui-kit'

function Chat({
  socket,
  user
}) {
  const [
    message,
    setMessage
  ] = useState('')

  const [
    messages,
    setMessages
  ] = useState([])

  const onSubmitMessage = async () => {
    if (message === "" || message === null) {
      // if message is empty
      console.error('Error')
    } else {
      const sendingRequest = {
        author: user.username,
        message: message,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
        room: user.room
      }
      // sending message
      await socket.emit('sendMessage', sendingRequest)
      setMessages(prevMessage => [...prevMessage, sendingRequest])
      setMessage('')
    }
  }

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setMessages(prevMessage => [...prevMessage, data])
    })
  }, [])

  return (
    <MDBCard style={{
      height:"70vh"
    }}>
      <MDBCardBody style={{
        overflowY: "auto"
      }}>
        {messages.map((item, index) => {
          return <div className={(item.author === user.username)  ? 'd-flex flex-row  justify-content-end'  : 'd-flex flex-row  justify-content-start'} key={index}>
          <div>
            <p className={(item.author === user.username) ? 'small p-2 me-3 mb-1 text-white rounded-3 bg-primary' : 'small p-2 me-3 mb-1 text-white rounded-3 bg-secondary'}>
              { item.message }
            </p>
            <p className="small me-3 mb-3 rounded-3 text-muted">
            { (item.author === user.username) ? 'You' : user.username } : { item.time }
            </p>
          </div>
        </div>
        })}
      </MDBCardBody>
      <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
        <MDBInputGroup className="mb-0">
          <input
            className="form-control"
            placeholder="Type message"
            type="text"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value)
            }}
          />
          <MDBBtn color="primary" style={{ paddingTop: ".55rem" }} onClick={onSubmitMessage}>
            <MDBIcon fas icon="paper-plane" />
          </MDBBtn>
        </MDBInputGroup>
      </MDBCardFooter>
    </MDBCard>
  )
}

export default Chat