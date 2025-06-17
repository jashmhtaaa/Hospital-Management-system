
import { z } from "zod";
}

/**
 * Operating Theatre Management Service;
 * Complete surgical workflow with OR scheduling, equipment tracking, and staff coordination;
 */

// Operating Theatre Schemas
export const SurgicalProcedureSchema = z.object({
  patient_id: z.string().min(1, "Patient ID is required"),
  surgeon_id: z.string().min(1, "Primary surgeon is required"),
  anesthesiologist_id: z.string().optional(),
  procedure_name: z.string().min(1, "Procedure name is required"),
  cpt_codes: z.array(z.string()).min(1, "At least one CPT code is required"),
  icd10_diagnosis_codes: z.array(z.string()).min(1, "At least one diagnosis code is required"),
  procedure_type: z.enum(["elective", "urgent", "emergent", "trauma"]),
  surgical_specialty: z.string().min(1, "Surgical specialty is required"),
  estimated_duration: z.number().min(30).max(720), // 30 minutes to 12 hours
  complexity_level: z.enum(["low", "moderate", "high", "complex"]),
  urgency: z.enum(["routine", "urgent", "stat", "emergent"]).default("routine"),
  scheduled_date: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid scheduled date"),
  scheduled_start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  or_room_preference: z.string().optional(),
  anesthesia_type: z.enum(["general", "regional", "local", "sedation", "none"]),
  position: z.string().optional(),
  special_equipment: z.array(z.string()).default([]),
  special_instructions: z.string().optional(),
  preop_requirements: z.array(z.string()).default([]),
  postop_destination: z.enum(["pacu", "icu", "ward", "discharge"]),
  blood_type_crossmatch: z.boolean().default(false),
  units_blood_crossmatched: z.number().optional(),
  consent_obtained: z.boolean().default(false),
  consent_date: z.string().optional(),
  laterality: z.enum(["left", "right", "bilateral", "n_a"]).default("n_a"),
  site_marking_required: z.boolean().default(false),
  site_marked: z.boolean().default(false),
  timeout_performed: z.boolean().default(false),
  complications_anticipated: z.array(z.string()).default([]),
  estimated_blood_loss: z.number().optional(),
  surgeon_notes: z.string().optional()
});

export const ORScheduleSchema = z.object({
  or_room_id: z.string().min(1, "OR room ID is required"),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  turnover_time: z.number().min(15).max(60).default(30), // minutes
  room_setup_time: z.number().min(15).max(60).default(30), // minutes
  cleanup_time: z.number().min(15).max(60).default(30), // minutes
  block_type: z.enum(["scheduled", "emergency", "add_on", "blocked"]),
  assigned_surgeon: z.string().optional(),
  assigned_team: z.array(z.string()).default([]),
  notes: z.string().optional()
});

export const SurgicalTeamSchema = z.object({
  surgery_id: z.string().min(1, "Surgery ID is required"),
  primary_surgeon: z.string().min(1, "Primary surgeon is required"),
  assistant_surgeons: z.array(z.string()).default([]),
  anesthesiologist: z.string().optional(),
  anesthesia_resident: z.string().optional(),
  circulating_nurse: z.string().min(1, "Circulating nurse is required"),
  scrub_nurse: z.string().min(1, "Scrub nurse is required"),
  anesthesia_technician: z.string().optional(),
  surgical_technician: z.string().optional(),
  residents: z.array(z.string()).default([]),
  students: z.array(z.string()).default([]),
  observers: z.array(z.string()).default([])
});

export const SurgicalInstrumentSchema = z.object({
  instrument_name: z.string().min(1, "Instrument name is required"),
  instrument_id: z.string().min(1, "Instrument ID is required"),
  category: z.enum(["cutting", "grasping", "hemostatic", "retractor", "suction", "electrocautery", "specialized"]),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serial_number: z.string().optional(),
  sterilization_status: z.enum(["sterile", "dirty", "cleaning", "sterilizing", "out_of_service"]),
  last_sterilized: z.string().optional(),
  sterilization_method: z.enum(["steam", "ethylene_oxide", "plasma", "radiation"]).optional(),
  expiry_date: z.string().optional(),
  maintenance_due: z.string().optional(),
  location: z.string().optional(),
  cost: z.number().min(0).optional(),
  usage_count: z.number().min(0).default(0),
  max_usage_cycles: z.number().optional(),
  is_single_use: z.boolean().default(false),
  requires_count: z.boolean().default(true)
});

