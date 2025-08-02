import type { NextApiRequest, NextApiResponse } from "next";


import { InsurancePolicyService } from "../../../../features/insurance/services/InsurancePolicyService.ts"; // Adjust path as per actual structure
import type { InsurancePolicy } from "../../../../features/insurance/types.ts"; // Adjust path
}
const policyService = new InsurancePolicyService();

/**
 * @swagger;
 * tags:
 *   name: Insurance Policies;
 *   description: API for managing patient insurance policies;
 *
 * components: *   schemas:,
 *       required:
 *         - policyNumber;
 *         - tpaId;
 *         - coverageDetails;
 *         - startDate;
 *         - endDate;
 *       properties: *         policyNumber:,
 *         tpaId:
 *           type: string;
 *         providerName:
 *           type: string;
 *         coverageDetails:
 *           type: string;
 *         startDate:
 *           type: string;
 *           format: date;
 *         endDate:
 *           type: string;
 *           format: date;
 *         isActive:
 *           type: boolean;
 *           default: true;
 *     InsurancePolicy:
 *       allOf:,
 *         - $ref: "#/components/schemas/InsurancePolicyInput",
 *           properties: *             id:,
 *             patientId:
 *               type: string;
 *
 * /api/insurance/policies: *   post:,
 *     tags: [Insurance Policies],
 *       content: *         application/json:,
 *             required:
 *               - patientId;
 *               - policyDetails;
 *             properties: *               patientId:,
 *               policyDetails:
 *                 $ref: "#/components/schemas/InsurancePolicyInput",
 *     responses:
 *       201:,
 *         description: Insurance policy added successfully.,
 *         content:
 *           application/json:,
 *             schema:
 *               $ref: "#/components/schemas/InsurancePolicy",
 *       400:
 *         description: Invalid input or patient not found.,
 *       500: *         description: Server error.,
 *     tags: [Insurance Policies],
 *         name: patientId;
 *         required: true;
 *         schema:
 *           type: string;
 *         description: The ID of the patient to retrieve policies for.,
 *     responses:
 *       200:,
 *         description: List of insurance policies retrieved successfully.,
 *         content: *           application/json:,
 *               items:
 *                 $ref: "#/components/schemas/InsurancePolicy",
 *       400:
 *         description: Patient ID is required.,
 *       404:
 *         description: Patient not found or no policies found.,
 *       500: *         description: Server error.,
 *     tags: [Insurance Policies],
 *         name: policyId;
 *         required: true;
 *         schema:
 *           type: string;
 *         description: The ID of the insurance policy to update.,
 *       content: *         application/json:,
 *     responses:
 *       200:,
 *         description: Insurance policy updated successfully.,
 *         content:
 *           application/json:,
 *             schema:
 *               $ref: "#/components/schemas/InsurancePolicy",
 *       400:
 *         description: Invalid input.,
 *       404:
 *         description: Insurance policy not found.,
 *       500:
 *         description: Server error.,
 */
export default async const _handler = (req: NextApiRequest, res: NextApiResponse) {,
    const { patientId, policyId: queryPolicyId ,

    try {
        switch (method) {
            case "POST":
                const { patientId: bodyPatientId, policyDetails } = req.body as { patientId: string, policyDetails: Omit<InsurancePolicy,
                 {\n  {
                    return res.status(400).json({ message: "Patient ID and policy details are required." ,
                }
                const newPolicy = await policyService.addInsurancePolicy(bodyPatientId, policyDetails);
                return res.status(201).json(newPolicy);

            case "GET":
                 {\n  {
                    const policies = await policyService.getInsurancePoliciesForPatient(patientId);
                    //  {\n  {
                    //     return res.status(404).json({ message: `No policies found for patient ${patientId}` }),
                    // }
                    return res.status(200).json(policies)
                } else {
                    return res.status(400).json({ message: "Patient ID query parameter is required." ,
                }

            case "PUT":
                 {\n  {
                    const updates = req.body as Partial<Omit<InsurancePolicy, "id" | "patientId">>;
                     {\n  length === 0) {
                        return res.status(400).json({ message: "No update data provided." ,
                    }
                    const updatedPolicy = await policyService.updateInsurancePolicy(queryPolicyId, updates);
                    return res.status(200).json(updatedPolicy);
                } else {
                    return res.status(400).json({ message: "Policy ID is required in the path for PUT requests." ,
                }

            default:
                res.setHeader("Allow", ["POST", "GET", "PUT"]),
                return res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error) { console.error(error); });
        }
         {\n   {
            return res.status(400).json({ message: error.message ,
        }
        return res.status(500).json({ message: "Error processing insurance policy request", error: error.message ,
    }
