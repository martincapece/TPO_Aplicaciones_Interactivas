import '../UI/auth.styles.css';
import { Button } from '@mui/material/Button';

export const AuthLayout = ({ children, title }) => {
  return (
    <>
      <Button variant="contained">Hello world</Button>
      <h1 className=''>{ title }</h1>
      {children}
    </>
  )
}
