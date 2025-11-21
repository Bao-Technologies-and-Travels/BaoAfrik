import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    category: string;
    location: string;
    status: 'DRAFT' | 'PUBLISHED' | 'SOLD' | 'EXPIRED' | 'DELETED';
    images: any[];
    viewCount: number;
    likeCount: number;
    saveCount: number;
    createdAt: string;
    publishedAt?: string;
}

const ConfirmationDialog: React.FC<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}> = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete", cancelText = "Cancel" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Empty State Component
const EmptyState: React.FC<{
    activeTab: string;
    onCreateListing: () => void;
}> = ({ activeTab, onCreateListing }) => {
    const getEmptyStateContent = () => {
        switch (activeTab) {
            case 'drafts':
                return {
                    icon: '📝',
                    title: 'No Drafts Yet',
                    description: "You don't have any draft listings. Start creating your first product!",
                    buttonText: 'Create Listing'
                };
            case 'published':
                return {
                    icon: '🛍️',
                    title: 'No Published Listings',
                    description: "You haven't published any listings yet. Create and publish your first product!",
                    buttonText: 'Create Listing'
                };
            case 'sold':
                return {
                    icon: '💰',
                    title: 'No Sold Items',
                    description: "You haven't sold any items yet. Keep listing products to make sales!",
                    buttonText: 'Browse Listings'
                };
            default:
                return {
                    icon: '📦',
                    title: 'No Listings Yet',
                    description: "You haven't created any listings yet. Start selling your products today!",
                    buttonText: 'Create Your First Listing'
                };
        }
    };

    const content = getEmptyStateContent();

    return (
        <div className="text-center py-16 px-4">
            <div className="text-8xl mb-6 opacity-60">{content.icon}</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{content.title}</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-8 leading-relaxed">
                {content.description}
            </p>
            <button
                onClick={onCreateListing}
                className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors text-lg font-medium inline-flex items-center space-x-2"
            >
                <span>+</span>
                <span>{content.buttonText}</span>
            </button>

            {/* Additional helpful tips */}
            <div className="mt-12 max-w-md mx-auto">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Quick Tips
                </h4>
                <div className="grid gap-3 text-sm text-gray-600 text-left">
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">1</div>
                        <span>Take clear, well-lit photos of your product</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">2</div>
                        <span>Write detailed descriptions with key features</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">3</div>
                        <span>Set competitive prices based on market research</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MyListings: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'drafts' | 'published' | 'sold'>('all');
    const [stats, setStats] = useState({
        total: 0,
        drafts: 0,
        published: 0,
        sold: 0
    });

    const [confirmationDialog, setConfirmationDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        confirmText?: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        confirmText: 'Delete'
    });
    const { addToast } = useToast();

    useEffect(() => {
        fetchMyListings();
    }, [activeTab]);

    const fetchMyListings = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');

            let status = undefined;
            if (activeTab === 'drafts') status = 'DRAFT';
            if (activeTab === 'published') status = 'PUBLISHED';
            if (activeTab === 'sold') status = 'SOLD';

            const response = await fetch(`${process.env.REACT_APP_API_URL}/products/my-products?status=${status || ''}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch listings');
            }

            const result = await response.json();

            if (result.success) {
                setProducts(result.data.products);
                updateStats(result.data.products);
            }
        } catch (error) {
            throw new Error('Error fetching listings');
        } finally {
            setLoading(false);
        }
    };

    const updateStats = (products: Product[]) => {
        const stats = {
            total: products.length,
            drafts: products.filter(p => p.status === 'DRAFT').length,
            published: products.filter(p => p.status === 'PUBLISHED').length,
            sold: products.filter(p => p.status === 'SOLD').length
        };
        setStats(stats);
    };

    const handleCreateListing = () => {
        navigate('/create-listing');
    };

    const handleEditProduct = (productId: string) => {
        navigate(`/edit-listing/${productId}`);
    };

    const showDeleteConfirmation = (productId: string, productTitle: string) => {
        setConfirmationDialog({
            isOpen: true,
            title: 'Delete Listing',
            message: `Are you sure you want to delete "${productTitle}"? This action cannot be undone.`,
            onConfirm: () => {
                handleDeleteProduct(productId);
                closeConfirmationDialog()
            },
            confirmText: 'Delete'
        });
    };

    const handleDeleteProduct = async (productId: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Remove from local state
                setProducts(prev => prev.filter(p => p.id !== productId));
                // Close confirmation dialog
                setConfirmationDialog(prev => ({ ...prev, isOpen: false }));

                // Show success message
                addToast({
                    type: "success",
                    title: 'Action Completed',
                    message: "Listing deleted successfully",
                    duration: 2000
                });
            } else {
                throw new Error('Failed to delete listing');
            }
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Action Failed',
                message: "Failed to delete listing. Please try again",
                duration: 2000
            });
        }
    };

    const handlePublishProduct = async (productId: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'PUBLISHED' })
            });

            if (response.ok) {
                // Update local state
                setProducts(prev => prev.map(p =>
                    p.id === productId ? { ...p, status: 'PUBLISHED' } : p
                ));
                addToast({
                    type: "success",
                    title: 'Action Completed',
                    message: "Listing published successfully",
                    duration: 2000
                });
            } else {
                throw new Error('Failed to publish listing');
            }
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Action Failed',
                message: "Failed to publish listing",
                duration: 2000
            });
        }
    };

    const showPublishConfirmation = (productId: string, productTitle: string) => {
        setConfirmationDialog({
            isOpen: true,
            title: 'Publish Listing',
            message: `Are you sure you want to publish "${productTitle}"? Once published, it will be visible to all users.`,
            onConfirm: () => {
                handlePublishProduct(productId);
                closeConfirmationDialog()
            },
            confirmText: 'Publish'
        });
    };

    const closeConfirmationDialog = () => {
        setConfirmationDialog(prev => ({ ...prev, isOpen: false }));
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            DRAFT: { color: 'bg-yellow-100 text-yellow-800', label: 'Draft' },
            PUBLISHED: { color: 'bg-green-100 text-green-800', label: 'Published' },
            SOLD: { color: 'bg-blue-100 text-blue-800', label: 'Sold' },
            EXPIRED: { color: 'bg-red-100 text-red-800', label: 'Expired' }
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.label}
            </span>
        );
    };

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your listings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={confirmationDialog.isOpen}
                title={confirmationDialog.title}
                message={confirmationDialog.message}
                onConfirm={confirmationDialog.onConfirm}
                onCancel={() => { closeConfirmationDialog() }}
                confirmText={confirmationDialog.confirmText}
            />

            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
                            <p className="text-gray-600">Manage your products and track performance</p>
                        </div>
                        <button
                            onClick={handleCreateListing}
                            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
                        >
                            <span>+</span>
                            <span>Create New Listing</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats - Only show if there are listings */}
            {products.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-gray-600">Total Listings</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-yellow-600">{stats.drafts}</div>
                            <div className="text-gray-600">Drafts</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
                            <div className="text-gray-600">Published</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-blue-600">{stats.sold}</div>
                            <div className="text-gray-600">Sold</div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-lg shadow-sm border mb-6">
                        <div className="border-b">
                            <nav className="flex -mb-px">
                                {[
                                    { key: 'all', label: 'All Listings', count: stats.total },
                                    { key: 'drafts', label: 'Drafts', count: stats.drafts },
                                    { key: 'published', label: 'Published', count: stats.published },
                                    { key: 'sold', label: 'Sold', count: stats.sold }
                                ].map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key as any)}
                                        className={`flex items-center px-6 py-3 border-b-2 font-medium text-sm ${activeTab === tab.key
                                            ? 'border-orange-500 text-orange-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        {tab.label}
                                        <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${activeTab === tab.key
                                            ? 'bg-orange-100 text-orange-600'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Products List */}
                        <div className="p-6">
                            <div className="grid gap-6">
                                {products.map(product => (
                                    <div key={product.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-400 text-2xl">📷</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-900 truncate">
                                                        {product.title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                                        {product.description}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2 ml-4">
                                                    {getStatusBadge(product.status)}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center space-x-6 text-sm text-gray-600">
                                                    <div className="font-medium text-gray-900">
                                                        {formatPrice(product.price, product.currency)}
                                                    </div>
                                                    <div>{product.location}</div>
                                                    <div>{product.viewCount} views</div>
                                                    <div>{product.likeCount} likes</div>
                                                    <div>
                                                        Created: {new Date(product.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    {product.status === 'DRAFT' && (
                                                        <button
                                                            onClick={() => showPublishConfirmation(product.id, product.title)}
                                                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                                                        >
                                                            Publish
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleEditProduct(product.id)}
                                                        className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => showDeleteConfirmation(product.id, product.title)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State - Show when no listings */}
            {products.length === 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white rounded-lg shadow-sm border">
                        <EmptyState
                            activeTab={activeTab}
                            onCreateListing={handleCreateListing}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyListings;