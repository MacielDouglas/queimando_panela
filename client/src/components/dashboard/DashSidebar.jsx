import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  PiUserPlusDuotone,
  PiUsersDuotone,
  PiUserDuotone,
  PiBookBookmarkDuotone,
  PiBookOpenTextDuotone,
  PiChatCenteredTextDuotone,
  PiDoorDuotone,
} from "react-icons/pi";
import { resetAuth } from "../../features/auth/authSlice";

const SidebarLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex justify-between items-center p-2 rounded-lg hover:bg-stone-50"
  >
    <p className="text-xl flex items-center gap-4">
      {icon} {label}
    </p>
  </Link>
);

SidebarLink.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
};

const SidebarProfileLink = ({ user }) => (
  <Link
    to="/dashboard?tab=profile"
    className="flex justify-between items-center p-2 rounded-md hover:bg-stone-50"
  >
    <p className="text-xl flex items-center gap-4">
      {user.isAdmin ? <PiUserPlusDuotone /> : <PiUserDuotone />} Perfil
    </p>
    <p className="px-3 py-1 text-xs bg-gradient-to-t from-stone-800 to-stone-700 rounded-md text-stone-100">
      {user.isAdmin ? "admin" : "usuário"}
    </p>
  </Link>
);

SidebarProfileLink.propTypes = {
  user: PropTypes.shape({
    isAdmin: PropTypes.bool.isRequired,
  }).isRequired,
};

const SidebarAdminLink = ({ user }) =>
  user.isAdmin && (
    <SidebarLink
      to="/dashboard?tab=users"
      icon={<PiUsersDuotone />}
      label="Usuários"
    />
  );

SidebarAdminLink.propTypes = {
  user: PropTypes.shape({
    isAdmin: PropTypes.bool.isRequired,
  }).isRequired,
};

const SidebarLogout = ({ onLogout }) => (
  <p
    onClick={onLogout}
    className="text-xl p-2 rounded-lg hover:bg-red-50 flex items-center gap-4 cursor-pointer hover:text-red-800"
  >
    <PiDoorDuotone /> Sair
  </p>
);

SidebarLogout.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default function DashSidebar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(resetAuth());
  };

  return (
    <div className="w-full md:w-56 bg-stone-400 h-full flex flex-col gap-2 p-3 font-noto">
      <SidebarProfileLink user={user} />
      <hr />
      <SidebarLink
        to="/dashboard?tab=recipes"
        icon={<PiBookBookmarkDuotone />}
        label="Receitas"
      />
      <hr />
      <SidebarLink
        to="/dashboard?tab=newRecipe"
        icon={<PiBookOpenTextDuotone />}
        label="Nova Receita"
      />
      <hr />
      <SidebarLink
        to="/dashboard?tab=comments"
        icon={<PiChatCenteredTextDuotone />}
        label="Comentários"
      />
      <hr />
      <SidebarAdminLink user={user} />
      <hr />
      <SidebarLogout onLogout={handleReset} />
    </div>
  );
}
