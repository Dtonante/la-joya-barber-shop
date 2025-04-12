import cron from "node-cron";
import quoteModel from "../models/quoteModel.js";

export const autoMarkAsCompleted = () => {
    // Se ejecuta cada 30 minutos: en el minuto 0 y el minuto 30 de cada hora
    cron.schedule("0,30 * * * *", async () => {
      console.log(`🕒 [Cron Job] Ejecutado a las: ${new Date().toLocaleString()}`); // Log al inicio para saber si está ejecutando
  
      try {
        const ahora = new Date();
        console.log(`[Cron Job] Hora actual: ${ahora}`);
  
        const citasActivas = await quoteModel.findAll({
          where: { status: "activa" }
        });
  
        console.log(`[Cron Job] Citas activas encontradas: ${citasActivas.length}`);
  
        for (const cita of citasActivas) {
          const fechaCita = new Date(cita.dateAndTimeQuote);
          console.log(`[Cron Job] Cita ID ${cita.id_quotePK} - Fecha: ${fechaCita}`);
  
          // Verifica que sea el mismo día
          const esHoy =
            fechaCita.getDate() === ahora.getDate() &&
            fechaCita.getMonth() === ahora.getMonth() &&
            fechaCita.getFullYear() === ahora.getFullYear();
  
          if (esHoy) {
            const diferenciaMin = (ahora - fechaCita) / 1000 / 60;
            console.log(`[Cron Job] Diferencia de minutos para la cita ID ${cita.id_quotePK}: ${diferenciaMin.toFixed(1)} minutos`);
  
            if (diferenciaMin >= 30) {
              await cita.update({ status: "realizada" });
              console.log(
                `✅ [${new Date().toLocaleString()}] Cita ID ${cita.id_quotePK} marcada como 'realizada'`
              );
            }
          }
        }
      } catch (error) {
        console.error("❌ Error en el cron job:", error.message);
      }
    });
  };
  
