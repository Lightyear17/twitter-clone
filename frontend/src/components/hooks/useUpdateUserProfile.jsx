import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const useUpdateUserProfile = () => {
	const navigate = useNavigate();

	const queryClient = useQueryClient();

	const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
		mutationFn: async (formData) => {
			try {
				console.log(formData);
				const res = await fetch(`/api/users/update`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						
					},
					body: JSON.stringify(formData),
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
		onSuccess: (data) => {
			toast.success("Profile updated successfully");
			
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
				queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
			]);
			if (data.userName) {
				navigate(`/profile/${data.userName}`);
			}
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;