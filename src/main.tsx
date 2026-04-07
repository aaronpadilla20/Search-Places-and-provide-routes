import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MapsApp } from './MapsApp'


if (!navigator.geolocation) {
  alert('Tu navegador no tiene opcion de Geolocalizacion');
  throw new Error('Tu navegador no tiene opcion de Geolocalizacion')
}




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MapsApp />
  </StrictMode>,
)
