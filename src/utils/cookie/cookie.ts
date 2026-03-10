import Cookies from 'js-cookie';

// export const setCookie = Cookies.set.bind(Cookies)
// export const removeCookie = Cookies.remove.bind(Cookies)

// export const getCookie = Cookies.get.bind(Cookies)

export const setCookie = (name: string, item: string) => {
    localStorage.setItem(name, item)
}
export const removeCookie = (name: string) => {
    localStorage.removeItem(name)
}
export const getCookie = (name: string) => {
    if(localStorage.getItem(name)){
        return localStorage.getItem(name);   
    }
    if(Cookies.get(name)){
        return Cookies.get(name);
    }
    return null
} 