import { CloseIcon, SimpleCheckIcon, UploadIcon } from "../../../../components/ui/icons";
import { Dialog, DialogContent, IconButton, styled, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { digitalTaongaProposals, updateAnExistingDigitalTaonga } from "../../../../utils/data";
import { useNavigate, useSearchParams } from "react-router";
import { ModelViewer3D } from "../../../../components/ModelViewer3D";
import { compressAndConvertImage } from "../../../../utils/imageManager";
import { Modal, Box, Tooltip, CircularProgress } from "@mui/material";

import ActionCard from "../../../../components/proposals/create/ActionCard";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "../../../../components/shared/Button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Button as MUIButton } from "@mui/material";
import ProgressBar from "../../../../components/shared/ProgressBar";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
// import useAssetCanister from "../../../../hooks/useAssetCanister";
import useCanister from "../../../../hooks/useCanister";
// import useProposal from "../../../../hooks/useProposal";
import { useState, useRef, useEffect } from "react";
import { uploadFile } from "../../../../utils/fileManager"
import { blobToImageUrl } from "../../../../utils/imageManager"


const DigitalTaongaProposalCreation = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    history: "",
    impact: "",
    file: null,
    date: dayjs(new Date().toDateString()),
    screenshot: null, // Nuevo estado para guardar el screenshot
  });
  const [selectedTaonga, setSelectedTaonga] = useState(null);
  const [open, setOpen] = useState(false);
  const [responseDialog, setResponseDialog] = useState({ success: false, error: false });
  const [selectedValue, setSelectedValue] = useState(null);
  const [updateType, setUpdateType] = useState(null);
  const [updatedValue, setUpdatedValue] = useState(null);
  const [readyToUpdate, setReadyToUpdate] = useState(false);
  const [readyToCreate, setReadyToCreate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [disableButtons, setDisableButtons] = useState(false);
  const [taongas, setTaongas] = useState([])

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const viewerRef = useRef(null); // Ref para el componente ModelViewer3D

  const action = searchParams.get("action");
  const step =
    action === "Update an Existing Digital Taonga" && updateType
      ? 3
      : !action
        ? 0
        : !form.name || !form.description || !form.history || !form.file
          ? 1
          : 2;

  const handleRadioChange = (e) => setSelectedValue(e.target.value);
  const handleRadioUpdateChange = (e) => setUpdateType(e.target.value);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleResponseError = () => setResponseDialog({ success: false, error: true });
  const handleResponseSuccess = () => setResponseDialog({ success: true, error: false });
  const handleCloseResponseDialog = () => setResponseDialog({ success: false, error: false });

  // Modificar handleFileChange para abrir el modal
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.glb')) {
      setForm({ ...form, file, screenshot: null });
      setTotalChuncks(Math.ceil(file.size / chunkSize))
      setIsModalOpen(true); // Abre el modal de vista previa
    } else {
      setForm({ ...form, file: null });
      alert('Por favor, sube un archivo GLB.');
    }
  };

  const toggleDialog = () => setOpen(!open);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalChunks, setTotalChuncks] = useState(0)

  const [dao] = useCanister();

  useEffect(() => {
    const fetchTaongas = async () => {
      const response = await dao?.get_all_taongas() || []
      setTaongas(response.map((tuple) => tuple[1]))
    }
    fetchTaongas()
  }, [dao])

  // const chunkSize = 1024 * 2047 // 2 MiB - 1 KB
  const chunkSize = 1024 * 1024

  // Nueva función para manejar la captura de pantalla
  const handleCapture = async () => {
    setIsCapturing(true);
    if (viewerRef.current) {
      const canvas = viewerRef.current.querySelector('canvas');
      if (canvas) {
        try {
          // Obtener el blob del canvas
          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

          // Comprimir el blob y convertirlo a Uint8Array
          const compressedUint8Array = await compressAndConvertImage(blob, 300, 1024, 1024); // 100 KB

          // Crear un nuevo Blob a partir del Uint8Array
          const compressedBlob = new Blob([compressedUint8Array], { type: 'image/png' });

          // Guardar la imagen comprimida en el estado del formulario
          setForm(prevForm => ({ ...prevForm, screenshot: compressedBlob }));

          // Crear una URL temporal para mostrar la vista previa en el formulario
          const tempUrl = URL.createObjectURL(compressedBlob);
          setPreviewImageUrl(tempUrl);

          setIsModalOpen(false); // Cierra el modal después de la captura
        } catch (error) {
          console.error("Error al capturar y comprimir la imagen:", error);
          alert("No se pudo capturar la imagen. Inténtalo de nuevo.");
        } finally {
          setIsCapturing(false);
        }
      }
    }
  };

  const handleSubmit = async () => {
    // let digitalTaongaProposalAction;
    setDisableButtons(true)
    try {
      // upload file to asset canister
      const deadline = form.date.unix() * 1_000_000_000;

      switch (selectedValue) {
        case "Create or Upload a New Digital Taonga":
          const rawGLBFile = form.file
          const name = form.name;
          const description = form.description;
          const history = form.history;
          const impact = form.impact;

          // Usamos la captura del estado en lugar de un array vacío
          const thumbnail = new Uint8Array(await form.screenshot.arrayBuffer());
          const dataSize = rawGLBFile.size;

          const chunksQty = Math.ceil(dataSize / chunkSize)

          const newProposalArgs = {
            title: name,
            description,
            impact,
            kind: {
              DigitalTaonga: {
                CreateDigitalTaonga: {
                  name,
                  description,
                  history,
                  deadline,
                  imageID: BigInt(0),
                  thumbnail,
                  chunksQty,
                  dataSize,
                }
              },
            },
            deadline,
            extendedData: [],
          }

          const proposalResponse = await dao.create_proposal(newProposalArgs);
          const fileId = proposalResponse.id;
          await uploadFile(dao, fileId, rawGLBFile, chunksQty, chunkSize, setUploadProgress)

          dao.refresh_all_proposals()
          break;
        case "":
          // digitalTaongaProposalAction = "UpdateDigitalTaonga";
          proposalData = {
            UpdateDigitalTaongaProposal: {
              [updateType]: [updatedValue],
            },
          };
          break;
        case "Delete an Existing Digital Taonga":
          // digitalTaongaProposalAction = "DeleteDigitalTaonga";
          // const deleteTaongaArgs = {canisterId: taongaToDelete, description: form.description}

          const deleteTaongaArgs = {
            title: "Delete Taonga proposal",
            description: form.description,
            impact: "",
            kind: {
              DigitalTaonga: {
                DeleteDigitalTaonga: selectedTaonga
              },
            },
            deadline,
            extendedData: [],
          }
          const response = await dao.create_proposal(deleteTaongaArgs);
          console.log(response)

          break;
        case "Request Download Permission":
          // digitalTaongaProposalAction = "RequestDownloadPermision";
          const requestDownloadArgs = {
            title: "Taonga file download request",
            description: form.description,
            impact: "",
            kind: {
              DigitalTaonga: { RequestDownloadPermision: null }
            },
            deadline,
            extendedData: [
              ["taongaId", {Text: selectedTaonga.toString()}]
            ],
          };
          const responseDownloadRequest = await dao.create_proposal(requestDownloadArgs);
          console.log(responseDownloadRequest)

          break;
        case "Update an Existing Digital Taonga":

          const updateKind = updateType === "Update Digital Taonga File" ? "updateFile" : "updateDescription"
          switch (updateKind) {
            case "updateFile":
              const thumbnail = new Uint8Array(await form.screenshot.arrayBuffer());
              const rawGLBFile = form.file
              const dataSize = rawGLBFile.size;
              const chunksQty = Math.ceil(dataSize / chunkSize)
              console.log({ dataSize })
              console.log({ chunksQty })
              const extendedMetadata = [
                ["taongaId", { Text: selectedTaonga.toString() }],
                ["thumbnail", { Blob: thumbnail }],
                ["size", { Nat: BigInt(dataSize) }],
                ["chunksQty", { Nat: BigInt(chunksQty) }]
              ];
              const updateFileTaongaArgs = {
                title: "Update Taonga File",
                description: form.description,
                impact: "",
                kind: {
                  DigitalTaonga: {
                    UpdateDigitalTaonga: { UpdateImageURL: selectedTaonga.toString() }
                  }
                },
                extendedData: extendedMetadata,
                deadline
              };
              const responseFileUpdate = await dao.create_proposal(updateFileTaongaArgs);
              console.log(responseFileUpdate)
              console.log(responseFileUpdate)
              const fileId = responseFileUpdate.id;
              await uploadFile(dao, fileId, rawGLBFile, chunksQty, chunkSize, setUploadProgress)
              break
            case "updateDescription":

              const updateDescriptionTaongaArgs = {
                title: "Update Description Taonga",
                description: form.description,
                impact: "",
                kind: {
                  DigitalTaonga: {
                    UpdateDigitalTaonga: { UpdateDescription: selectedTaonga.toString() }
                  }
                },
                extendedData: [],
                deadline
              };
              const responseDescriptionUpdate = await dao.create_proposal(updateDescriptionTaongaArgs);
              console.log({ responseDescriptionUpdate })
          }

        default:
          break;
      }

      toggleDialog();
      handleResponseSuccess();
      navigate("/proposals")
    } catch (err) {
      console.log("createProposal error:", err);
      const e = err;
      console.log({ e });
      handleResponseError();
    }
  };

  const taongaSelector = () =>
    <FormControl
      variant="outlined"
      className="material_input md:max-w-[500px] md:w-full bg-white"
      required
    >
      <InputLabel id="taonga-select-label">Choose Digital Taonga</InputLabel>
      <Select
        labelId="taonga-select-label"
        value={form.taongaId || ""}
        onChange={handleSelectTaonga}
        label="Choose Digital Taonga"
        className="h-14 bg-white!"
      >
        {taongas.map((t) => {
          const imageUrl = blobToImageUrl(t.thumbnail);
          return (
            <MenuItem key={t.canisterId} value={t.canisterId} className="">
              {/* 🖼️ Estructura que permite texto y imagen */}
              <Box className="flex items-center justify-between w-full pr-4">
                <span className="text-gray-600">{t.name}</span>
                <img
                  src={imageUrl}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover ml-4" // Clases Tailwind para estilo
                />
              </Box>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>


  const SelectedProposal = () => {
    console.log(action)
    switch (action) {
      case "Create or Upload a New Digital Taonga":
        return (
          <section className="flex flex-col md:items-center gap-8 p-12">
            <TextField
              label="Name"
              variant="outlined"
              onChange={handleChange}
              value={form.name}
              name="name"
              required
              className="material_input md:max-w-[500px] md:w-full"
            />
            <TextField
              label="Cultural Description"
              variant="outlined"
              onChange={handleChange}
              value={form.description}
              name="description"
              required
              className="material_input md:max-w-[500px] md:w-full"
            />
            <TextField
              label="History"
              variant="outlined"
              onChange={handleChange}
              value={form.history}
              name="history"
              required
              className="material_input md:max-w-[500px] md:w-full"
            />

            <TextField
              label="Impact"
              variant="outlined"
              onChange={handleChange}
              value={form.impact}
              name="impact"
              required
              className="material_input md:max-w-[500px] md:w-full"
            />

            <MUIButton
              component="label"
              role={undefined}
              tabIndex={-1}
              endIcon={form.file ? <SimpleCheckIcon /> : <UploadIcon />}
              className="!rounded-[5px] !border !border-[#2C131A] !bg-[#F8F8F8] !shadow-[0px_4px_8px_0px_rgba(0,0,0,0.15),0px_1px_3px_0px_rgba(0,0,0,0.30)] !text-black md:max-w-[500px] md:w-full"
            >
              {form.file ? form.file.name : "Upload your file"}
              <VisuallyHiddenInput
                type="file"
                name="file"
                onChange={handleFileChange}
                accept=".glb" // Añadimos el filtro para .glb
              />
            </MUIButton>

            {/* Vista previa del screenshot */}
            {previewImageUrl && (
              <div className="md:max-w-[500px] md:w-full">
                <h3 className="text-sm font-semibold mb-2">Vista previa de la captura:</h3>
                <img
                  src={previewImageUrl}
                  alt="Captura del modelo 3D"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DateTimePicker
                  label="Voting deadline"
                  onChange={(v) => setForm({ ...form, date: v })}
                  value={form.date}
                  name="date"
                  disablePast
                  className="material_input md:w-[500px]"
                />
              </DemoContainer>
            </LocalizationProvider>
          </section>
        );

      case "Update an Existing Digital Taonga":
        return (
          <section className="flex flex-col md:flex-row md:justify-center gap-4 p-10">
            {updateAnExistingDigitalTaonga.map((p) => (
              <ActionCard
                key={p.title}
                {...p}
                selectedValue={updateType}
                handleRadioChange={handleRadioUpdateChange}
              />
            ))}
          </section>
        );

      case "Delete an Existing Digital Taonga":
        return (
          <section className="flex flex-col md:items-center gap-8 p-12">
            {taongaSelector()}

            <TextField
              label="Reason for Deletion"
              variant="outlined"
              onChange={handleChange}
              value={form.description}
              name="description"
              required
              className="material_input md:max-w-[500px] md:w-full"
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DateTimePicker
                  label="Voting deadline"
                  onChange={(v) => setForm({ ...form, date: v })}
                  value={form.date}
                  name="date"
                  disablePast
                  className="material_input md:w-[500px]"
                />
              </DemoContainer>
            </LocalizationProvider>
          </section>
        )
      case "Request Download Permission":
        return (
          <section className="flex flex-col md:items-center gap-8 p-12">
            {taongaSelector()}

            <TextField
              label="Description Proposal"
              variant="outlined"
              onChange={handleChange}
              value={form.description}
              name="description"
              required
              className="material_input md:max-w-[500px] md:w-full"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DateTimePicker
                  label="Voting deadline"
                  onChange={(v) => setForm({ ...form, date: v })}
                  value={form.date}
                  name="date"
                  disablePast
                  className="material_input md:w-[500px]"
                />
              </DemoContainer>
            </LocalizationProvider>
          </section>
        )
      default:
        break;
    }
  };

  const EditProposal = () => {
    switch (updateType) {
      case "Update Digital Taonga Description":
        return (
          <section className="flex flex-col md:items-center gap-8 p-12">
            {taongaSelector()}
            <TextField
              label="Cultural Description"
              variant="outlined"
              onChange={handleChange}
              value={form.description}
              name="description"
              required
              className="material_input md:max-w-[500px] md:w-full"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DateTimePicker
                  label="Voting deadline"
                  onChange={(v) => setForm({ ...form, date: v })}
                  value={form.date}
                  name="date"
                  disablePast
                  className="material_input md:w-[500px]"
                />
              </DemoContainer>
            </LocalizationProvider>
          </section>
        );
      case "Update Digital Taonga File":
        return (
          <section className="flex flex-col md:items-center gap-8 p-12">
            {taongaSelector()}
            <TextField
              label="Description"
              variant="outlined"
              onChange={handleChange}
              value={form.description}
              name="description"
              required
              className="material_input md:max-w-[500px] md:w-full"
            />
            <MUIButton
              component="label"
              role={undefined}
              tabIndex={-1}
              endIcon={form.file ? <SimpleCheckIcon /> : <UploadIcon />}
              className="!rounded-[5px] !border !border-[#2C131A] !bg-[#F8F8F8] !shadow-[0px_4px_8px_0px_rgba(0,0,0,0.15),0px_1px_3px_0px_rgba(0,0,0,0.30)] !text-black md:max-w-[500px] w-full !py-3"
              onChange={handleFileChange}
            >
              {form.file ? form.file.name : "Attachments (Optional)"}
              <VisuallyHiddenInput
                type="file"
                onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                multiple
              />
            </MUIButton>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DateTimePicker
                  label="Voting deadline"
                  onChange={(v) => setForm({ ...form, date: v })}
                  value={form.date}
                  name="date"
                  disablePast
                  className="material_input md:w-[500px]"
                />
              </DemoContainer>
            </LocalizationProvider>
          </section>
        );
      default:
        <></>;
        break;
    }
  };

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
    border: "1px solid  #2C131A",
    background: "#F8F8F8",
    boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.30)",
  });


  const handleSelectTaonga = (e) => {
    setForm({ ...form, taongaId: e.target.value, impact: " ", history: " ", })
    setSelectedTaonga(e.target.value)
    // console.log({selectedTaonga})
  }

  return (
    <main>
      <section className="p-6">
        <h4 className="uppercase">
          {action === "Create or Upload a New Digital Taonga"
            ? "Creates a 3D high-resolution Digital Taonga"
            : action === "Update an Existing Digital Taonga"
              ? action
              : "What action should be proposed?"}
        </h4>
        <p>
          {action === "Create or Upload a New Digital Taonga"
            ? "Upload your 3D Artefact file and add description."
            : action === "Update an Existing Digital Taonga"
              ? ""
              : "Choose the type of proposal for managing Digital Taonga."}
        </p>
      </section>

      {readyToUpdate ? (
        EditProposal()
      ) : action ? (
        SelectedProposal()
      ) : (
        <section className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-4 p-10 md:p-0 md:max-w-[800px] md:mx-auto mb-10">
          {digitalTaongaProposals.map((p) => (
            <ActionCard
              key={p.title}
              {...p}
              selectedValue={selectedValue}
              handleRadioChange={handleRadioChange}
            />
          ))}
        </section>
      )}

      {/* TODO (fran): crear custom dialog */}
      <Dialog onClose={toggleDialog} open={open} fullWidth maxWidth="xs">
        <h3 className="text-[#525252] text-center p-4 pt-6">PROPOSAL SUMMARY</h3>
        <IconButton
          aria-label="close"
          onClick={toggleDialog}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent className="grid gap-4">
          <p>
            <span className="font-bold">Digital Taonga Name:</span> {form.name}
          </p>
          <p>
            <span className="font-bold">Cultural description:</span> {form.description}
          </p>
          <p>
            <span className="font-bold">History:</span> {form.history}
          </p>
          <p>
            <span className="font-bold">File name:</span> {form.file?.name}
          </p>
          <p>
            <span className="font-bold">Deadline:</span> {dayjs(form.date).format("MM/DD/YYYY")}
          </p>
          <p>
            <span className="font-bold">Screenshoot:</span> {form.screenshot ? 'Yes' : 'No'}
          </p>
        </DialogContent>

        <section className="w-full flex justify-center gap-4 p-4 pb-6">
          <Button size="small" onClick={toggleDialog} disabled={disableButtons}>
            Cancel
          </Button>
          <Button size="small" variant="kokowai" onClick={handleSubmit}
            disabled={disableButtons || (action === "Create or Upload a New Digital Taonga" && !form.screenshot)}
          >
            Submit
          </Button>
        </section>
        <div className="flex justify-center">
          <ProgressBar
            step={uploadProgress}
            totalSteps={totalChunks}
            className="mt-12 mb-2 w-90 align-center"
          />
        </div>
      </Dialog>

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
            <h2 id="modal-modal-title" className="text-xl font-bold">Preview</h2>
            <IconButton onClick={() => setIsModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className="flex-1 min-h-0">
            {form.file && (
              <ModelViewer3D fileUrl={URL.createObjectURL(form.file)} ref={viewerRef} />
            )}
          </div>
          <div className="flex justify-center mt-4">
            <Tooltip title="Screenshoot">
              <MUIButton
                variant="contained"
                onClick={handleCapture}
                disabled={isCapturing}
                startIcon={isCapturing ? <CircularProgress size={20} color="inherit" /> : <img src="/icons/camera.svg" alt="Tomar captura" className="w-5 h-5" />} // Reemplazamos PhotoCameraIcon con una imagen SVG
              >
                {isCapturing ? 'Capturing...' : 'Take screenshot'}
              </MUIButton>
            </Tooltip>
          </div>
        </Box>
      </Modal>

      {/* TODO (fran): ver que cuando se cierre este dialog deberia mandarlo a la proposal o la lista de proposals */}
      <Dialog
        onClose={handleCloseResponseDialog}
        open={responseDialog.success || responseDialog.error}
        fullWidth
        maxWidth="xs"
      >
        <IconButton
          aria-label="close"
          onClick={handleCloseResponseDialog}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent>
          <h5 className="text-center">
            {responseDialog.success ? "Proposal created successfully!" : "Error creating proposal"}
          </h5>
        </DialogContent>

        <section className="w-full flex justify-center gap-4 p-4 pb-6">
          <Button size="small" variant="kokowai" onClick={handleCloseResponseDialog}>
            Accept
          </Button>
        </section>
      </Dialog>

      <div className="grid place-items-center inset-x-0 grid gap-8 z-0 place-items-center">
        <Button
          className="shadow-[0px_4px_8px_0px_#00000026,0px_1px_3px_0px_#0000004c] border-none"
          variant="kokowai"
          onClick={() => {
            if (action === "Update an Existing Digital Taonga" && updateType && !readyToUpdate) {
              // Transición de la selección del tipo de update a la pantalla de edición
              setReadyToUpdate(true);
            } else if (readyToUpdate || action) {
              // Si estoy en la pantalla de edición (readyToUpdate) o en otra acción, abro el diálogo.
              toggleDialog();
            } else {
              // Navegación inicial
              navigate(`/proposals/create/Digital Taonga proposal?action=${selectedValue}`);
            }
          }}

          disabled={

            readyToUpdate
              ? // A. Validar Actualización de Descripción
              updateType === "Update Digital Taonga Description"
                ? // REGLAS: Descripción, TaongaId, Fecha y Fecha NO pasada
                  !form.description || !form.taongaId || !form.date || form.date.isBefore(dayjs())
                : // B. Validar Actualización de Archivo (el otro caso de updateType)
                  updateType === "Update Digital Taonga File"
                  ? // REGLAS: Todos los campos + Archivo y Screenshot
                    !form.file || !form.screenshot || !form.description || !form.taongaId || !form.date || form.date.isBefore(dayjs())
                  : // C. Caso readyToUpdate=true, pero updateType=null (No debería pasar, pero se deshabilita por seguridad)
                    true
              : // (Si readyToUpdate es FALSE, entramos a la lógica de navegación/selección)

              action === "Update an Existing Digital Taonga"
                ? !updateType
                // Creación
                : action === "Create or Upload a New Digital Taonga"
                  ? !form.name || !form.description || !form.history || !form.file || !form.screenshot
                  : action === "Request Download Permission"
                    ? !form.taongaId || !form.description || !form.date || form.date.isBefore(dayjs())

                  // Borrado o caso acción vacía
                  : action === "Delete an Existing Digital Taonga" || action === ""
                    ? !form.taongaId || !form.description || !form.date || form.date.isBefore(dayjs())

                    // Caso por defecto (Selección inicial)
                    : !selectedValue
          }

        >
          {readyToUpdate && readyToCreate
            ? "Create Proposal"
            : action === "Update an Existing Digital Taonga"
              ? updateType == "Update Digital Taonga File"
                ? form.file && form.screenshot ? "Create proposal" : "Next"
                : form.description ? "Create proposal" : "Next"
              : action
                ? "Create proposal"
                : "Next"}
        </Button>
        <ProgressBar step={step} totalSteps={5} className="w-[288px]  md:w-[550px] xl:w-[512px]" />
      </div>
    </main>
  );
};

export default DigitalTaongaProposalCreation;
