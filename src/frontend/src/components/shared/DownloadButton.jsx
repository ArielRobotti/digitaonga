import React, { useState, useCallback, useEffect } from 'react';
import Button from "./Button";
import { rebuildAndDownloadFile } from '../../utils/fileManager';

const DownloadButton = ({ asset, taongaRemoteActor }) => {

    const [isDownloading, setIsDownloading] = useState(false);
    const [totalChunks, setTotalChunks] = useState(0);
    const [downloadedChunks, setDownloadedChunks] = useState(0);
    const [downloadedBlobs, setDownloadedBlobs] = useState([]);

    const progressPercentage = totalChunks > 0 ? (downloadedChunks * 100) / totalChunks : 0;


    const MAX_RETRIES = 3; // Límite de reintentos por chunk


    const handleDownload = useCallback(async () => {
        if (!asset.canDownload) return;

        setIsDownloading(true);
        setDownloadedChunks(0);
        setDownloadedBlobs([]);

        try {
            // PASO 1: OBTENER METADATOS Y CANTIDAD TOTAL DE CHUNKS
            const metadata = await taongaRemoteActor.get_asset_metadata(/* ID si es necesario */);
            const chunkQty = Number(metadata.chunkQty);

            setTotalChunks(chunkQty);

            // PASO 2: CREAR Y EJECUTAR TODAS LAS PROMESAS EN PARALELO
            const downloadPromises = [];

            for (let i = 0; i < chunkQty; i++) {
                // Función que encapsula la lógica de descarga y reintento para un solo chunk
                const chunkDownloader = async (index, attempts = 0) => {
                    if (attempts >= MAX_RETRIES) {
                        throw new Error(`Failed to download chunk ${index} after ${MAX_RETRIES} attempts.`);
                    }
                    try {
                        const response = await taongaRemoteActor.get_asset_data({
                            chunkIndex: BigInt(index)
                        });

                        if (response.Ok) {
                            setDownloadedChunks(prev => prev + 1);
                            return {index: index, chunk: response.Ok.chunk};
                        } else {
                            throw new Error(`Actor response error for chunk ${index}: No 'Ok' field.`);
                        }

                    } catch (error) {
                        console.warn(`Error on chunk ${index}. Retrying...`, error);
                        // Esperar un poco antes de reintentar (opcional)
                        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));

                        // Llamada recursiva para reintentar la descarga
                        return chunkDownloader(index, attempts + 1);
                    }
                };

                downloadPromises.push(chunkDownloader(i));
            }

            const results = await Promise.all(downloadPromises);

            results.sort((a, b) => a.index - b.index);

            const finalBlobs = results.map(item => item.chunk);

            setIsDownloading(false);
            setDownloadedBlobs(finalBlobs);


            // --- RECONSTRUCCIÓN Y DESCARGA ---
            const assetFileName = metadata.name.replace(" ", "_") + ".glb";
            rebuildAndDownloadFile(finalBlobs, assetFileName);


        } catch (error) {
            console.error("Error crítico o fallo de reintento en la descarga:", error);
            alert(`Download failed: ${error.message}`);
            setIsDownloading(false);
            setTotalChunks(0); // Reiniciar el progreso
        }
    }, [asset.canDownload, taongaRemoteActor]);
    return (
        <div className="flex flex-col items-center bg-transparent">
            {/* Botón de Descarga */}
            <Button
                className={`
                    w-40!
                    border-2 
                    cursor-default
                    relative 
                    ${asset.canDownload  && 'text-[#77cc77]!'}
                    ${isDownloading && 'text-[#aaaaff]!'}
                    bg-transparent  border-[#77aa77]! disabled:bg-transparent! disabled:border-[#77aa77]
                    ${asset.canDownload && 'transition duration-300 hover:scale-105!'}
                `}
                onClick={handleDownload}
                disabled={!asset.canDownload || isDownloading} 
            >
            {/* Background del boton como progressbar */}
                {isDownloading && (
                <div
                    className="absolute top-0 left-0 h-full bg-[#09ff00] opacity-50 transition-all duration-100 ease-out rounded-l-sm"
                    style={{ width: `${progressPercentage}%`}}
                ></div>
            )}
                {isDownloading ? 'Downloading' : 'Download'}
            </Button>


        </div>
    );
};

export default DownloadButton;