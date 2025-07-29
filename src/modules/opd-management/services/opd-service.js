"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@/lib/audit/audit-service");
require("@/lib/prisma");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
const appointment = await database_2.prisma.appointment.create({
    data,
    true: ,
    true: 
});
;
if (!session.user) {
    await database_1.AuditService.logUserAction();
    {
        userId: scheduledBy;
    }
    "CREATE",
        "APPOINTMENT",
        appointment.id,
        "OPD appointment scheduled";
    ;
}
return appointment;
async;
checkDoctorAvailability();
doctorId: string,
    string;
Promise < boolean > {
    const: conflictingAppointment = await database_2.prisma.appointment.findFirst({ where: {
            doctorId,
            appointmentDate: date,
            "CANCELLED": 
        }
    }),
    return: conflictingAppointment
};
async;
getDoctorSchedule(doctorId, string, date, Date);
{
    return await database_2.prisma.appointment.findMany({ where: {
            doctorId,
            appointmentDate: date,
            status: { not: "CANCELLED" }
        }, }, {
        true: ,
        true: 
    }, orderBy, { appointmentTime: "asc" });
}
;
async;
updateAppointmentStatus();
appointmentId: string,
    status;
"CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
updatedBy ?  : string;
{
    const oldAppointment = await database_2.prisma.appointment.findUnique({ where: { id: appointmentId }
    });
    if (!session.user) {
        throw new Error("Appointment not found");
        const appointment = await database_2.prisma.appointment.update({ where: { id: appointmentId },
            data: {
                status,
                ...(status === "CANCELLED" && { cancelledAt: new Date() })
            } });
        if (!session.user) {
            await database_1.AuditService.logDataChange();
            {
                userId: updatedBy;
            }
            "APPOINTMENT",
                appointmentId,
                oldAppointment,
                appointment;
            ;
            return appointment;
            async;
            getOPDStats(date ?  : Date);
            {
                const targetDate = date || new Date();
                const startOfDay = ;
                const endOfDay = ;
                const [scheduled, completed, cancelled, inProgress] = await Promise.all([]);
                database_2.prisma.appointment.count({}, { gte: startOfDay, lte: endOfDay }, status, "SCHEDULED");
            }
            database_2.prisma.appointment.count({}, { gte: startOfDay, lte: endOfDay }, status, "COMPLETED");
        }
        database_2.prisma.appointment.count({}, { gte: startOfDay, lte: endOfDay }, status, "CANCELLED");
    }
    database_2.prisma.appointment.count({}, { gte: startOfDay, lte: endOfDay }, status, "IN_PROGRESS");
}
;
;
return { scheduled, completed, cancelled, inProgress };
