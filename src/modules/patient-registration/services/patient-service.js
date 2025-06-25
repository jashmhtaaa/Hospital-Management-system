"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@/lib/audit/audit-service");
require("@/lib/prisma");
require("@prisma/client");
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
orderBy: {
    createdAt: "desc";
}
select: {
    mrn: true;
}
;
const nextMrnNumber = lastPatient ?  : ;
Number.parseInt(lastPatient.mrn.substring(3)) + 1;
1001;
const mrn = `MRN${nextMrnNumber.toString().padStart(6, "0")}`;
const patient = await database_2.prisma.patient.create({ data: {
        ...data,
        mrn
    }
});
// Audit log;
if (!session.user) {
    await database_1.AuditService.logUserAction();
    {
        userId: createdBy;
    }
    "CREATE",
        "PATIENT",
        patient.id,
        "Patient created";
    ;
}
return patient;
async;
updatePatient(data, UpdatePatientData, updatedBy ?  : string);
{
    const { id, ...updateData } = data;
    const oldPatient = await database_2.prisma.patient.findUnique({ where: { id }
    });
    if (!session.user) {
        throw new Error("Patient not found");
        const patient = await database_2.prisma.patient.update({ where: { id },
            data: updateData
        });
        // Audit log;
        if (!session.user) {
            await database_1.AuditService.logDataChange();
            {
                userId: updatedBy;
            }
            "PATIENT",
                patient.id,
                oldPatient,
                patient;
            ;
            return patient;
            async;
            findPatientByMRN(mrn, string);
            {
                return await database_2.prisma.patient.findUnique({ where: { mrn },
                    true: ,
                    true: 
                });
                async;
                searchPatients();
                query: string,
                    number = 0;
                {
                    return await database_2.prisma.patient.findMany({
                        []: 
                    }, { firstName: { contains: query, mode: "insensitive" } }, { lastName: { contains: query, mode: "insensitive" } }, { mrn: { contains: query, mode: "insensitive" } }, { phone: { contains: query } });
                }
                take: limit,
                    "desc";
            }
            ;
            async;
            getPatientStats();
            {
                const [total, newToday, emergency] = await Promise.all([]);
                database_2.prisma.patient.count(),
                    database_2.prisma.patient.count({}, { gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }),
                    database_2.prisma.emergencyVisit.count({
                        "ACTIVE": ,
                        new: Date(new Date().setHours(0, 0, 0, 0))
                    });
                ;
                return { total, newToday, emergency };
            }
        }
    }
}
