import { Grid } from "@mui/material"
import { Destacados, Footer, ImageBackground, ImageBackgroundChild, Navbar } from "../components"
import vans from "/assets/vans_knu.png"
import jordan from "/assets/jordans.png"

export const EcomercePage = () => {
  const handleCategoryClick = (brand) => {
  localStorage.setItem("selectedBrand", brand);
  } // Guardar en localStorage
  return (
    <>
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
              onClick={() => handleCategoryClick("Jordan")}
            >
              <ImageBackgroundChild title={'JORDAN'} subtitle={'VER PRODUCTOS'} url={jordan} />
            </Grid>

            <Grid
              size={{ xs: 12, md: 5.75 }}
              sx={{ my: { xs: 1, md: 0 } }}
              onClick={() => handleCategoryClick("Vans")}
            >
              <ImageBackgroundChild title={'VANS'} subtitle={'VER PRODUCTOS'} url={vans} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
