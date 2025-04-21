import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    TextField,
    Button,
    Box,
    Typography,
    Slider,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Sidebar from "../sidebar/Sidebar";


const ScheduleConfigurator = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [startHour, setStartHour] = useState(9);
    const [endHour, setEndHour] = useState(18);
    const [lunchStart, setLunchStart] = useState(12);
    const [lunchEnd, setLunchEnd] = useState(13);
    const [isExistingConfig, setIsExistingConfig] = useState(false);

    // Sidebar abierto o cerrado
    const [sidebarAbierto, setSidebarAbierto] = useState(true);
    const toggleSidebar = () => setSidebarAbierto(!sidebarAbierto);

    useEffect(() => {
        fetchConfig(selectedDate.format("YYYY-MM-DD"));
    }, [selectedDate]);

    const fetchConfig = async (date) => {
        try {
            const response = await axios.get(`http://localhost:3000/schedule-config?date=${date}`);
            const config = response.data;

            setStartHour(parseInt(config.workStart));
            setEndHour(parseInt(config.workEnd));
            setLunchStart(parseInt(config.lunchStart));
            setLunchEnd(parseInt(config.lunchEnd));
            setIsExistingConfig(true);
        } catch (error) {
            console.warn("No hay configuración para esta fecha, se usará configuración nueva o por defecto.");
            setStartHour(9);
            setEndHour(18);
            setLunchStart(12);
            setLunchEnd(13);
            setIsExistingConfig(false);
        }
    };

    const handleSave = async () => {
        try {
            await axios.post("http://localhost:3000/api/v1/scheduleConfig/createSchedule", {
                date: selectedDate.format("YYYY-MM-DD"),
                workStart: startHour.toString(),
                workEnd: endHour.toString(),
                lunchStart: lunchStart.toString(),
                lunchEnd: lunchEnd.toString(),
            });

            alert("✅ Configuración guardada correctamente");
            setIsExistingConfig(true);
        } catch (error) {
            console.error("❌ Error guardando la configuración:", error);
            alert(error.response?.data?.message || "Error al guardar");
        }
    };

    const hourMarks = Array.from({ length: 24 }, (_, i) => ({
        value: i,
        label: `${i}:00`,
    }));

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Sidebar isOpen={sidebarAbierto} toggleSidebar={toggleSidebar} />
            <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Configurar Horario Diario
                </Typography>
                <DatePicker
                    label="Selecciona una fecha"
                    value={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                />
                <Box mt={3}>
                    <Typography>Hora de entrada</Typography>
                    <Slider
                        value={startHour}
                        onChange={(e, val) => setStartHour(val)}
                        marks={hourMarks}
                        step={1}
                        min={0}
                        max={23}
                        valueLabelDisplay="auto"
                    />
                    <Typography>Inicio de almuerzo</Typography>
                    <Slider
                        value={lunchStart}
                        onChange={(e, val) => setLunchStart(val)}
                        marks={hourMarks}
                        step={1}
                        min={0}
                        max={23}
                        valueLabelDisplay="auto"
                    />
                    <Typography>Fin de almuerzo</Typography>
                    <Slider
                        value={lunchEnd}
                        onChange={(e, val) => setLunchEnd(val)}
                        marks={hourMarks}
                        step={1}
                        min={0}
                        max={23}
                        valueLabelDisplay="auto"
                    />
                    <Typography>Hora de salida</Typography>
                    <Slider
                        value={endHour}
                        onChange={(e, val) => setEndHour(val)}
                        marks={hourMarks}
                        step={1}
                        min={0}
                        max={23}
                        valueLabelDisplay="auto"
                    />
                </Box>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSave}
                    sx={{ mt: 3 }}
                    disabled={isExistingConfig}
                >
                    {isExistingConfig ? "Ya existe una configuración para esta fecha" : "Guardar configuración"}
                </Button>
            </Box>
        </LocalizationProvider>
    );
};

export default ScheduleConfigurator;
