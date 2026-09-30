import { BrowserRouter, Routes, Route } from "react-router"

import Home from "./views/home.tsx"
import Product from "./views/productos.tsx"
import DetailProduct from "./views/detalle_producto.tsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/producto" element={<Product></Product>}></Route>
        <Route path="/detalles" element={<DetailProduct></DetailProduct>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
