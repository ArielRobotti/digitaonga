import { forwardRef, useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import {
    Mesh,
    Box3,
    Vector3,
    PerspectiveCamera,
} from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface ModelProps {
    url: string;
    rotation: [number, number, number];
}

function Model({ url, rotation }: ModelProps) {
    const meshRef = useRef<Mesh>(null);
    const { scene } = useGLTF(url);
    const { camera, controls } = useThree();

    const clonedScene = useMemo(() => scene.clone(), [scene]);
    
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x = rotation[0];
            meshRef.current.rotation.y = rotation[1];
            meshRef.current.rotation.z = rotation[2];
        }
    });
    
    useEffect(() => {
        const orbitControls = controls as OrbitControlsImpl;
        const perspectiveCamera = camera as PerspectiveCamera;

        if (clonedScene && perspectiveCamera) {
            const box = new Box3().setFromObject(clonedScene);
            const center = box.getCenter(new Vector3());
            const size = box.getSize(new Vector3());

            clonedScene.position.sub(center);

            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = perspectiveCamera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            cameraZ *= 1.5;

            perspectiveCamera.position.set(0, 0, cameraZ);
            perspectiveCamera.lookAt(0, 0, 0);

            perspectiveCamera.near = cameraZ / 100;
            perspectiveCamera.far = cameraZ * 100;
            perspectiveCamera.updateProjectionMatrix();

            if (orbitControls) {
                orbitControls.target.set(0, 0, 0);
                orbitControls.update();
            }

            if (meshRef.current) {
                while(meshRef.current.children.length > 0) {
                    meshRef.current.remove(meshRef.current.children[0]);
                }
                meshRef.current.add(clonedScene);
            }
        }
    }, [clonedScene, camera, controls]);

    return (
        <primitive
            ref={meshRef}
            object={scene}
            scale={1}
            position={[0, 0, 0]}
        />
    );
}

interface ModelViewer3DProps {
    fileUrl: string;
    onCapture?: () => void;
}

// **Modificado:** Usamos forwardRef para pasar la referencia del componente padre al canvas
export const ModelViewer3D = forwardRef<HTMLDivElement, ModelViewer3DProps>(({ fileUrl, onCapture }, ref) => {
    const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

    return (
        <div className="w-full h-full flex flex-col" ref={ref}>
            <div className="flex-1 rounded-lg overflow-hidden shadow-medium">
                <Canvas
                    camera={{ position: [3, 5, 5], fov: 50 }}
                    gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
                    style={{ background: "transparent" }}
                    className="w-full h-full"
                >    
                    <ambientLight intensity={1.5} />
                    <directionalLight
                        position={[-15, 15, 5]}
                        intensity={5.4}
                        castShadow
                    />
                    <Model url={fileUrl} rotation={rotation} />
                    <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                </Canvas>
            </div>
        </div>
    );
});