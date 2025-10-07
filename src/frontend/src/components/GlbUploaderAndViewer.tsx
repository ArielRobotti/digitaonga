import React, { useState, useRef, useCallback, ChangeEvent } from 'react';
import { Button as MUIButton, Box, Modal, IconButton, Tooltip, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import UploadIcon from '@mui/icons-material/Upload';
import SimpleCheckIcon from '@mui/icons-material/CheckCircle'; // Asumiendo que SimpleCheckIcon es similar a CheckCircle
import { ModelViewer3D } from './ModelViewer3D'; // Asegúrate de que la ruta sea correcta
import { compressAndConvertImage } from "../utils/imageManager"


const chunkSize =  1024 * 1024; 

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
    borderRadius: 5,
    border: "1px solid #2C131A",
    background: "#F8F8F8",
    boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30)",
});

// Tipos para las props del componente
interface GlbUploaderAndViewerProps {
    // Archivo GLB actual (puede ser nulo)
    file: File | null; 
    // Función para actualizar el estado del archivo GLB en el formulario padre
    setFile: (file: File | null) => void;
    // Función para actualizar el estado de la captura (Blob) en el formulario padre
    setScreenshot: (screenshot: Blob | null) => void;
    // Opcional: Para el caso de re-subida, podrías querer un texto diferente o un manejo especial
    buttonText?: string;
    // Opcional: Para manejar el estado de los 'chunks' si es necesario
    setTotalChuncks?: (count: number) => void;
    // Opcional: Para controlar si se debe renderizar el botón (ej. en vista de proposal)
    shouldRenderButton?: boolean;
}

export const GlbUploaderAndViewer: React.FC<GlbUploaderAndViewerProps> = ({
    file,
    setFile,
    setScreenshot,
    setTotalChuncks,
    buttonText = "Upload your file",
    shouldRenderButton = true,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const viewerRef = useRef<HTMLDivElement>(null);

    // Maneja la selección del archivo
    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;

        if (file && file.name.toLowerCase().endsWith('.glb')) {
            // Actualiza el archivo y limpia la captura anterior
            setFile(file);
            setScreenshot(null);
            
            if (setTotalChuncks) {
                setTotalChuncks(Math.ceil(file.size / chunkSize));
            }
            setIsModalOpen(true); // Abre el modal de vista previa
        } else {
            setFile(null);
            if (e.target) {
                e.target.value = ''; // Resetea el input para permitir seleccionar el mismo archivo después de un error
            }
            alert('Por favor, sube un archivo GLB.');
        }
    }, [setFile, setScreenshot, setTotalChuncks]);

    // Maneja la captura de la imagen 3D
    const handleCapture = useCallback(async () => {
        setIsCapturing(true);
        if (viewerRef.current) {
            const canvas = viewerRef.current.querySelector('canvas');
            if (canvas) {
                try {
                    // Obtener el blob del canvas
                    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg'));

                    if (!blob) throw new Error("No se pudo obtener el Blob del canvas.");

                    // Comprimir el blob y convertirlo a Uint8Array
                    // NOTA: 'compressAndConvertImage' debe estar disponible globalmente o importada/definida.
                    const compressedUint8Array = await compressAndConvertImage(blob, 200, 1024, 1024);
                    
                    // Crear un nuevo Blob a partir del Uint8Array
                    const compressedBlob = new Blob([new Uint8Array(compressedUint8Array)], { type: 'image/jpeg' });
                    
                    // Guardar la imagen comprimida en el estado del formulario padre
                    setScreenshot(compressedBlob);
                    
                    setIsModalOpen(false); // Cierra el modal después de la captura
                } catch (error) {
                    console.error("Error al capturar y comprimir la imagen:", error);
                    alert("No se pudo capturar la imagen. Inténtalo de nuevo.");
                } finally {
                    setIsCapturing(false);
                }
            }
        }
    }, [setScreenshot]);

    if (!shouldRenderButton) {
        return null; // No renderiza nada si la condición externa no se cumple
    }

    return (
        <>
            {/* Botón de subida de archivo GLB */}
            <MUIButton
                component="label"
                role={undefined}
                tabIndex={-1}
                endIcon={file ? <SimpleCheckIcon /> : <UploadIcon />}
                className="!rounded-[5px] !border !border-[#2C131A] !bg-[#F8F8F8] !shadow-[0px_4px_8px_0px_rgba(0,0,0,0.15),0px_1px_3px_0px_rgba(0,0,0,0.30)] !text-black md:max-w-[500px] md:w-full"
            >
                {file ? file.name : buttonText}
                <VisuallyHiddenInput
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    accept=".glb"
                />
            </MUIButton>

            {/* Modal de vista previa */}
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '800px',
                    height: '90%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 id="modal-modal-title" className="text-xl font-bold">Vista Previa del Modelo</h2>
                        <IconButton onClick={() => setIsModalOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className="flex-1 min-h-0">
                        {/* Se muestra el ModelViewer3D si hay un archivo cargado */}
                        {file && (
                            <ModelViewer3D fileUrl={URL.createObjectURL(file)} ref={viewerRef} />
                        )}
                    </div>
                    <div className="flex justify-center mt-4">
                        <Tooltip title="Tomar captura">
                            <MUIButton
                                variant="contained"
                                onClick={handleCapture}
                                disabled={isCapturing}
                                startIcon={isCapturing ? <CircularProgress size={20} color="inherit" /> : <img src="/icons/camera.svg" alt="Tomar captura" className="w-5 h-5" />}
                            >
                                {isCapturing ? 'Capturando...' : 'Tomar Captura'}
                            </MUIButton>
                        </Tooltip>
                    </div>
                </Box>
            </Modal>
        </>
    );
};