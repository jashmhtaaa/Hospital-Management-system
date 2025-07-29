"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./encryption_service_secure");
require("crypto");
const module_1 = require();
(0, module_1.describe)("Integration Tests", () => {
    test("should work with realistic healthcare data", async () => {
        const service = new module_1.SecureEncryptionService();
        const patientData = { patient_id: "P123456",
            first_name: "John", last_name: "Doe",
            ssn: "123-45-6789", dob: "1980-01-01",
            phone: "+1-555-123-4567", email: "john.doe@email.com",
            address: "123 Main St, Anytown, ST 12345",
            insurance_id: "INS987654321",
            emergency_contact: "Jane Doe, +1-555-987-6543",
            medical_history: [],
            "Hypertension diagnosed 2020": ,
            "Diabetes Type 2 diagnosed 2019": ,
            "Allergic to penicillin":  };
        current_medications: [];
        "Metformin 500mg twice daily",
            "Lisinopril 10mg once daily";
        "95 mg/dL",
            a1c;
        "6.8%", blood_pressure;
        "125/80 mmHg";
    });
    const piiFields = [];
    "ssn", "dob", "phone", "email", "address", "insurance_id",
        "emergency_contact", "medical_history", "current_medications", "lab_results";
    ;
    const encrypted = await service.encryptObject(patientData, piiFields);
    const decrypted = await service.decryptObject(encrypted, piiFields), expect;
    (decrypted).toEqual(patientData);
    service.destroy();
});
;
