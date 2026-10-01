import { SearchHome } from './components/search.tsx'
import { useEffect, useState } from 'react'

import conex from './urlApi.ts';

export default function Home() {
    const [category, setCategory] = useState<{categoria: string}[]>([])

    useEffect(() => {
        // Simulate an API call to fetch categories
        const fetchCategories = async () => {
            // Replace this with your actual API call
            const categories = await fetch(conex + '/categoria');
            const data = await categories.json();
            setCategory(data ? data.data : [{categoria: 'No hay categorias'}]);
        }

        fetchCategories()
    }, [])

    return (
        <>
            <SearchHome categories={category}></SearchHome>
            <hr></hr>
        </>
    )
}