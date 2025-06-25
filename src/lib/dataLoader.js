"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoaders = void 0;
require("@/lib/logger");
require("@/lib/prisma");
require("dataloader");
var DataLoader = ;
const database_1 = require("@/lib/database");
const database_2 = require("@/lib/database");
const createLoaders = () => {
    return {
    /**;
     * Patient loader - batch loads patients by ID;
     */ };
    patient: new DataLoader(async (ids) => {
        database_1.logger.debug({ action: "dataLoader.patient", count: ids.length }, "Batch loading patients");
        const patients = await database_2.prisma.patient.findMany({ where: { id: { in: ids } } });
        // Maintain order of requested IDs;
        return ids.map(id => patients.find(p => p.id === id) || null);
    }),
    ;
    bed: new DataLoader(async (ids) => {
        database_1.logger.debug({ action: "dataLoader.bed", count: ids.length }, "Batch loading beds");
        const beds = await database_2.prisma.bed.findMany({ where: { id: { in: ids } } });
        return ids.map(id => beds.find(b => b.id === id) || null);
    }),
    ;
    ward: new DataLoader(async (ids) => {
        database_1.logger.debug({ action: "dataLoader.ward", count: ids.length }, "Batch loading wards");
        const wards = await database_2.prisma.ward.findMany({ where: { id: { in: ids } } });
        return ids.map(id => wards.find(w => w.id === id) || null);
    }),
    ;
    doctor: new DataLoader(async (ids) => {
        database_1.logger.debug({ action: "dataLoader.doctor", count: ids.length }, "Batch loading doctors");
        const doctors = await database_2.prisma.doctor.findMany({ where: { id: { in: ids } } });
        return ids.map(id => doctors.find(d => d.id === id) || null);
    }),
    ;
    encounter: new DataLoader(async (ids) => {
        database_1.logger.debug({ action: "dataLoader.encounter", count: ids.length }, "Batch loading encounters");
        const encounters = await database_2.prisma.encounter.findMany({ where: { id: { in: ids } } });
        return ids.map(id => encounters.find(e => e.id === id) || null);
    }),
    ;
    admission: new DataLoader(async (ids) => {
        database_1.logger.debug({ action: "dataLoader.admission", count: ids.length }, "Batch loading admissions");
        const admissions = await database_2.prisma.admission.findMany({ where: { id: { in: ids } } });
        return ids.map(id => admissions.find(a => a.id === id) || null);
    }),
    ;
    discharge: new DataLoader(async (ids) => {
        database_1.logger.debug({ action: "dataLoader.discharge", count: ids.length }, "Batch loading discharges");
        const discharges = await database_2.prisma.discharge.findMany({ where: { id: { in: ids } } });
        return ids.map(id => discharges.find(d => d.id === id) || null);
    }),
    ;
    progressNote: new DataLoader(async (ids) => {
        database_1.logger.debug({ action: "dataLoader.progressNote", count: ids.length }, "Batch loading progress notes");
        const progressNotes = await database_2.prisma.progressNote.findMany({ where: { id: { in: ids } } });
        return ids.map(id => progressNotes.find(n => n.id === id) || null);
    }),
    ;
    observation: new DataLoader(async (ids) => {
        database_1.logger.debug({ action: "dataLoader.observation", count: ids.length }, "Batch loading observations");
        const observations = await database_2.prisma.observation.findMany({ where: { id: { in: ids } } });
        return ids.map(id => observations.find(o => o.id === id) || null);
    });
};
exports.createLoaders = createLoaders;
/**;
 * Type definition for the data loaders;
 */ ;
 > ;