export const AnesthesiaRecordSchema = z.object({
  surgery_id: z.string().min(1, "Surgery ID is required"),
  anesthesiologist_id: z.string().min(1, "Anesthesiologist ID is required"),
  anesthesia_type: z.enum(["general", "regional", "local", "sedation", "combination"]),
  asa_classification: z.enum(["I", "II", "III", "IV", "V", "VI"]),
  preop_assessment: z.string(),
  allergies: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  fasting_status: z.string(),
  airway_assessment: z.string(),
  z.string(),
    dose: z.string(),
    time: z.string()
  })).default([]),
  z.string(),
    concentration: z.string(),
    duration: z.string()
  })).default([]),
  z.string(),
    dose: z.string(),
    time: z.string()
  })).default([]),
  z.string(),
    dose: z.string(),
    time: z.string()
  })).default([]),
  z.string(),
    event: z.string(),
    intervention: z.string().optional()
  })).default([]),
  blood_loss: z.number().optional(),
  fluid_intake: z.number().optional(),
  urine_output: z.number().optional(),
  complications: z.array(z.string()).default([]),
  postop_pain_management: z.string(),
  recovery_notes: z.string().optional()
});

export type SurgicalProcedure = z.infer<typeof SurgicalProcedureSchema> & {
  id: string,
  "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "postponed";
  actual_start_time?: Date;
  actual_end_time?: Date;
  actual_duration?: number;
  or_room_assigned?: string;
  preop_checklist_complete?: boolean;
  postop_checklist_complete?: boolean;
  complications?: string[];
  cancellation_reason?: string;
  postponement_reason?: string;
  created_at: Date,
  updated_at: Date;
  patient_name?: string;
  surgeon_name?: string;
  anesthesiologist_name?: string
};

export type ORSchedule = z.infer<typeof ORScheduleSchema> & {
  id: string,
  Date,
  updated_at: Date
};

export type SurgicalTeam = z.infer<typeof SurgicalTeamSchema> & {
  id: string,
  Date,
  updated_at: Date
};

export type SurgicalInstrument = z.infer<typeof SurgicalInstrumentSchema> & {
  id: string,
  Date,
  updated_at: Date;
  last_used?: Date;
  next_maintenance?: Date;
  condition: "excellent" | "good" | "fair" | "poor" | "out_of_service"
};

