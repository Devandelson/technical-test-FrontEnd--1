import { useLocation } from 'react-router';
import { Search } from './components/search.tsx';
import { useEffect, useState } from 'react';
import { motion } from "motion/react"

// --------- Types

interface itemPropss {
    idProducto: number
    nombre: string
    descripción: string
    precio: number
    puntuacion: number
    imagenes: string
}

export default function Products() {
    const params = useLocation();
    const search = String(params.search).slice(1);
    const [data, setData] = useState<itemPropss[]>([]);
    const [stadistic, setStadistic] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const getFetch = await fetch(`http://localhost:3000/api/producto?search=${search}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json'
                }
            });
            if (getFetch.ok) {
                const jsonFetch = await getFetch.json();

                setData(jsonFetch.data);
                setStadistic(() => {
                    if (jsonFetch.stadistic == null || jsonFetch.stadistic.length < 1) {
                        return [
                            {
                                'categoría': 'Ninguna encontrada',
                                'total': 0
                            }
                        ]
                    }

                    return jsonFetch.stadistic;
                })
            } else {
                alert('Error');
            }
        }

        fetchData();
    }, [search])

    // messages
    const productMessage = search !== null ? " de " + search : 'del "producto"';

    return (
        <>
            <Search></Search>
            <hr />
            <main className='w-full max-w-4xl m-auto p-3'>
                <motion.section
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={{
                        duration: 0.4,
                        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                    }}
                >
                    <p className='text-2xl'>Resultados de busqueda {productMessage}: {data.length ?? 0}</p>
                    <nav>
                        <ul className='w-full h-auto flex items-center gap-2 flex-wrap mt-2'>
                            <>
                                {
                                    stadistic && stadistic.map((item, index) => (
                                        <li className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' key={index}>
                                            {item.categoría} - {item.total}
                                        </li>
                                    ))
                                }
                                {
                                    stadistic.length < 1 && < li className='border border-blue-300 text-gray-700 font-bold py-2 px-4 rounded border-dashed'>
                                        No se encontraron categorias.
                                    </li>
                                }
                            </>
                        </ul>
                    </nav>
                </motion.section>

                <motion.section className='w-full h-auto flex flex-col gap-2.5 mt-10'
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 30, opacity: 0 }}
                    transition={{
                        duration: 0.3,
                        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                    }}
                >
                    {
                        data && data.map((itemData) => (
                            <Item
                                key={itemData.idProducto}
                                nombre={itemData.nombre}
                                descripción={itemData.descripción}
                                precio={itemData.precio}
                                puntuacion={itemData.puntuacion}
                                idProducto={itemData.idProducto}
                                imagenes={itemData.imagenes}
                            />
                        ))
                    }
                    {
                        data.length < 1 && <p className='text-center text-4xl'> ℹ️
                            Sin datos encontrados
                        </p>
                    }
                </motion.section>
            </main >
        </>
    )
}



import { useNavigate } from 'react-router';

function Item({ nombre, descripción, precio, puntuacion = 0, idProducto, imagenes }: itemPropss) {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        if (!idProducto) return;
        navigate({
            pathname: '/detalles',
            search: `?id=${idProducto}`
        });
    };

    const renderStars = (rating: number) => {
        return '⭐'.repeat(rating);
    };
    const imageSrc = imagenes ? imagenes.split(',')[0] : '/placeholder.png';

    return (
        <>
            <article className='w-full h-auto flex items-start flex-wrap gap-4'>
                <img
                    src={imageSrc}
                    alt={nombre}
                    className='max-w-50 w-full aspect-square object-contain'
                />

                <div className='w-50 grow'>
                    <h3 className='text-2xl font-bold'>{nombre}</h3>
                    <p className='text-lg'>{descripción}</p>

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