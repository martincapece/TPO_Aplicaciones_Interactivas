import { Grid } from "@mui/material"
import { Footer, ImageBackground, Navbar, Productos, ImageBackgroundChild} from "../components"
import vans from "/assets/vans_knu.png"

export const Catalogo = () => {
  return (
      <>

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
            
            {/* PRODUCTOS */}
            <Grid>
              <Productos />
            </Grid>
          </Grid>
        </Grid>
      </>
    )
}
