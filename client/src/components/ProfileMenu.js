import classNames from "classnames";
import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";

export default function ProfileMenu() {
	const user = useSelector((state) => state.user.user);
	const profileMenuContainer = useRef(null);
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (!profileMenuContainer.current.contains(event.target)) {
				if (!showProfileMenu) return;
				setShowProfileMenu(false);
			}
		};

		window.addEventListener("click", handleOutsideClick);

		return () => window.removeEventListener("click", handleOutsideClick);
	}, [showProfileMenu, profileMenuContainer]);

	useEffect(() => {
		const handleEscape = (event) => {
			if (!showProfileMenu) return;

			if (event.key === "Escape") {
				setShowProfileMenu(false);
			}
		};

		document.addEventListener("keyup", handleEscape);
		return () => document.removeEventListener("keyup", handleEscape);
	}, [showProfileMenu]);

	const handleShow = () => {
		setShowProfileMenu(!showProfileMenu);
	};

	const handleLogout = async () => {
		setShowProfileMenu(false);
		dispatch(logout());

		window.location.reload();
	};

	return (
		<div className="relative inline-block text-left">
			<div className="relative ml-3">
				<div ref={profileMenuContainer}>
					<button
						className="flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-white"
						id="user-menu"
						aria-haspopup="true"
						onClick={handleShow}
					>
						<span className="sr-only">Open user menu</span>
						<img
							className="w-8 h-8 rounded-full min-h-8 min-w-8"
							src={user.imageUrl}
							alt=""
						/>
					</button>
				</div>

				<div
					className={classNames(
						"absolute right-0 w-48 py-1 mt-2 z-50 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100",
						{ block: showProfileMenu, hidden: !showProfileMenu }
					)}
					role="menu"
					aria-orientation="vertical"
					aria-labelledby="user-menu"
				>
					<div className="py-1">
						<span className="block px-4 py-2 text-sm text-center text-gray-700">
							⊚{user.username}
						</span>
					</div>

					<span
						onClick={handleLogout}
						className="block px-4 py-2 text-sm text-right menu-item cursor-pointer hover:bg-secondary-2"
						role="menuitem"
					>
						salir{" "}
						<i className="pl-1 text-gray-500 far fa-sign-out"></i>
					</span>
				</div>
			</div>
		</div>
	);
}
