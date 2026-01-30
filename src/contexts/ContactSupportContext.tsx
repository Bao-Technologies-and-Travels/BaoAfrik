import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ContactSupportContextType {
  isOpen: boolean;
  openContactSupport: () => void;
  closeContactSupport: () => void;
}

const ContactSupportContext = createContext<ContactSupportContextType | undefined>(undefined);

export const ContactSupportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openContactSupport = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeContactSupport = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ContactSupportContext.Provider value={{ isOpen, openContactSupport, closeContactSupport }}>
      {children}
    </ContactSupportContext.Provider>
  );
};

export const useContactSupport = (): ContactSupportContextType => {
  const context = useContext(ContactSupportContext);
  if (context === undefined) {
    throw new Error('useContactSupport must be used within a ContactSupportProvider');
  }
  return context;
};
