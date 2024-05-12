import { defineStore } from "pinia"
import request,{baseUrl} from "../util/network"
export const componentStore = defineStore('componentStore', {
    state: () => ({
        id:0 as Number
    }),
    getters: {
        
    },
    actions: {
        getComponentList(id:number) {
            return new Promise((resolve, reject) => {
                request.post(baseUrl+'components/list', JSON.stringify({id:id}))
                    .then(response => {
                        console.log(response);
                        resolve(response.data); // 成功时调用 resolve
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        reject(error); // 失败时调用 reject
                    });
            })
        },
        createComponent(data:any) {
            return new Promise((resolve, reject) => {
                request.post(baseUrl+'components/new', JSON.stringify(data))
                    .then(response => {
                        console.log(response);
                        resolve(response.data); // 成功时调用 resolve
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        reject(error); // 失败时调用 reject
                    });
            })
        },
    },
})