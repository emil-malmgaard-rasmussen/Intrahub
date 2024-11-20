const LOCAL_STORAGE_KEYS = {
    NETWORK_ID: 'networkId',
};

export const getNetworkId = () => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.NETWORK_ID);
};

export const setNetworkId = (networkId: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.NETWORK_ID, networkId);
};

export const getStoredItem = (key: string) => {
    return localStorage.getItem(key);
};

export const setStoredItem = (key: string, value: string) => {
    localStorage.setItem(key, value);
};
