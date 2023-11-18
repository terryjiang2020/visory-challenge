import axios from "axios";

const cache = new Map<string, any>();

export const getEventListFull = async (filter: any, page: number): Promise<any> => {
    let filterString = '';
    if (filter.countryCode) {
        filterString += `&countryCode=${filter.countryCode}`;
    }
    if (filter.stateCode) {
        filterString += `&stateCode=${filter.stateCode}`;
    }
    if (filter.city) {
        filterString += `&city=${filter.city}`;
    }
    return new Promise<any>(async (resolve, reject) => {
        try {
            const key = `${filterString}${page}`;
            if (cache.has(key) && cache.get(key).timeout > Date.now()) {
                resolve(cache.get(key));
            }
            else {
                const url = `https://app.ticketmaster.com/discovery/v2/events?apikey=${
                    import.meta.env.VITE_TICKETMASTER_KEY
                }&page=${page}${filterString}`;
                const res = await axios.get(url);
                if (res.status === 200) {
                    res.data.timeout = Date.now() + 1000 * 60 * 60;
                    cache.set(key, res.data);
                    resolve(res.data);
                } else {
                    reject();
                }
            }
        }
        catch(err: any) {
            if (err.response && err.response.status && err.response.status === 401) {
                localStorage.removeItem('token');
            }
            reject(err);
        }
    })
}
