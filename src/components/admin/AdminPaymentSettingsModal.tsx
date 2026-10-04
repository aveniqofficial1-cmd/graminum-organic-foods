import React, { useState } from 'react';
import {
  Lock,
  QrCode,
  MessageCircle,
  ShieldCheck,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Sparkles,
  Phone,
  Store,
  FileCheck,
} from 'lucide-react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface AdminPaymentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPaymentSettingsModal: React.FC<AdminPaymentSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isAdmin } = useAuth();
  const {
    settings,
    updateStoreSettings,
    verifyAdminPassword,
    changeAdminPassword,
    getEffectiveQrUrl,
  } = useStoreSettings();
  const { showToast } = useToast();

  // Authentication Gate State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Settings Form State
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [upiId, setUpiId] = useState(settings.upiId);
  const [merchantName, setMerchantName] = useState(settings.merchantName);
  const [customQrCodeUrl, setCustomQrCodeUrl] = useState(settings.customQrCodeUrl || '');
  const [instructions, setInstructions] = useState(
    settings.instructions ||
      'Scan QR code with any UPI app (GPay, PhonePe, Paytm), complete payment, and share screenshot on WhatsApp.'
  );

  // Change Admin Password tab state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen || !isAdmin) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPassword(enteredPassword)) {
      setIsUnlocked(true);
      setPasswordError('');
      showToast('Payment Scanner & WhatsApp configuration unlocked.', 'success');
    } else {
      setPasswordError('Invalid admin security password. (Default demo: admin123)');
    }
  };

  const handleCustomQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showToast('QR Code image must be under 3MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomQrCodeUrl(reader.result as string);
        showToast('Custom QR scanner image uploaded!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    if (!whatsappNumber.trim()) {
      showToast('WhatsApp number is required.', 'error');
      return;
    }
    if (!upiId.trim() || !upiId.includes('@')) {
      showToast('Please enter a valid UPI ID (e.g. graminum@icici).', 'error');
      return;
    }
    if (!merchantName.trim()) {
      showToast('Merchant name is required.', 'error');
      return;
    }

    updateStoreSettings({
      whatsappNumber: whatsappNumber.trim(),
      upiId: upiId.trim(),
      merchantName: merchantName.trim(),
      customQrCodeUrl: customQrCodeUrl.trim() || undefined,
      instructions: instructions.trim(),
    });

    onClose();
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    const success = changeAdminPassword(oldPassword, newPassword);
    if (success) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false);
    }
  };

  const handleClose = () => {
    // Reset security unlock on close
    setIsUnlocked(false);
    setEnteredPassword('');
    setPasswordError('');
    setShowChangePassword(false);
    onClose();
  };

  const previewQrUrl =
    customQrCodeUrl && customQrCodeUrl.trim().length > 0
      ? customQrCodeUrl
      : `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          `upi://pay?pa=${encodeURIComponent(upiId || 'graminum@icici')}&pn=${encodeURIComponent(
            merchantName || 'Graminum Organic'
          )}&cu=INR`
        )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={handleClose}></div>

      <div className="relative bg-white rounded-3xl max-w-2xl w-full z-10 shadow-2xl overflow-hidden my-6 border border-[#E1E9DC]">
        {/* Modal Top Header */}
        <div className="bg-[#075B2A] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif-title">
                Payment Scanner & WhatsApp Settings
              </h2>
              <p className="text-[11px] text-[#8CCB55]">
                Configure store UPI ID, custom QR scanner, and WhatsApp receipt destination
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: PASSWORD AUTHENTICATION GATE */}
        {!isUnlocked ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2 max-w-md mx-auto">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border-2 border-amber-300">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#18251B] font-serif-title">
                Security Password Required
              </h3>
              <p className="text-xs text-[#667267] leading-relaxed">
                To protect store payment routing and WhatsApp numbers from unauthorized tampering, enter the admin security password.
              </p>
            </div>

            <form onSubmit={handleUnlock} className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#18251B] mb-1.5">
                  Admin Security Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={enteredPassword}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                    placeholder="Enter security password..."
                    className="w-full bg-[#FBF8EF] text-xs sm:text-sm px-4 py-3 rounded-2xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{passwordError}</span>
                  </p>
                )}
                <p className="text-[10px] text-gray-400 mt-1">
                  Default Demo Password: <span className="font-mono font-bold text-gray-600">admin123</span>
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#075B2A] hover:bg-[#06451F] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Unlock Settings
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* STEP 2: UNLOCKED SETTINGS CONFIGURATION FORM */
          <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Top Unlocked Alert */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300 flex items-center justify-between text-xs text-emerald-900">
              <span className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Security Access Verified • Session Active</span>
              </span>
              <button
                type="button"
                onClick={() => setIsUnlocked(false)}
                className="text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer"
              >
                Lock Tab
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5">
              {/* WhatsApp Configuration */}
              <div className="p-4 bg-[#FBF8EF] rounded-2xl border border-[#E1E9DC] space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#075B2A] uppercase tracking-wider">
                  <MessageCircle className="w-4 h-4" />
                  <span>1. WhatsApp Store Number</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18251B] mb-1">
                    WhatsApp Mobile Number (with Country Code)
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    All customer checkout receipts, item breakdowns, and order approvals will be sent directly to this WhatsApp number.
                  </p>
                </div>
              </div>

              {/* UPI & Merchant Details */}
              <div className="p-4 bg-[#FBF8EF] rounded-2xl border border-[#E1E9DC] space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#075B2A] uppercase tracking-wider">
                  <QrCode className="w-4 h-4" />
                  <span>2. UPI Payment Coordinates</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#18251B] mb-1">
                      Store UPI ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. graminum@icici"
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18251B] mb-1">
                      Merchant Display Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                      placeholder="e.g. Graminum Organic Foods"
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                    />
                  </div>
                </div>

                {/* Custom QR Upload vs Dynamic Generator */}
                <div className="pt-2 border-t border-gray-200/70 space-y-3">
                  <label className="block text-xs font-bold text-[#18251B]">
                    Upload Custom Bank QR Code Image (Optional):
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomQrUpload}
                      className="w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#075B2A] file:text-white cursor-pointer"
                    />
                    {customQrCodeUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomQrCodeUrl('');
                          showToast('Switched back to auto-generated dynamic UPI QR code.', 'info');
                        }}
                        className="text-xs text-red-600 font-bold hover:underline shrink-0 cursor-pointer"
                      >
                        Remove Custom Image
                      </button>
                    )}
                  </div>

                  {/* QR Preview Box */}
                  <div className="p-3 bg-white rounded-xl border border-[#E1E9DC] flex items-center gap-4">
                    <img
                      src={previewQrUrl}
                      alt="QR Scanner Preview"
                      className="w-20 h-20 object-contain rounded-lg border bg-[#FBF8EF]"
                    />
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-[#18251B]">Live Scanner Preview</p>
                      <p className="text-[11px] text-gray-500 font-mono">
                        {customQrCodeUrl ? 'Custom Merchant QR File' : `UPI: ${upiId || 'graminum@icici'}`}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-bold">
                        {customQrCodeUrl ? '✓ Custom QR Active' : '✓ Dynamic QR (Calculates exact total amount)'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions displayed to customer */}
              <div>
                <label className="block text-xs font-bold text-[#18251B] mb-1">
                  Payment Instructions for Customers:
                </label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-[#FBF8EF] text-xs p-3 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                ></textarea>
              </div>

              {/* Toggle Change Security Password Section */}
              <div className="pt-2 border-t border-[#E1E9DC]">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="text-xs font-bold text-[#075B2A] hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{showChangePassword ? 'Hide Password Change' : 'Change Admin Security Password'}</span>
                </button>

                {showChangePassword && (
                  <div className="mt-3 p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3 text-xs">
                    <h4 className="font-bold text-amber-900">Update Security Password</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="password"
                        placeholder="Current Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="bg-white text-xs px-3 py-2 rounded-xl border border-amber-300"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-white text-xs px-3 py-2 rounded-xl border border-amber-300"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-white text-xs px-3 py-2 rounded-xl border border-amber-300"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleChangePasswordSubmit}
                      className="bg-[#075B2A] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#06451F] cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                )}
              </div>

              {/* Save & Cancel Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E1E9DC]">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#075B2A] hover:bg-[#06451F] text-white text-xs sm:text-sm font-bold px-7 py-3 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Save & Apply Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
