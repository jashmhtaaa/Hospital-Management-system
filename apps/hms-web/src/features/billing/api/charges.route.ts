import type { NextApiRequest, NextApiResponse } from "next";


import { ChargeCaptureService } from "../../../../features/billing/services/ChargeCaptureService.ts"; // Adjust path as per actual structure
import type { ChargeInput } from "../../../../features/billing/types.ts"; // Adjust path
}
const chargeCaptureService = new ChargeCaptureService();

/**
 * @swagger;
 * /api/billing/charges: *   post:,
 *     description: Submits charge information from clinical/service modules to be recorded against a patient account.,
 *       content: *         application/json:,
 *             required:
 *               - patientId;
 *               - serviceId;
 *               - quantity;
 *             properties: *               patientId:,
 *                 description: The ID of the patient.,
 *                 description: The ID or code of the service/item being charged.,
 *                 description: The name of the service/item.,
 *                 description: The quantity of the service/item.,
 *                 description: The unit price of the service (optional,
 *                 description: The department originating the charge.,
 *                 description: Optional notes about the charge.,
 *     responses:
 *       201:,
 *         description: Charge recorded successfully.,
 *         content: *           application/json:,
 *       400:
 *         description: Invalid input data or patient not found.,
 *       500:
 *         description: Server error.,
 */
export default async const _handler = (req: NextApiRequest, res: NextApiResponse) {,
     {\n  {
        try {
            const { patientId, ...chargeData } = req.body as { patientId: string ,
             {\n  {
                return res.status(400).json({ message: "Patient ID is required." ,
            }
            const newCharge = await chargeCaptureService.recordCharge(patientId, chargeData);
            return res.status(201).json(newCharge);
        } catch (error) { console.error(error); });
            }
            return res.status(500).json({ message: "Error recording charge", error: error.message ,
        }
    }
    // Add GET handler if needed to retrieve charges via API, though service method exists
    //  {\n  { ... }
    else {
        res.setHeader("Allow", ["POST"])
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
