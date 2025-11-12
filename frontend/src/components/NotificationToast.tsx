import React from 'react';
import logoIcon from '../assets/images/logos/ba-brand-icon-colored.png';
import avatar from '../assets/images/logos/avatar.png';
import messageAvatarIcon from '../assets/images/pre/main.png';
import appNotificationIcon from '../assets/images/pre/nof.svg';

interface NotificationToastProps {
  type: 'message' | 'app';
  mainText: string;
  subText?: string;
  subText2?: string;
  sender?: string;
  isVisible: boolean;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  type,
  mainText,
  subText,
  subText2,
  sender,
  isVisible,
  onClose
}) => {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-slide-down"
      style={{ maxWidth: '350px' }}
    >
      <div 
        className="flex items-start space-x-3 p-3 rounded-xl shadow-lg"
        style={{ backgroundColor: '#F5FBFF', border: '1px solid #CFE8FC' }}
      >
        {/* Icon/Avatar */}
        <div className="relative flex-shrink-0">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center" 
            style={{ 
              backgroundColor: type === 'message' ? '#E3F2FD' : '#F9A825',
              border: '2px solid white'
            }}
          >
            {type === 'message' ? (
              <img src={avatar} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <img src={logoIcon} alt="Logo" className="w-6 h-6" style={{ filter: 'brightness(0) invert(1)' }} />
            )}
          </div>
          <div 
            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" 
            style={{ backgroundColor: '#FFF' }}
          >
            <img 
              src={type === 'message' ? messageAvatarIcon : appNotificationIcon} 
              alt="Badge" 
              className="w-3 h-3" 
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: '12px' }}>
            {sender ? (
              <>
                <span className="font-semibold" style={{ color: '#212121' }}>{sender}</span>
                <span style={{ color: '#616161' }}> {mainText}</span>
              </>
            ) : (
              <>
                <span className="font-semibold" style={{ color: '#212121' }}>{mainText}</span>
                {subText && <span style={{ color: '#616161' }}> {subText}</span>}
              </>
            )}
          </p>
          {subText2 && (
            <p className="mt-0.5" style={{ color: '#9E9E9E', fontSize: '10px' }}>
              {subText2}
            </p>
          )}
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#6A6A6A' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <style>
        {`
          @keyframes slide-down {
            from {
              transform: translate(-50%, -20px);
              opacity: 0;
            }
            to {
              transform: translate(-50%, 0);
              opacity: 1;
            }
          }
          .animate-slide-down {
            animation: slide-down 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default NotificationToast;

