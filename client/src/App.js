import
  React,
  {
    useState,
    useEffect
  }
from 'react'
import './index.css'
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
} from 'mdb-react-ui-kit'
import Chat from './Chat'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:8080')

export default function App() {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')
  const [authUser, setAuthUser] = useState('')

  const handleOnSubmit = async () => {
    await socket.emit('loginRequest', {
      username: username,
      room: room
    })
    socket.on('getAuth', async (response) => {
      if (response.success) {
        setAuthUser(response.data)
        await socket.emit('setCurrentUser', response.data)
      } else {
        console.error('No user found.')
      }
    })
  }

  return (
    <MDBContainer fluid className="py-5" style={{
      backgroundColor: "#CDC4F9",
      height: "100vh",
    }}>
      {
        (authUser === '') ?
          <MDBRow className='d-flex justify-content-center'>
            <MDBCol md="4" lg="3">
                <div class="card h-100 pa-4">
                  <div className="card-body">
                    <center className="mb-5">
                      <h4>Realtime Chat Application</h4>
                    </center>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">@</span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Username"
                          aria-label="Username"
                          aria-describedby="basic-addon1"
                          value={username}
                          onChange={(event) => {
                            setUsername(event.target.value)
                          }}
                        />
                      </div>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Room"
                          aria-label="room"
                          aria-describedby="basic-addon1"
                          value={room}
                          onChange={(event) => {
                            setRoom(event.target.value)
                          }}
                        />
                      </div>
                      <div className="mt-5 d-grid gap-2">
                        <MDBBtn onClick={handleOnSubmit}>Start Chat</MDBBtn>
                      </div>
                  </div>
                </div>
            </MDBCol>
          </MDBRow>
        
      :
      <MDBRow>
        <MDBCol md="12">
          <MDBCard id="chat3" style={{
            borderRadius: "15px",
            height: "75vh"
          }}>
            <MDBCardBody>
              <MDBRow>
                <MDBCol md="10" lg="12" xl="12">
                  <Chat 
                      socket={socket}
                      user={authUser}
                    />
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
      }
    </MDBContainer>
  );
}