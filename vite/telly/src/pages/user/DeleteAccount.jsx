import React, { useContext, useState } from 'react';
import { LucideStore, LucideLogOut, LucideEye, LucideEyeOff } from 'lucide-react';
import { Modal } from './index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '../../utils/useAxios';
import AuthContext from '../../context/AuthContext';

const DeleteAccount = () => {
    const { logoutUser } = useContext(AuthContext);
    const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const queryClient = useQueryClient();
    const api = useAxios();

    const deleteAccountMutation = useMutation({
        mutationFn: async (password) => {
            const response = await api.post('/api/profile/delete_account/', { password });
            return response.data;
        },
        onSuccess: () => {
            queryClient.removeQueries(['user']);
            logoutUser();
            toggleDeleteAccountModal();
        },
        onError: (error) => {
            console.error("Error deleting account:", error.response?.data || error.message);
            alert("Failed to delete account. Please check your password.");
        },
    });

    const toggleDeleteAccountModal = () => {
        setDeleteAccountModalOpen((prev) => !prev);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleDeleteAccount = () => {
        deleteAccountMutation.mutate(password);
    };

    return (
        <main className="relative top-[105px]">
            <div className="w-full py-16 flex flex-col gap-6 items-center px-4">
                <p className="text-center font-medium text-red-800 bg-red-100 p-4 rounded-lg shadow">
                    Warning: Deleting your account is irreversible. All your data will be permanently deleted.
                </p>
                <button
                    className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-full shadow hover:bg-blue-600 transition"
                    onClick={() => alert("Feature coming soon!")}
                >
                    Take a Break
                </button>
            </div>

            <div className="mt-9 pt-5 grid grid-cols-2 divide-x divide-gray-300 bg-gray-50 rounded-lg shadow">
                <button
                    className="flex items-center justify-center gap-x-2.5 p-4 font-semibold text-gray-900 hover:bg-blue-500 hover:text-white transition"
                >
                    <LucideStore size={20} />
                    Home
                </button>
                <button
                    onClick={toggleDeleteAccountModal}
                    className="flex items-center justify-center gap-x-2.5 p-4 font-semibold text-red-600 hover:bg-red-500 hover:text-white transition"
                >
                    <LucideLogOut size={20} />
                    Delete Account
                </button>
            </div>

            {/* Delete Account Modal */}
            <Modal open={deleteAccountModalOpen} onClose={toggleDeleteAccountModal}>
                <div className="text-center w-full max-w-sm mx-auto">
                    <LucideLogOut size={56} className="mx-auto text-red-600" />
                    <h3 className="text-lg font-bold text-gray-900 mt-4">Confirm Account Deletion</h3>
                    <p className="text-sm text-gray-600 mt-2">
                        Please enter your password to confirm account deletion.
                    </p>

                    <div className="relative mt-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            className="absolute inset-y-0 right-3 flex items-center"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <LucideEyeOff size={20} className="text-gray-500" />
                            ) : (
                                <LucideEye size={20} className="text-gray-500" />
                            )}
                        </button>
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={handleDeleteAccount}
                            disabled={deleteAccountMutation.isLoading}
                            className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-500 disabled:opacity-50 transition"
                        >
                            {deleteAccountMutation.isLoading ? "Deleting..." : "Delete"}
                        </button>
                        <button
                            onClick={toggleDeleteAccountModal}
                            className="w-full px-4 py-2 bg-gray-100 text-gray-600 font-semibold rounded-lg shadow hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </main>
    );
};

export default DeleteAccount;
