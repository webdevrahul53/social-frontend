import { Instagram } from '@mui/icons-material';

const NewMessage = () => {
  return (
    <div className="text-center" style={{position: 'relative', top: 'calc(50% - 150px)'}}>
        <Instagram style={{width: '80px', height: '80px'}} />
        <h1 className='display-5'>Your Messages</h1>
        <h6>Send a message to start a chat</h6>
        <button className='btn btn-lg btn-primary mt-2'>Send Message</button>
    </div>
  )
}

export default NewMessage
