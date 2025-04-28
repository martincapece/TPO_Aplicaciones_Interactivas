import { Grid } from "@mui/material"
import { Destacados, Footer, ImageBackground, ImageBackgroundChild, Navbar } from "../components"
import vans from "/assets/vans_knu.png"
import jordan from "/assets/jordans.png"

export const EcomercePage = () => {
  return (
    <>
      <Navbar/> 
      <ImageBackground title={'NUEVA COLECCIÓN'} subtitle={'VER PRODUCTOS'} />
      
      <Grid
      container
      sx={{backgroundColor: '#eaeaea'}}
      >
        <Grid
        sx={{
          width: '100%',
          maxWidth: '80%',
          margin: '0 auto'
        }}
        >
          
          {/* DESTACADOS */}
          <Grid>
            <Destacados />
          </Grid>

          {/* CARROUSEL DE CATEGORIAS */}
          <Grid
          container
          direction='row'
          justifyContent='space-between'
          sx={{ my: 10 }}
          >
            <Grid 
            size={{ xs: 12, md: 5.75 }}
            sx={{
              mb: { xs: 1, md: 0 }
            }}
            >
              <ImageBackgroundChild title={'JORDAN 1'} subtitle={'VER PRODUCTOS'} url={jordan} />
            </Grid>
            <Grid 
            size={{ xs: 12, md: 5.75 }}
            sx={{
              my: { xs: 1, md: 0 }
            }}
            >
              <ImageBackgroundChild title={'VANS KNU'} subtitle={'VER PRODUCTOS'} url={vans} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Footer />
    </>
  )
}
