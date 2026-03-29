import Link from "next/link";
import { User } from "./header.types";
import { DASHBOARD_URL } from "./header.constants";

interface Props {
  user: User;
  isListerMode: boolean;
  onClose: () => void;
  onLogout: () => void;
  onSwitchToLister: () => void;
}

export const AuthMenu = ({ user, isListerMode, onClose, onLogout, onSwitchToLister }: Props) => (
  <>
    <div className="px-4 py-3 bg-brand-50 border-b border-brand-100">
      <p className="font-bold text-brand-dark">{user.name}</p>
      <p className="text-sm text-brand-600">{user.email}</p>
    </div>
    <div className="py-2">
      <Link
        href={`${DASHBOARD_URL}/listings/saved`}
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
      >
        <i className="ph ph-heart text-xl text-brand-500"></i>
        <span className="font-medium text-brand-700">Saved Listings</span>
      </Link>
      <Link
        href={`${DASHBOARD_URL}/messages`}
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
      >
        <i className="ph ph-chat-circle text-xl text-brand-500"></i>
        <span className="font-medium text-brand-700">Messages</span>
      </Link>
      <Link
        href={`${DASHBOARD_URL}/profile`}
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
      >
        <i className="ph ph-user-circle text-xl text-brand-500"></i>
        <span className="font-medium text-brand-700">Profile</span>
      </Link>
      <div className="border-t border-brand-100 my-2"></div>
      <p className="px-4 py-2 text-xs text-brand-600 font-medium uppercase">Hosting</p>
      <Link
        href={`${DASHBOARD_URL}/listings/create`}
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
      >
        <i className="ph ph-plus-circle text-xl text-brand-500"></i>
        <span className="font-medium text-brand-700">Create Listing</span>
      </Link>
      <Link
        href={`${DASHBOARD_URL}/hosting`}
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
      >
        <i className="ph ph-building text-xl text-brand-500"></i>
        <span className="font-medium text-brand-700">Host Dashboard</span>
      </Link>
      {!isListerMode && (
        <button onClick={onSwitchToLister}
          className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-brand-50">
          <i className="ph ph-arrows-left-right text-xl text-brand-500" />
          <span className="font-medium text-brand-700">Switch to Lister</span>
        </button>
      )}
      <div className="border-t border-brand-100 my-2"></div>
      <button onClick={onLogout}
        className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-red-50">
        <i className="ph ph-sign-out text-xl text-red-500" />
        <span className="font-medium text-red-600">Log out</span>
      </button>
    </div>
  </>
);