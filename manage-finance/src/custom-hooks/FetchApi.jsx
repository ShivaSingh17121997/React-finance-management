import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function useFetchApi(api) {

    const [data, setData] = useState([]);
    const[error, setError] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const isMounted = true;

        try {

            if (isMounted) axios.get(api)
                .then((res) => {
                    setData(res.data)
                    console.log(res)
                })
            console.log()
        } catch (error) {
            console.log(error)
            if (isMounted) setError(error)

        } finally {
            // if (isMounted) setLoading = false;

        }

    }, [api])

    return { data, error, loading }
}
