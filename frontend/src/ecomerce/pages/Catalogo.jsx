import { Grid } from "@mui/material"
import { Footer, ImageBackground, Navbar, Productos, ImageBackgroundChild} from "../components"
import vans from "/assets/vans_knu.png"
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export const Catalogo = () => {
      useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

  return (
      <Grid
      container
      sx={{backgroundColor: '#eaeaea', minHeight: '67.4vh'}}
      >
        <Grid
        sx={{
          width: '100%',
          maxWidth: '80%',
          margin: '0 auto',
        }}
        >
          
          {/* PRODUCTOS */}
          <Grid>
            <Productos />
          </Grid>
        </Grid>
      </Grid>
    )
}
