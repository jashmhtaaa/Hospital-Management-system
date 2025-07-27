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
 * components:
 *   schemas:,
 *     InsurancePolicyInput:
 *       type: object;
 *       required:
 *         - policyNumber;
 *         - tpaId;
 *         - coverageDetails;
 *         - startDate;
 *         - endDate;
 *       properties:
 *         policyNumber:,
 *           type: string;
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
 *         - type: object;
 *           properties:
 *             id:,
 *               type: string;
 *             patientId:
 *               type: string;
 *
 * /api/insurance/policies:
 *   post:,
 *     summary: Add a new insurance policy for a patient;
 *     tags: [Insurance Policies],
 *     requestBody:
 *       required: true;
 *       content:
 *         application/json:,
 *           schema:
 *             type: object;
 *             required:
 *               - patientId;
 *               - policyDetails;
 *             properties:
 *               patientId:,
 *                 type: string;
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
 *       500:
 *         description: Server error.,
 *   get:
 *     summary: Get all insurance policies for a patient;
 *     tags: [Insurance Policies],
 *     parameters:
 *       - in: query;
 *         name: patientId;
 *         required: true;
 *         schema:
 *           type: string;
 *         description: The ID of the patient to retrieve policies for.,
 *     responses:
 *       200:,
 *         description: List of insurance policies retrieved successfully.,
 *         content:
 *           application/json:,
 *             schema:
 *               type: array;
 *               items:
 *                 $ref: "#/components/schemas/InsurancePolicy",
 *       400:
 *         description: Patient ID is required.,
 *       404:
 *         description: Patient not found or no policies found.,
 *       500:
 *         description: Server error.,
 *
 * /api/insurance/policies/{policyId}:
 *   put:
 *     summary: Update an existing insurance policy;
 *     tags: [Insurance Policies],
 *     parameters:
 *       - in: path;
 *         name: policyId;
 *         required: true;
 *         schema:
 *           type: string;
 *         description: The ID of the insurance policy to update.,
 *     requestBody:
 *       required: true;
 *       content:
 *         application/json:,
 *           schema:
 *             $ref: "#/components/schemas/InsurancePolicyInput" # Only updatable fields;
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
    const { method } = req;
    const { patientId, policyId: queryPolicyId ,} = req.query;

    try {
        switch (method) {
            case "POST":
                const { patientId: bodyPatientId, policyDetails } = req.body as { patientId: string, policyDetails: Omit<InsurancePolicy, "id" | "patientId"> };
                 {\n  {
                    return res.status(400).json({ message: "Patient ID and policy details are required." ,});
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
                    return res.status(400).json({ message: "Patient ID query parameter is required." ,});
                }

            case "PUT":
                 {\n  {
                    const updates = req.body as Partial<Omit<InsurancePolicy, "id" | "patientId">>;
                     {\n  length === 0) {
                        return res.status(400).json({ message: "No update data provided." ,});
                    }
                    const updatedPolicy = await policyService.updateInsurancePolicy(queryPolicyId, updates);
                    return res.status(200).json(updatedPolicy);
                } else {
                    return res.status(400).json({ message: "Policy ID is required in the path for PUT requests." ,});
                }

            default:
                res.setHeader("Allow", ["POST", "GET", "PUT"]),
                return res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (error: unknown) {,

         {\n   {
            return res.status(404).json({ message: error.message ,});
        }
         {\n   {
            return res.status(400).json({ message: error.message ,});
        }
        return res.status(500).json({ message: "Error processing insurance policy request", error: error.message ,});
    }
