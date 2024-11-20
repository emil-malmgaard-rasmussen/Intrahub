const LOCAL_STORAGE_KEYS = {
    NETWORK_ID: 'networkId',
    // Add other keys as needed
};

export const getNetworkId = () => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.NETWORK_ID);
};

export const setNetworkId = (networkId: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.NETWORK_ID, networkId);
};

// General utility to retrieve any stored item by key
export const getStoredItem = (key: string) => {
    return localStorage.getItem(key);
};

export const setStoredItem = (key: string, value: string) => {
    localStorage.setItem(key, value);
};

// Export constants if needed
export default {
    getNetworkId,
    setNetworkId,
    getStoredItem,
    setStoredItem,
};