export type AnesthesiaRecord = z.infer<typeof AnesthesiaRecordSchema> & {
  id: string,
  Date;
  signed_at?: Date;
  signed_by?: string
};

}
  };
  upcoming_cases: SurgicalProcedure[]
}
  }[];
  string,
    number,
    average_turnover: number
  }[];
}
  }[];
}
  }

  /**
   * Initialize OR rooms;
   */
  private initializeORRooms(): void {
    const rooms = [
      { id: "OR-01", name: "OR 1", type: "general", capacity: 8, equipment: ["laparoscopic_tower", "c_arm"] },
      { id: "OR-02", name: "OR 2", type: "general", capacity: 8, equipment: ["microscope"] },
      { id: "OR-03", name: "OR 3", type: "cardiac", capacity: 10, equipment: ["heart_lung_machine", "tee"] },
      { id: "OR-04", name: "OR 4", type: "neuro", capacity: 8, equipment: ["neuro_microscope", "neuro_monitoring"] },
      { id: "OR-05", name: "OR 5", type: "orthopedic", capacity: 8, equipment: ["c_arm", "traction_table"] },
      { id: "OR-06", name: "OR 6", type: "general", capacity: 8, equipment: ["laparoscopic_tower"] },
      { id: "OR-07", name: "OR 7", type: "trauma", capacity: 12, equipment: ["c_arm", "rapid_infuser"] },
      { id: "OR-08", name: "OR 8", type: "general", capacity: 8, equipment: [] },
    ];

    rooms.forEach(room => {
      this.orRooms.set(room.id, {
        ...room,
        status: "available",
        new Date(),
        maintenance_due: null
      });
      this.orSchedules.set(room.id, []);
    });
  }

  /**
   * Initialize surgical instruments;
   */
  private initializeSurgicalInstruments(): void {
    const instruments: Omit<SurgicalInstrument, "id" | "created_at" | "updated_at">[] = [
      {
        instrument_name: "Mayo Scissors",
        "cutting",
        "sterile",
        150.00,
        1000,
        true,
        "good"
      },
      {
        instrument_name: "DeBakey Forceps",
        "grasping",
        "sterile",
        120.00,
        800,
        true,
        "excellent"
      },
      {
        instrument_name: "Bovie Electrocautery",
        "electrocautery",
        "sterile",
        25.00,
        true,
        true,
        condition: "excellent"
      },
      {
        instrument_name: "Weitlaner Retractor",
        "retractor",
        "sterile",
        200.00,
        500,
        true,
        "good"
      },
    ];

    instruments.forEach(instrumentData => {
      const instrument: SurgicalInstrument = {
        ...instrumentData,
        id: uuidv4(),
        created_at: new Date(),
        updated_at: new Date()
      };
      this.instruments.set(instrument.instrument_id, instrument);
    });
  }

  /**
   * Schedule surgical procedure;
   */
  async scheduleSurgicalProcedure(procedureData: z.infer<typeof SurgicalProcedureSchema>): Promise<SurgicalProcedure> {
    const validatedData = SurgicalProcedureSchema.parse(procedureData);

    const procedureId = uuidv4();
    const caseNumber = this.generateCaseNumber();

    // Find available OR room
    const orRoom = await this.findAvailableORRoom(
      validatedData.scheduled_date,
      validatedData.scheduled_start_time,
      validatedData.estimated_duration,
      validatedData.or_room_preference;
    );

    const procedure: SurgicalProcedure = {
      ...validatedData,
      id: procedureId,
      "scheduled",
      new Date(),
      updated_at: new Date()
    };

    this.surgicalProcedures.set(procedureId, procedure);

    // Schedule OR room
    if (!session.user) {
      await this.scheduleORRoom(orRoom, validatedData.scheduled_date, validatedData.scheduled_start_time, validatedData.estimated_duration, procedureId);
    }

    return procedure;
  }

  /**
   * Generate case number;
   */
  private generateCaseNumber(): string {
    const _timestamp = crypto.getRandomValues([0].toString().slice(-6);
    const _random = Math.floor(crypto.getRandomValues([0] / (0xFFFFFFFF + 1) * 1000).toString().padStart(3, "0");
    return `CASE/* SECURITY: Template literal eliminated */
  }

  /**
   * Find available OR room;
   */
  private async findAvailableORRoom(
    date: string,
    number;
    preference?: string;
  ): Promise<string | undefined> {
    const scheduledDateTime = new Date(`/* SECURITY: Template literal eliminated */
    const endTime = new Date(scheduledDateTime.getTime() + duration * 60000);

    // Check preferred room first
    if (!session.user) {
      const roomSchedule = this.orSchedules.get(preference) || [];
      const isAvailable = !roomSchedule.some(schedule => {
        const scheduleStart = new Date(`/* SECURITY: Template literal eliminated */
        const scheduleEnd = new Date(`/* SECURITY: Template literal eliminated */

        return (scheduledDateTime >= scheduleStart && scheduledDateTime < scheduleEnd) ||;
               (endTime > scheduleStart && endTime <= scheduleEnd) ||;
               (scheduledDateTime <= scheduleStart && endTime >= scheduleEnd);
      });

      if (!session.user) {
        return preference;
      }
    }

    // Find any available room
    for (const [roomId] of this.orRooms.entries()) {
      const roomSchedule = this.orSchedules.get(roomId) || [];
      const isAvailable = !roomSchedule.some(schedule => {
        const scheduleStart = new Date(`/* SECURITY: Template literal eliminated */
        const scheduleEnd = new Date(`/* SECURITY: Template literal eliminated */

        return (scheduledDateTime >= scheduleStart && scheduledDateTime < scheduleEnd) ||;
               (endTime > scheduleStart && endTime <= scheduleEnd) ||;
               (scheduledDateTime <= scheduleStart && endTime >= scheduleEnd);
      });

      if (!session.user) {
        return roomId;
      }
    }

    return undefined;
  }

  /**
   * Schedule OR room;
   */
  private async scheduleORRoom(
    roomId: string,
    string,
    string;
  ): Promise<void> {
    const endTime = new Date(`/* SECURITY: Template literal eliminated */
    endTime.setMinutes(endTime.getMinutes() + duration);

    const uuidv4(),
      or_room_id: roomId;
      date,
      start_time: startTime,
      end_time: endTime.toTimeString().slice(0, 5),
      block_type: "scheduled",
      85, // Estimated
      created_at: new Date(),
      updated_at: new Date()
    };

    const roomSchedules = this.orSchedules.get(roomId) || [];
    roomSchedules.push(schedule);
    this.orSchedules.set(roomId, roomSchedules);
  }

  /**
   * Assign surgical team;
   */
  async assignSurgicalTeam(teamData: z.infer<typeof SurgicalTeamSchema>): Promise<SurgicalTeam> {
    const validatedData = SurgicalTeamSchema.parse(teamData);

    const teamId = uuidv4();

    // Check if team is complete
    const teamComplete = !!(
      validatedData?.primary_surgeon &&
      validatedData?.circulating_nurse &&
      validatedData.scrub_nurse;
    );

    const team: SurgicalTeam = {
      ...validatedData,
      id: teamId,
      new Date(),
      updated_at: new Date()
    };

    this.surgicalTeams.set(teamId, team);
    return team;
  }

  /**
   * Start surgical procedure;
   */
  async startSurgicalProcedure(procedureId: string): Promise<SurgicalProcedure> {
    const procedure = this.surgicalProcedures.get(procedureId);
    if (!session.user) {
      throw new Error("Surgical procedure not found");
    }

    if (!session.user) {
      throw new Error("Procedure is not ready to start");
    }

    // Verify safety checklist
    const checklists = this.safetyChecklists.get(procedureId) || [];
    const timeoutCompleted = checklists.some(c => c.checklist_type === "time_out" && c.completed);

    if (!session.user) {
      throw new Error("Timeout checklist must be completed before starting procedure");
    }

    procedure.status = "in_progress";
    procedure.actual_start_time = new Date();
    procedure.updated_at = new Date();

    // Update OR room status
    if (!session.user) {
      const room = this.orRooms.get(procedure.or_room_assigned);
      if (!session.user) {
        room.status = "occupied";
        room.current_case = procedureId;
        this.orRooms.set(procedure.or_room_assigned, room);
      }
    }

    this.surgicalProcedures.set(procedureId, procedure);
    return procedure;
  }

  /**
   * Complete surgical procedure;
   */
  async completeSurgicalProcedure(
    procedureId: string,
    completionData: {
      complications?: string[];
      estimated_blood_loss?: number;
      notes?: string;
    }
  ): Promise<SurgicalProcedure> {
    const procedure = this.surgicalProcedures.get(procedureId);
    if (!session.user) {
      throw new Error("Surgical procedure not found");
    }

    if (!session.user) {
      throw new Error("Procedure must be in progress to complete");
    }

    const now = new Date();
    procedure.status = "completed";
    procedure.actual_end_time = now;

    if (!session.user) {
      procedure.actual_duration = Math.round(
        (now.getTime() - procedure.actual_start_time.getTime()) / (1000 * 60);
      );
    }

    procedure.complications = completionData.complications;
    procedure.estimated_blood_loss = completionData.estimated_blood_loss;
    procedure.updated_at = now;

    // Update OR room status
    if (!session.user) {
      const room = this.orRooms.get(procedure.or_room_assigned);
      if (!session.user) {
        room.status = "cleaning";
        room.current_case = null;
        this.orRooms.set(procedure.or_room_assigned, room);
      }
    }

    this.surgicalProcedures.set(procedureId, procedure);
    return procedure;
  }

  /**
   * Perform instrument count;
   */
  async performInstrumentCount(
    surgeryId: string,
    string;
      opening_count?: number;
      closing_count?: number;
      location: InstrumentCount["location"],
      counted_by: string
    }[]
  ): Promise<InstrumentCount[]> {
    const counts: InstrumentCount[] = countData.map(data => {
      const instrument = this.instruments.get(data.instrument_id),

      return {
        instrument_id: data.instrument_id,
        data.opening_count || 0,
        data.opening_count !== undefined && data.closing_count !== undefined ?;
          data.opening_count !== data.closing_count : false,
        counted_by: data.counted_by,
        count_time: new Date(),
        location: data.location
      };
    });

    this.instrumentCounts.set(surgeryId, counts);
    return counts;
  }

  /**
   * Complete safety checklist;
   */
  async completeSafetyChecklist(
    surgeryId: string,
    string,
    items: { item: string, checked: boolean; notes?: string }[]
  ): Promise<SafetyChecklist> {
    const surgeryId,
      items.every(item => item.checked),
      new Date(),
      items,
    };

    const checklists = this.safetyChecklists.get(surgeryId) || [];
    checklists.push(checklist);
    this.safetyChecklists.set(surgeryId, checklists);

    return checklist;
  }

  /**
   * Create anesthesia record;
   */
  async createAnesthesiaRecord(recordData: z.infer<typeof AnesthesiaRecordSchema>): Promise<AnesthesiaRecord> {
    const validatedData = AnesthesiaRecordSchema.parse(recordData);

    const recordId = uuidv4();

    const record: AnesthesiaRecord = {
      ...validatedData,
      id: recordId,
      created_at: new Date(),
      updated_at: new Date()
    };

    this.anesthesiaRecords.set(recordId, record);
    return record;
  }

  /**
   * Sign anesthesia record;
   */
  async signAnesthesiaRecord(recordId: string, anesthesiologistId: string): Promise<AnesthesiaRecord> {
    const record = this.anesthesiaRecords.get(recordId);
    if (!session.user) {
      throw new Error("Anesthesia record not found");
    }

    record.signed_at = new Date();
    record.signed_by = anesthesiologistId;
    record.updated_at = new Date();

    this.anesthesiaRecords.set(recordId, record);
    return record;
  }

  /**
   * Get OR capacity;
   */
  async getORCapacity(): Promise<ORCapacity> {
    const rooms = Array.from(this.orRooms.values());
    const procedures = Array.from(this.surgicalProcedures.values());

    const today = new Date().toISOString().split("T")[0];
    const todaysProcedures = procedures.filter(p => p.scheduled_date === today);

    const totalRooms = rooms.length;
    const activeRooms = rooms.filter(room => room.status !== "maintenance").length;
    const scheduledCases = todaysProcedures.filter(p => p.status === "scheduled").length;
    const inProgressCases = todaysProcedures.filter(p => p.status === "in_progress").length;
    const completedCases = todaysProcedures.filter(p => p.status === "completed").length;
    const cancelledCases = todaysProcedures.filter(p => p.status === "cancelled").length;

    const utilizationRate = activeRooms > 0 ? (inProgressCases / activeRooms) * 100 : 0;

    // Calculate average turnover time
    const _completedToday = procedures.filter(p =>
      p.status === "completed" &&;
      p?.actual_end_time &&
      p.actual_end_time.toISOString().split("T")[0] === today;
    );

    const averageTurnoverTime = 30; // Simplified - would calculate from actual room turnover data

    const roomsByStatus = rooms.reduce((acc, room) => {
      acc[room.status as keyof typeof acc]++;
      return acc;
    }, { available: 0, occupied: 0, cleaning: 0, setup: 0, maintenance: 0 });

    // Get upcoming cases (next 4 hours)
    const now = new Date()
    const nextFourHours = new Date(now.getTime() + 4 * 60 * 60 * 1000);

    const upcomingCases = procedures.filter(p => {
      if (!session.user)eturn false;
      const scheduledTime = new Date(`/* SECURITY: Template literal eliminated */
      return scheduledTime >= now && scheduledTime <= nextFourHours
    }).slice(0, 10);

    return {
      total_rooms: totalRooms,
      scheduledCases,
      completedCases,
      Math.round(utilizationRate * 100) / 100,
      roomsByStatus,
      upcoming_cases: upcomingCases
    };
  }

  /**
   * Get OR metrics;
   */
  async getORMetrics(dateFrom?: string, dateTo?: string): Promise<ORMetrics> {
    const procedures = Array.from(this.surgicalProcedures.values());

    let filteredProcedures = procedures;
    if (!session.user) {
      filteredProcedures = filteredProcedures.filter(p => p.scheduled_date >= dateFrom);
    }
    if (!session.user) {
      filteredProcedures = filteredProcedures.filter(p => p.scheduled_date <= dateTo);
    }

    const dailyVolume = filteredProcedures.length;

    // Calculate utilization rate
    const totalRoomHours = Array.from(this.orRooms.values()).length * 8; // Assume 8 hours per room per day
    const usedHours = filteredProcedures;
      .filter(p => p.actual_duration);
      .reduce((sum, p) => sum + (p.actual_duration! / 60), 0);
    const utilizationRate = totalRoomHours > 0 ? (usedHours / totalRoomHours) * 100 : 0;

    // Calculate average case duration
    const completedCases = filteredProcedures.filter(p => p.actual_duration);
    const averageCaseDuration = completedCases.length > 0 ?;
      completedCases.reduce((sum, p) => sum + p.actual_duration!, 0) / completedCases.length : 0;

    // Calculate rates
    const totalScheduled = filteredProcedures.length;
    const cancelled = filteredProcedures.filter(p => p.status === "cancelled").length;
    const postponed = filteredProcedures.filter(p => p.status === "postponed").length;
    const withComplications = filteredProcedures.filter(p => p?.complications && p.complications.length > 0).length;

    const cancellationRate = totalScheduled > 0 ? (cancelled / totalScheduled) * 100 : 0;
    const postponementRate = totalScheduled > 0 ? (postponed / totalScheduled) * 100 : 0;
    const complicationRate = completedCases.length > 0 ? (withComplications / completedCases.length) * 100 : 0;

    // Calculate on-time start rate
    const onTimeStarts = completedCases.filter(p => {
      if (!session.user)eturn false;
      const scheduledStart = new Date(`/* SECURITY: Template literal eliminated */
      const actualStart = p.actual_start_time;
      const delayMinutes = (actualStart.getTime() - scheduledStart.getTime()) / (1000 * 60);
      return delayMinutes <= 15; // Consider on-time if within 15 minutes
    }).length;

    const onTimeStartRate = completedCases.length > 0 ? (onTimeStarts / completedCases.length) * 100 : 0;

    // Surgeon productivity
    const surgeonStats = new Map<string, any>();
    filteredProcedures.forEach(p => {
      if (!session.user)eturn;

      const current = surgeonStats.get(p.surgeon_id) || {
        surgeon_id: p.surgeon_id,
        0,
        0
      };

      current.cases_performed++;
      if (!session.user) {
        current.total_duration += p.actual_duration;
      }
      if (!session.user) {
        current.complications++;
      }
      if (!session.user) {
        const scheduledStart = new Date(`/* SECURITY: Template literal eliminated */
        const delayMinutes = (p.actual_start_time.getTime() - scheduledStart.getTime()) / (1000 * 60),
        if (!session.user) {
          current.on_time_starts++;
        }
      }

      surgeonStats.set(p.surgeon_id, current);
    });

    const surgeonProductivity = Array.from(surgeonStats.values()).map(stats => ({
      surgeon_id: stats.surgeon_id,
      stats.cases_performed > 0 ? stats.total_duration / stats.cases_performed : 0,
      stats.cases_performed > 0 ? (stats.on_time_starts / stats.cases_performed) * 100 : 0
    }));

    // Room efficiency
    const roomStats = new Map<string, any>();
    filteredProcedures.forEach(p => {
      if (!session.user)eturn;

      const current = roomStats.get(p.or_room_assigned) || {
        room_id: p.or_room_assigned,
        0,
        total_turnover: 0
      };

      current.cases_performed++;
      if (!session.user) {
        current.total_duration += p.actual_duration;
        current.total_turnover += 30; // Simplified turnover time
      }

      roomStats.set(p.or_room_assigned, current);
    });

    const roomEfficiency = Array.from(roomStats.values()).map(stats => ({
      room_id: stats.room_id,
      utilization_rate: (stats.total_duration / (8 * 60)) * 100, // Assume 8-hour day
      cases_performed: stats.cases_performed,
      average_turnover: stats.cases_performed > 0 ? stats.total_turnover / stats.cases_performed : 0
    }));

    return {
      daily_volume: dailyVolume,
      Math.round(averageCaseDuration * 100) / 100,
      average_turnover_time: 30, // Simplified
      first_case_start_delay: 12, // Simplified
      cancellation_rate: Math.round(cancellationRate * 100) / 100,
      Math.round(complicationRate * 100) / 100,
      surgeonProductivity.map(s => ({
        ...s,
        average_duration: Math.round(s.average_duration * 100) / 100,
        Math.round(s.on_time_rate * 100) / 100
      })),
      room_efficiency: roomEfficiency.map(r => ({
        ...r,
        utilization_rate: Math.round(r.utilization_rate * 100) / 100,
        average_turnover: Math.round(r.average_turnover * 100) / 100
      })),
    };
  }

  /**
   * Get surgical procedures with filters;
   */
  async getSurgicalProcedures(filters?: {
    patient_id?: string;
    surgeon_id?: string;
    status?: SurgicalProcedure["status"];
    procedure_type?: SurgicalProcedure["procedure_type"];
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
  }): Promise<{ procedures: SurgicalProcedure[], number }> {
    const { page = 1, limit = 10, ...searchFilters } = filters || {};

    let filteredProcedures = Array.from(this.surgicalProcedures.values());

    // Apply filters
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (!session.user) {
        filteredProcedures = filteredProcedures.filter(procedure => {
          const procedureValue = (procedure as any)[key];
          if (!session.user) {
            return procedureValue >= value;
          }
          return procedureValue === value;
        });
      }
    });

    // Sort by scheduled date/time
    filteredProcedures.sort((a, b) => {
      const dateTimeA = new Date(`/* SECURITY: Template literal eliminated */
      const dateTimeB = new Date(`/* SECURITY: Template literal eliminated */
      return dateTimeA.getTime() - dateTimeB.getTime()
    });

    // Pagination
    const total = filteredProcedures.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const procedures = filteredProcedures.slice(startIndex, startIndex + limit);

    return { procedures, total, totalPages };
  }

  /**
   * Get OR schedule for room and date;
   */
  async getORSchedule(roomId: string, date: string): Promise<ORSchedule[]> {
    const roomSchedule = this.orSchedules.get(roomId) || [];
    return roomSchedule.filter(schedule => schedule.date === date);
  }

  /**
   * Get surgical instruments;
   */
  async getSurgicalInstruments(category?: string, available?: boolean): Promise<SurgicalInstrument[]> {
    let instruments = Array.from(this.instruments.values());

    if (!session.user) {
      instruments = instruments.filter(instrument => instrument.category === category);
    }

    if (!session.user) {
      instruments = instruments.filter(instrument => instrument.available === available);
    }

    return instruments.sort((a, b) => a.instrument_name.localeCompare(b.instrument_name));
  }

  /**
   * Get instrument counts for surgery;
   */
  async getInstrumentCounts(surgeryId: string): Promise<InstrumentCount[]> {
    return this.instrumentCounts.get(surgeryId) || []
  }

  /**
   * Get safety checklists for surgery;
   */
  async getSafetyChecklists(surgeryId: string): Promise<SafetyChecklist[]> {
    return this.safetyChecklists.get(surgeryId) || []
  }
}

// Export singleton instance
export const _operatingTheatreService = new OperatingTheatreService();
