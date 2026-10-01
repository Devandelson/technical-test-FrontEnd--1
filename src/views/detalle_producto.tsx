import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Search } from './components/search.tsx';

import conex from './urlApi.ts'

interface ProductData {
    idProducto: number;
    nombre: string;
    descripción: string;
    precio: number;
    puntuacion: number;
    stock: number;
    imagenes: string[];
    categoría: string;
}

export default function DetailProduct() {
    const params = useLocation();
    const id = String(params.search).slice(4);
    const [product, setProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError('No se proporcionó un ID de producto');
            setLoading(false);
            return;
        }

        setLoading(true);
        fetch(`${conex}/producto/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error('Error al obtener el producto');
                return res.json();
            })
            .then((data) => {
                // Si la API devuelve un array, toma el primer elemento; si es objeto, úsalo directamente
                const productData = data.data;
                setProduct(productData);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const renderStars = (rating: number = 0) => {
        return '⭐'.repeat(rating);
    };

    if (loading) return <p className='text-center p-5'>Cargando producto...</p>;
    if (error || !product) return <p className='text-center p-5 text-red-500'>{error || 'Producto no encontrado'}</p>;

    // Descompone la cadena de imágenes separadas por coma
    const imageList: string[] = !product.imagenes ? [] : product.imagenes;

    return (
        <>
            <Search />
            <main className='w-full max-w-4xl m-auto p-3'>
                {/* Sección de galería de imágenes */}
                <section className='w-full flex items-center h-80 p-0.5 bg-black gap-1 overflow-hidden rounded-lg transition-all relative '>
                    {imageList.length > 0 ? (
                        imageList.map((imgUrl, index) => (
                            <img
                                key={index}
                                src={imgUrl.trim()}
                                alt={`${product.nombre} - imagen ${index + 1}`}
                                className='grow w-[20%] h-full object-cover object-top
                                hover:w-full transition-all hover:object-center
                                '
                            />
                        ))
                    ) : (
                        <div className='w-full h-full flex items-center justify-center text-white'>Sin imágenes</div>
                    )}
                </section>

                <h3 className='text-2xl font-bold mt-4'>{product.nombre}</h3>
                <p className='text-lg mt-2'>{product.descripción}</p>

                <span className='mt-3 w-full h-auto flex items-center justify-between gap-2 flex-wrap'>
                    <ul className='list-none text-center flex flex-col items-start'>
                        <li className='text-2xl font-semibold'>${product.precio} US</li>
                        <li className='text-xl font-semibold text-gray-600'>Stock: {product.stock}</li>
                    </ul>
                    <p className='text-2xl'>{renderStars(product.puntuacion)}</p>
                </span>

                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 w-full">
                    Añadir al carrito
                </button>
            </main>
        </>
    );
}