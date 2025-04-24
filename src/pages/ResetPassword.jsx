import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { resetAPI } from "../services/userServices";
const ResetPassword = () => {
const [searchParams] = useSearchParams();
const navigate = useNavigate();

const token = searchParams.get("token");
const email = searchParams.get("email");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [message, setMessage] = useState("");
const { mutateAsync} = useMutation({
mutationFn: resetAPI,
mutationKey: ["Reset-Password"],
});
const handleReset = async (e) => { 
e.preventDefault();
if (password !== confirmPassword) {
setMessage("Passwords do not match");
return;
}
try {
await mutateAsync({
email: email,
token: token,
newPassword: password, // Correct key name
});
setMessage("Password reset successful!");
setTimeout(() => navigate("/login"), 2000);
} catch (error) {
setMessage(error.response?.data?.message || "Error resetting password");
}
};
return (
<div className="flex items-center justify-center h-screen bg-gray-100">
<form
onSubmit={handleReset}
className="bg-white shadow-md p-8 rounded-xl w-full max-w-md space-y-4"
>
<h2 className="text-2xl font-semibold text-center mb-4">Reset Password</h2>
<input
type="password"
placeholder="New Password"
className="w-full p-2 border rounded"
value={password}
onChange={(e) => setPassword(e.target.value)}
required
/>
<input
type="password"
placeholder="Confirm Password"
className="w-full p-2 border rounded"
value={confirmPassword}
onChange={(e) => setConfirmPassword(e.target.value)}
required
/>
<button
type="submit"
className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
>
Reset Password
</button>
{message && <p className="text-center text-red-500 mt-2">{message}</p>}
</form>
</div>
);
};
export default ResetPassword;
