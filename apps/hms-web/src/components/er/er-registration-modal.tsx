import type React from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
interface ERRegistrationModalProps {
	\1,\2 () => void;
	onSubmit: (data: unknown) => void;
}

/**
 * Emergency Room patient registration modal component;
 */
export const _ERRegistrationModal = ({ isOpen, onClose, onSubmit }: ERRegistrationModalProps) => {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// In a real implementation, we would collect form data here
		onSubmit({});
	};

	return (
		<Dialog>
			\1>
				<DialogHeader>
					<DialogTitle>Emergency Patient Registration</DialogTitle>
				</DialogHeader>
				\1>
					\1>
						\1>
							\1><Label htmlFor="firstName">First Name\1>
								<Input id="firstName" placeholder="First name" required />
							</div>
							\1><Label htmlFor="lastName">Last Name\1>
								<Input id="lastName" placeholder="Last name" required />
							</div>
						</div>
						\1>
							\1><Label htmlFor="dob">Date of Birth\1>
								<Input id="dob" type="date" required />
							</div>
							\1><Label htmlFor="gender">Gender\1>
								<Select>
									id="gender" options=
									{[
										{ value: "male", label: "Male" },
										{ value: "female", label: "Female" },
										{ value: "other", label: "Other" },
};
