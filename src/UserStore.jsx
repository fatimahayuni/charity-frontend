import { atom, useAtom } from 'jotai';

const jwtAtom = atom(null);

export function useJwt() {
    const [jwt, setJwtAtom] = useAtom(jwtAtom);

    const setJwt = (newJwt) => {
        localStorage.setItem('jwt', newJwt);
        setJwtAtom(newJwt);
    };

    const getJwt = () => {
        const storedJwt = localStorage.getItem('jwt');
        if (storedJwt && !jwt) {
            setJwtAtom(storedJwt);
        }
        return jwt || storedJwt;
    };

    const clearJwt = () => {
        localStorage.removeItem('jwt');
        setJwtAtom(null);
    };

    return { jwt, setJwt, getJwt, clearJwt };
}