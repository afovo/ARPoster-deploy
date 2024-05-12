import { defineStore } from "pinia"
import * as THREE from 'three';
import { toRaw } from "vue";

export const threeSceneStore = defineStore('threeSceneStore', {
    state: () => ({
        canvas: null,
        scene: null as unknown as THREE.Scene,
        camera: null as unknown as THREE.Camera,
        renderer: null as unknown as THREE.WebGLRenderer,
        entities: new Map()
    }),
    getters: {
        getScene(): THREE.Scene {
            return this.scene;
        },
        getCamera(): THREE.Camera {
            return this.camera;
        },
        getRenderer(): THREE.WebGLRenderer {
            return this.renderer;
        }
    },
    actions: {
        setAll(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.AmbientLight(color, intensity);
            scene.add(light);
            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;
        },
        setEntity(entity: any, id: number){
            this.entities.set(id, entity)
        },
        addEntity(entity: THREE.Mesh) {
            toRaw(this.scene).add(entity);
        },
        render() {
            toRaw(this.renderer).render(toRaw(this.scene), toRaw(this.camera));
        }
    },
})