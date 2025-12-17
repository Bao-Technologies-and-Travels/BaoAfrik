import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../services';
import { format } from 'date-fns';
import {
    ListBulletIcon as ListIcon,
    Squares2X2Icon as GridIcon,
    PencilIcon as EditIcon,
    TrashIcon as DeleteIcon,
    PlusIcon
} from '@heroicons/react/24/outline/index.js';

interface ProductRequest {
    id: string;
    productName: string;
    description: string;
    origin: string;
    sellerLocation: string;
    minPrice: number | null;
    maxPrice: number | null;
    currency: string;
    status: 'PENDING' | 'FULFILLED' | 'CANCELLED' | string;
    createdAt: string;
    userId: string;
    updatedAt: string;
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        profileImage?: string;
    };
}

const styles = {
    container: "min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8",
    header: "max-w-7xl mx-auto mb-8",
    headerContent: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
    title: "text-2xl font-bold text-gray-900",
    newButton: "inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
    viewToggle: "flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200",
    viewButton: (active: boolean) =>
        `p-2 rounded-md ${active ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`,
};

const MyRequests: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<ProductRequest[]>([]);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    // fetch requests
    useEffect(() => {
        fetchMyRequests();
    }, []);

    const fetchMyRequests = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get<any>('/request');
            setRequests(response.data || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setRequestToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!requestToDelete) return;

        try {
            await apiClient.delete(`/request/${requestToDelete}`);
            setRequests(requests.filter(req => req.id !== requestToDelete));
            setShowDeleteModal(false);
            setRequestToDelete(null);
        } catch (error) {
            console.error('Error deleting request:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMM dd, yyyy');
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'FULFILLED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // View toggle component
    const ViewToggle = () => (
        <div className="flex items-center space-x-2 mb-4">
            <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
                <ListIcon />
            </button>
            <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
                <GridIcon />
            </button>
        </div>
    );

    const formatPrice = (min: number | null, max: number | null, currency: string) => {
        if (min === null && max === null) return 'Price not specified';
        if (min === max) return `${currency} ${min}`;
        return `${currency} ${min} - ${max}`;
    };

    // List View Component
    const ListView = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b">Creation Date</th>
                        <th className="py-2 px-4 border-b">Product Name</th>
                        <th className="py-2 px-4 border-b">Location</th>
                        <th className="py-2 px-4 border-b">Origin</th>
                        <th className="py-2 px-4 border-b">Price Range</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr
                            key={request.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => setSelectedRequest(request)}
                        >
                            <td className="py-2 px-4 border-b">{formatDate(request.createdAt)}</td>
                            <td className="py-2 px-4 border-b">{request.productName}</td>
                            <td className="py-2 px-4 border-b">{request.sellerLocation}</td>
                            <td className="py-2 px-4 border-b">{request.origin}</td>
                            <td className="py-2 px-4 border-b">
                                {request.currency} {request.minPrice} - {request.maxPrice}
                            </td>
                            <td className="py-2 px-4 border-b">
                                <span className={`px-2 py-1 rounded-full text-xs ${request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    request.status === 'FULFILLED' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {request.status}
                                </span>
                            </td>
                            <td className="py-2 px-4 border-b">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle edit
                                        }}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        <EditIcon />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(request.id);
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Grid View Component
    const GridView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
                <div
                    key={request.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedRequest(request)}
                >
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold mb-2">{request.productName}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                                }`}>
                                {request.status}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{request.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                            <div>
                                <p className="font-medium">Location:</p>
                                <p>{request.sellerLocation}</p>
                            </div>
                            <div>
                                <p className="font-medium">Origin:</p>
                                <p>{request.origin}</p>
                            </div>
                            <div>
                                <p className="font-medium">Price Range:</p>
                                <p>{request.currency} {request.minPrice} - {request.maxPrice}</p>
                            </div>
                            <div>
                                <p className="font-medium">Created:</p>
                                <p>{formatDate(request.createdAt)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                // Handle edit
                            }}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            <EditIcon />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(request.id);
                            }}
                            className="text-red-500 hover:text-red-700"
                        >
                            <DeleteIcon />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    // Request Details Modal
    const RequestDetailsModal = () => {
        if (!selectedRequest) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold">{selectedRequest.productName}</h2>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold">Description</h3>
                                <p className="text-gray-700">{selectedRequest.description}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold">Location</h3>
                                    <p>{selectedRequest.sellerLocation}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Origin</h3>
                                    <p>{selectedRequest.origin}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Price Range</h3>
                                    <p>{selectedRequest.currency} {selectedRequest.minPrice} - {selectedRequest.maxPrice}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Status</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs ${selectedRequest.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                        }`}>
                                        {selectedRequest.status}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Created</h3>
                                    <p>{formatDate(selectedRequest.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    // Handle edit
                                    setSelectedRequest(null);
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Edit Request
                            </button>
                            <button
                                onClick={() => {
                                    handleDeleteClick(selectedRequest.id);
                                    setSelectedRequest(null);
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete Request
                            </button>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Delete Confirmation Modal
    const DeleteConfirmationModal = () => {
        if (!showDeleteModal) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4">Delete Request</h3>
                    <p className="mb-6">Are you sure you want to delete this request? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => {
                                setShowDeleteModal(false);
                                setRequestToDelete(null);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                confirmDelete();
                                setShowDeleteModal(false);
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Pagination Component
    const Pagination = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        return (
            <div className="flex justify-center mt-6">
                <nav className="inline-flex rounded-md shadow">
                    <button
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={`px-3 py-2 border-t border-b border-gray-300 text-sm font-medium ${currentPage === number
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {number}
                        </button>
                    ))}
                    <button
                        onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </nav>
            </div>
        );
    };

    if (loading && requests.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>My Requests</h1>
                    <button
                        onClick={() => navigate('/create-request')}
                        className={styles.newButton}
                    >
                        <PlusIcon className="h-4 w-4" />
                        New Request
                    </button>
                </div>
                {/* View Toggle */}
                <div className="mt-4 flex justify-between items-center">
                    <div className={styles.viewToggle}>
                        <button
                            onClick={() => setViewMode('list')}
                            className={styles.viewButton(viewMode === 'list')}
                            aria-label="List view"
                        >
                            <ListIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={styles.viewButton(viewMode === 'grid')}
                            aria-label="Grid view"
                        >
                            <GridIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto">
                {loading && requests.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <h3 className="text-lg font-medium text-gray-900">No requests found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new request.</p>
                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/create-request')}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <PlusIcon className="h-4 w-4" />
                                New Request
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {viewMode === 'list' ? <ListView /> : <GridView />}
                        <Pagination />
                    </>
                )}
            </div>
            <RequestDetailsModal />
            <DeleteConfirmationModal />
        </div>
    );
};

export default MyRequests;