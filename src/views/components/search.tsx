import type { SyntheticEvent } from "react";
import { useNavigate, type NavigateFunction } from "react-router"
import { motion } from "motion/react"

function sendInfo(e: SyntheticEvent<HTMLFormElement>, navigate: NavigateFunction) {
    e.preventDefault();

    const target = e.currentTarget;
    const buscador = target.buscador.value;
    if (buscador !== null) {
        navigate({
            'search': buscador,
            pathname: '/producto'
        });
        return;
    }

    alert('Necesitas colocar texto en el buscador.');
}

export function SearchHome() {
    const navigate = useNavigate();

    return (
        <motion.div className={`w-full min-h-screen h-auto p-3 flex justify-center items-center`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.4,
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
        >
            <header className="flex flex-col justify-center items-center gap-8 text-center
            w-full max-w-4xl m-auto
            ">
                <p className="text-8xl">📲</p>
                <h1 className="text-5xl font-bold">Bazar Online</h1>
                <form className="flex flex-col gap-8 w-full" onSubmit={(e) => {
                    sendInfo(e, navigate)
                }}>
                    <input name='buscador' type="text" placeholder="Busca tu producto..." className="w-full p-3 bg-gray-200 rounded-sm outline-none" />
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-7 rounded w-max m-auto">
                        Buscar
                    </button>
                </form>
            </header>
        </motion.div>
    )
};

export function Search() {
    const navigate = useNavigate();

    return (
        <motion.header className="h-auto flex justify-center items-center gap-8 text-center
            w-full max-w-4xl m-auto"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.4,
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
        >
            <section className="flex items-center gap-2">
                <p className="text-5xl">📲</p>
                <h1 className="text-3xl font-bold">Bazar Online</h1>
            </section>
            <form className="flex gap-8 w-full" onSubmit={(e) => {
                sendInfo(e, navigate)
            }}>
                <input name='buscador' type="text" placeholder="Busca tu producto..." className="w-full p-3 bg-gray-200 rounded-sm outline-none" />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Buscar
                </button>
            </form>
        </motion.header>
    )
} 