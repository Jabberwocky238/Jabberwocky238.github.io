export const useAPIBase = () => {
    let domain = window.location.hostname;
    if (domain === 'localhost') {
        return 'http://localhost';
    } else {
        return 'https://jw238.site/api';
    }
}