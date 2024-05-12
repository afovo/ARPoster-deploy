import { defineStore } from "pinia"
import request,{baseUrl} from "../util/network"
export const modelStore = defineStore('modelStore', {
    state: () => ({
    }),
    getters: {
        
    },
    actions: {
        getModelListByCID(id:number) {
            return new Promise((resolve, reject) => {
                request.post(baseUrl+'models/list', JSON.stringify({id:id}))
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
        getModelListByPID(id:number) {
            return new Promise((resolve, reject) => {
                request.post(baseUrl+'models/all', JSON.stringify({id:id}))
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
        createModel(data:any) {
            return new Promise((resolve, reject) => {
                request.post(baseUrl+'models/new', JSON.stringify(data))
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
        editModel(data:any) {
            return new Promise((resolve, reject) => {
                request.post(baseUrl+'models/edit', JSON.stringify(data))
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