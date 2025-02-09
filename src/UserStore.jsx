// import { atom, useAtom } from 'jotai';

// const jwtAtom = atom(null);
// const userIdAtom = atom(null);

// export function useJwt() {
//     const [jwt, setJwtAtom] = useAtom(jwtAtom);
//     const [userId, setUserId] = useAtom(userIdAtom);

//     const setJwt = (newJwt) => {
//         localStorage.setItem('jwt', newJwt);
//         setJwtAtom(newJwt);
//     };

//     const getJwt = () => {
//         const storedJwt = localStorage.getItem('jwt');
//         if (storedJwt && !jwt) {
//             setJwtAtom(storedJwt);
//         }
//         return jwt || storedJwt;
//     };

//     const clearJwt = () => {
//         localStorage.removeItem('jwt');
//         setJwtAtom(null);
//     };

//     return { jwt, setJwt, getJwt, clearJwt };
// }

import { atom, useAtom } from 'jotai';
import { jwtDecode } from 'jwt-decode';

const jwtAtom = atom(null);
const userIdAtom = atom(null);

export function useJwt() {
    const [jwt, setJwtAtom] = useAtom(jwtAtom);
    const [userId, setUserIdAtom] = useAtom(userIdAtom);

    const setJwt = (newJwt) => {
        localStorage.setItem('jwt', newJwt);
        setJwtAtom(newJwt);
        // Decode the JWT to extract the userId and update the userId atom
        try {
            const decoded = jwtDecode(newJwt);
            setUserIdAtom(decoded.userId); // Assuming the userId is in the payload
        } catch (e) {
            console.error("Invalid JWT:", e);
        }
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
        setUserIdAtom(null);
    };

    return { jwt, setJwt, getJwt, clearJwt, userId };
}

