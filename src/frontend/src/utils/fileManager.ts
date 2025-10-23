
export const uploadFile = async (dao: any ,fileId: BigInt, file: File, chunksQty: number, chunkSize: number, setUploadProgress: (chunk: number) => {} ) => {

    let chunksProcessed = 0;
    const promises = [];

    for (let i = 0; i < chunksQty; i++) {
        let start = i * chunkSize;
        const slice = file.slice(start, start + chunkSize);

        const arrayBuffer = await slice.arrayBuffer();
        const chunk = new Uint8Array(arrayBuffer);
        console.log("Subiendo ", chunk.length, " Bytes from Chunck Nro ", i);

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