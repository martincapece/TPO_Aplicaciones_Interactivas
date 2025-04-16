import { Button, Grid, Typography } from '@mui/material';

export const AuthLayout = ({ children, title }) => {
  return (
    <Grid
      container
      spacing={ 0 }
      direction="column"
      justifyContent="center"
      alignItems= "center"
      minHeight='100vh'
      sx={{ backgroundColor: '#ffffff' }}
    >
      <Grid
        item
        md={3}
        sx={{
          width: '100%',
          maxWidth: 300
        }}
      >
        <Typography 
          variant='h5'
          sx={{
            fontFamily: 'Inter',
            fontWeight: '800',
            mb: 3
          }}
        >
          { title }
        </Typography>
        
          { children }
      </Grid>
    </Grid>
  )
}
