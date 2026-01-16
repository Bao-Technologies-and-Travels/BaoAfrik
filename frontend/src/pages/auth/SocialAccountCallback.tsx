import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { socialAccountService } from '../../services/socialAccountService';
import { useToast } from '../../contexts/ToastContext';

const SocialAccountCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const provider = searchParams.get('provider');
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      const success = searchParams.get('success');

      console.log('[OAuth Callback] Received callback:', {
        provider,
        hasCode: !!code,
        hasState: !!state,
        error,
        errorDescription,
        success
      });

      // Handle OAuth errors
      if (error) {
        console.error('[OAuth Callback] OAuth error:', error, errorDescription);
        const errorMsg = errorDescription || error || 'OAuth authorization was denied or failed';
        addToast({
          type: 'error',
          title: 'Connection Failed',
          message: decodeURIComponent(errorMsg),
          duration: 5000
        });

        if (window.opener) {
          window.opener.postMessage({
            type: 'SOCIAL_ACCOUNT_ERROR',
            provider: provider,
            error: errorMsg
          }, window.location.origin);
          window.close();
        } else {
          navigate('/settings', { state: { selectedSidebarOption: 'security' } });
        }
        return;
      }

      // Handle success case (backend already connected the account)
      if (success === 'true' && provider) {
        // Refresh status to update UI
        try {
          // Wait a moment for database to be updated
          await new Promise(resolve => setTimeout(resolve, 500));

          const status = await socialAccountService.getStatus();
          const wasConnected = status.status[provider];

          if (wasConnected) {
            // Notify parent window if opened in popup
            if (window.opener) {
              window.opener.postMessage({
                type: 'SOCIAL_ACCOUNT_CONNECTED',
                provider: provider
              }, window.location.origin);
              window.close();
            } else {
              // If no opener, redirect to settings
              navigate('/settings', { state: { selectedSidebarOption: 'security' } });
              addToast({
                type: 'success',
                title: 'Connected',
                message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} account connected successfully`,
                duration: 3000
              });
            }
          } else {
            throw new Error('Account connection verification failed');
          }
        } catch (error: any) {
          addToast({
            type: 'error',
            title: 'Error',
            message: error.message || 'Failed to verify connection',
            duration: 3000
          });

          if (window.opener) {
            window.close();
          } else {
            navigate('/settings', { state: { selectedSidebarOption: 'security' } });
          }
        }
        return;
      }

      // If we have code but no success, the backend callback should have handled it
      // This shouldn't happen in normal flow, but handle it gracefully
      if (!provider || (!code && !success)) {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Invalid OAuth callback parameters',
          duration: 3000
        });

        if (window.opener) {
          window.close();
        } else {
          navigate('/settings', { state: { selectedSidebarOption: 'security' } });
        }
        return;
      }

      // Fallback: If we have code, wait and check status
      try {
        // Wait for backend to process
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Check if account was connected by fetching status
        const status = await socialAccountService.getStatus();
        const wasConnected = status.status[provider || ''];

        if (wasConnected && provider) {
          // Notify parent window if opened in popup
          if (window.opener) {
            window.opener.postMessage({
              type: 'SOCIAL_ACCOUNT_CONNECTED',
              provider: provider
            }, window.location.origin);
            window.close();
          } else {
            // If no opener, redirect to settings
            navigate('/settings', { state: { selectedSidebarOption: 'security' } });
            addToast({
              type: 'success',
              title: 'Connected',
              message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} account connected successfully`,
              duration: 3000
            });
          }
        } else {
          throw new Error('Account connection was not completed');
        }
      } catch (error: any) {
        addToast({
          type: 'error',
          title: 'Error',
          message: error.message || 'Failed to complete OAuth connection',
          duration: 3000
        });

        if (window.opener) {
          window.close();
        } else {
          navigate('/settings', { state: { selectedSidebarOption: 'security' } });
        }
      }
    };

    handleCallback();
  }, [searchParams, navigate, addToast]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing connection...</p>
      </div>
    </div>
  );
};

export default SocialAccountCallback;
