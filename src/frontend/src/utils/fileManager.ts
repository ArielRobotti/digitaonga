
export const uploadFile = async (dao: any ,fileId: BigInt, file: File, chunksQty: number, chunkSize: number, setUploadProgress: (chunk: number) => {} ) => {

    let chunksProcessed = 0;
    const promises = [];

    for (let i = 0; i < chunksQty; i++) {
        let start = i * chunkSize;
        const slice = file.slice(start, start + chunkSize);

        const arrayBuffer = await slice.arrayBuffer();
        const chunk = new Uint8Array(arrayBuffer);

        if (i == chunksQty - 1) { await Promise.all(promises) } // si es el ultimo chunk esperamos los promises anteriores

        const chunkPromise = dao.uploadFileChunk({
            fileId,
            chunk,
            index: BigInt(i),
            retry: false,
        }).then(() => {
            // Este .then se ejecuta cuando la promesa de subida se resuelve
            chunksProcessed++;
            // Actualizamos el progreso en base al número de chunks que el backend procesó
            setUploadProgress(chunksProcessed);
        });

        promises.push(chunkPromise);
    }

}

export const rebuildAndDownloadFile = (chunks: Blob[], fileName: string): void => {
    if (chunks.length === 0) {
        return;
    }

    try {
        // 1. UNIR LOS BLOBS
        const mimeType = 'model/gltf-binary'; 
        const fileBlob = new Blob(chunks, { type: mimeType });

        // 2. CREAR URL DE OBJETO
        const url = URL.createObjectURL(fileBlob);

        // 3. FORZAR LA DESCARGA
        const a = document.createElement('a');
        a.style.display = 'none';
        
        // Asigna la URL del objeto y el nombre de archivo.
        a.href = url;
        a.download = fileName; // Esto le dice al navegador el nombre de archivo a guardar.

        // Simula el clic.
        document.body.appendChild(a);
        a.click();
        
        // Limpieza: Revoca la URL y elimina el elemento <a>.
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);


    } catch (error) {
        console.error("Error al reconstruir o forzar la descarga del archivo:", error);
    }
};