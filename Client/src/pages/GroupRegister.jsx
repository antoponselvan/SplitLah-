import {useState, useRef} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const GroupRegister = () => {

  const [selectedUserList, setSelectedUserList] = useState([])
  const [userSearchResults, setUserSearchResults] = useState([{id:1, name:"A", email:"A"}, {id:2, name:"B", email:"B"}])
  const [notification, setNotification] = useState(null)
  const searchTextBoxRef = useRef()

  const handleUserSearch = async () => {
    const searchText = searchTextBoxRef.current.value
    console.log(searchText)
    fetch('/api/users/search',{
      method:"POST",
      headers: {
        'Content-Type':'application/json'
      },
      body:JSON.stringify({searchText:searchText})
    }).then((res)=>{
      if (res.status !== 200){
        throw new Error({msg:"Find Call failed"})
      }
      return res.json()
    }).then((data)=>{
      console.log(data)
      setUserSearchResults(data)
    }).catch((error)=>{
      console.log(error)
    })
  }

  const handleRemoveUser = () => {}

  const handleAddUser = (user) => {
    return () => {
      const userIdList = selectedUserList.map((user)=>user.id)
      if ((userIdList.find((id)=>(id === user.id)))){
        return
      }
      setSelectedUserList([...selectedUserList, {id: user.id, name:user.name, email:user.email}])
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const name = event.target.name.value
    const description = event.target.description.value
    const userList = selectedUserList.map((user)=>user.id)

    if (!name || !description || (userList === [])){
      setNotification("Inputs cannot be blank")
      return
    }
    fetch('/api/groups/register',{
      method: "POST",
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({name, description,userList})
    }).then((res)=>{
      if (res.status!==201){
        throw new Error({msg:"Couldnt create group"})
      }
      return res.json()
    }).then((data)=>{
      setNotification("Group Created : "+data.name)
    }).catch((error)=>{
      console.log(error)
      setNotification("Some Error in creating group!")
    })

    
  }

  return (
    <Container fluid>
      <Row className='text-center'>
      <h2>Create a Group</h2>
        <Col className='text-center d-flex justify-content-center'>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className='text-center'>Group Name</Form.Label>
              <Form.Control name="name" style={{width:'300px'}} placeholder="Enter Name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Group Description</Form.Label>
              <Form.Control name="description" as="textarea" placeholder="Description" style={{ height: '100px'}}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className='d-block'>Members</Form.Label>
                <Dropdown onClick={handleUserSearch} className='d-inline'>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />               
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {userSearchResults.map((user)=><Dropdown.Item onClick={handleAddUser(user)}>{user.name} : {user.email}</Dropdown.Item>)}
                  </Dropdown.Menu>
                </Dropdown>
                <Form.Control className='d-inline' style={{width:'230px'}} placeholder="Find by name or Email" ref={searchTextBoxRef}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <ul>
                {selectedUserList.map((user)=><li>{user.name} : {user.email}</li>)}
              </ul>
            </Form.Group>
            <Button type="submit">CREATE</Button>
            <i className="fa-regular fa-user"></i>
            {notification && <p className='text-danger'>{notification}</p>}
          </Form>          
        </Col>
      </Row>
    </Container>
  )
}

export default GroupRegister