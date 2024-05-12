import { defineStore } from "pinia"
import request, { baseUrl } from "../util/network"

export const projectStore = defineStore('projectStore', {
    state: () => ({
        uid: 1 as Number,
        currentProject: {
            id: 0 as Number,
            name: '' as String,
            poster_url: '' as String,
            width: 0 as Number,
            height: 0 as Number,
            qrcode_url: '' as String,
        }
    }),
    getters: {
        getCurrentProject():any{
            return this.currentProject;
        }
    },
    actions: {
        getProjectList() {
            return new Promise((resolve, reject) => {
                request.post(baseUrl + 'projects/list', JSON.stringify({ id: this.uid }))
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
        setProject(project:any) {
            this.currentProject = project;
        }
    },
})