'use client';
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
type Props={color:string;view:'perspective'|'front';auto:boolean};
const SOURCE='https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept';
export default function CarScene({color,view,auto}:Props){
 const mount=useRef<HTMLDivElement>(null);
 const paints=useRef<THREE.MeshPhysicalMaterial[]>([]);
 const controlsRef=useRef<OrbitControls|null>(null);
 const colorRef=useRef(color);colorRef.current=color;
 const [status,setStatus]=useState<'loading'|'ready'|'fallback'>('loading');
 useEffect(()=>{paints.current.forEach(m=>m.color.set(color))},[color]);
 useEffect(()=>{const c=controlsRef.current;if(c)c.autoRotate=auto&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches},[auto]);
 useEffect(()=>{const c=controlsRef.current;if(c){c.object.position.copy(view==='front'?new THREE.Vector3(0,2,9.4):new THREE.Vector3(6,2.8,7));c.update()}},[view]);
 useEffect(()=>{
  const el=mount.current;if(!el)return;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'})}catch{setStatus('fallback');return}
  let disposed=false,frame=0;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.8));
  renderer.setSize(el.clientWidth,el.clientHeight);
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
  renderer.domElement.setAttribute('aria-label','Car Concept — modelo 3D detalhado e interativo');
  el.insertBefore(renderer.domElement,el.firstChild);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,el.clientWidth/el.clientHeight,.1,100);
  camera.position.set(6,2.8,7);
  const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();
  const env=pmrem.fromScene(room,.04);room.dispose();scene.environment=env.texture;
  const controls=new OrbitControls(camera,renderer.domElement);controlsRef.current=controls;
  controls.target.set(0,.7,0);controls.enableDamping=true;controls.enablePan=false;controls.enableZoom=false;
  controls.minPolarAngle=.65;controls.maxPolarAngle=1.45;
  controls.autoRotate=auto&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;controls.autoRotateSpeed=.35;controls.update();
  scene.add(new THREE.AmbientLight(0xffffff,1));
  const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(3,7,5);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-6,right:6,top:6,bottom:-6});key.shadow.bias=-.001;scene.add(key);
  const rim=new THREE.DirectionalLight(0xe7f4d0,2);rim.position.set(-4,3,-4);scene.add(rim);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.ShadowMaterial({opacity:.3}));
  floor.rotation.x=-Math.PI/2;floor.position.y=-.015;floor.receiveShadow=true;scene.add(floor);
  const release=(root:THREE.Object3D)=>{const textures=new Set<THREE.Texture>(),materials=new Set<THREE.Material>();root.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m))}});materials.forEach(m=>{Object.values(m).forEach(v=>{if(v instanceof THREE.Texture)textures.add(v)});m.dispose()});textures.forEach(t=>t.dispose())};
  new GLTFLoader().load('/models/car-concept.glb',gltf=>{
   if(disposed){release(gltf.scene);return}
   const car=gltf.scene;
   const bounds=new THREE.Box3().setFromObject(car),size=bounds.getSize(new THREE.Vector3());
   car.scale.setScalar(4.9/Math.max(size.x,size.z));
   car.updateMatrixWorld(true);
   const normalized=new THREE.Box3().setFromObject(car),center=normalized.getCenter(new THREE.Vector3());
   car.position.set(-center.x,-normalized.min.y,-center.z);
   car.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true;
    const materials=Array.isArray(o.material)?o.material:[o.material];
    materials.forEach(m=>{if(m instanceof THREE.MeshPhysicalMaterial&&/^Paint [12] /i.test(m.name)){m.color.set(colorRef.current);m.roughness=.25;m.metalness=.8;m.clearcoat=1;paints.current.push(m)}})
   }});
   scene.add(car);setStatus('ready');
  },undefined,()=>{if(!disposed)setStatus('fallback')});
  const resize=()=>{if(!el.clientWidth||!el.clientHeight)return;camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();renderer.setSize(el.clientWidth,el.clientHeight)};
  const observer=new ResizeObserver(resize);observer.observe(el);
  const render=()=>{frame=requestAnimationFrame(render);controls.update();renderer.render(scene,camera)};render();
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();controls.dispose();release(scene);env.dispose();pmrem.dispose();renderer.dispose();renderer.domElement.remove();controlsRef.current=null;paints.current=[]};
 // The loader runs once; live controls use separate effects and colorRef.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 return <div ref={mount} className="car-viewer">
 {status!=='ready'&&<div className="imported-car-poster"><img src="/models/car-concept.jpg" alt="Car Concept — modelo 3D de esportivo do acervo Khronos"/><span>{status==='loading'?'Carregando modelo 3D…':'Prévia do modelo · ative WebGL para explorar em 3D'}</span></div>}
 <a className="model-credit" href={SOURCE} target="_blank" rel="noreferrer">Car Concept · Eric Chadwick / DGG · CC BY 4.0</a>
 </div>
}
