import { useLocation, useNavigate } from 'react-router';
import { Search } from './components/search.tsx';
import { useEffect, useState } from 'react';
import { motion } from "motion/react";

import conex from './urlApi.ts'

// --------- Types
interface ItemProps {
    id_producto: number;
    nombre: string;
    descripcion: string;
    precio: number;
    puntuacion: number;
    imagenes: string[] | string;
}

interface StatisticProps {
    categoria: string;
    total: number;
}

export default function Products() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search') || '';

    const [data, setData] = useState<ItemProps[]>([]);
    const [stadistic, setStadistic] = useState<StatisticProps[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${conex}/producto?search=${search}`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json'
                    }
                });

                if (response.ok) {
                    const jsonFetch = await response.json();
                    setData(jsonFetch.data || []);
                    
                    if (!jsonFetch.stadistic || jsonFetch.stadistic.length < 1) {
                        setStadistic([{ categoria: 'Ninguna encontrada', total: 0 }]);
                    } else {
                        setStadistic(jsonFetch.stadistic);
                    }
                } else {
                    setData([]);
                    setStadistic([{ categoria: 'Ninguna encontrada', total: 0 }]);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        }

        fetchData();
    }, [search]);

    const productMessage = search ? `de "${search}"` : 'del producto';

    return (
        <>
            <Search />
            <hr />
            <main className='w-full max-w-4xl m-auto p-3'>
                <motion.section
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <p className='text-2xl'>Resultados de búsqueda {productMessage}: {data.length}</p>
                    <nav>
                        <ul className='w-full h-auto flex items-center gap-2 flex-wrap mt-2'>
                            {stadistic.map((item, index) => (
                                <li className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' key={index}>
                                    {item.categoria} - {item.total}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </motion.section>

                <motion.section 
                    className='w-full h-auto flex flex-col gap-2.5 mt-10'
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Fixed: Render if data length > 0 instead of > 1 */}
                    {data.length > 0 ? (
                        data.map((itemData) => (
                            <Item
                                key={itemData.id_producto}
                                id_producto={itemData.id_producto}
                                nombre={itemData.nombre}
                                descripcion={itemData.descripcion}
                                precio={itemData.precio}
                                puntuacion={itemData.puntuacion}
                                imagenes={itemData.imagenes}
                            />
                        ))
                    ) : (
                        <p className='text-center text-4xl mt-6'>ℹ️ Sin datos encontrados</p>
                    )}
                </motion.section>
            </main>
        </>
    );
}

function Item({ nombre, descripcion, precio, puntuacion = 0, id_producto, imagenes }: ItemProps) {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        if (!id_producto) return;
        navigate({
            pathname: '/detalles',
            search: `?id=${id_producto}`
        });
    };

    const renderStars = (rating: number) => '⭐'.repeat(Math.round(rating));
    const imageSrc = String(imagenes).split(',')[0] ?? '';
    return (
        <>
            <article className='w-full h-auto flex items-start flex-wrap gap-4'>
                <img
                    src={imageSrc || '/placeholder.png'}
                    alt={nombre}
                    className='max-w-50 w-full aspect-square object-contain'
                />

                <div className='w-50 grow'>
                    <h3 className='text-2xl font-bold'>{nombre}</h3>
                    <p className='text-lg'>{descripcion}</p>

                    <span className='mt-3 w-full h-auto flex items-center justify-between gap-2 flex-wrap'>
                        <p className='text-2xl font-semibold'>${precio} US</p>
                        <p aria-label={`Calificación: ${puntuacion} de 5`}>
                            {renderStars(puntuacion)}
                        </p>
                    </span>

                    <button
                        type="button"
                        onClick={handleViewDetails}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5 transition-colors"
                    >
                        Ver más detalles
                    </button>
                </div>
            </article>
            <hr className='border-gray-200 my-4' />
        </>
    );
}