import { ReactComponent as Logo } from "../images/clics-b.svg";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
	return (
		<div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-2 bg-white sm:px-5">
			<div className="flex items-center">
				<a href="/">
					<Logo className="w-8 h-8 sm:w-10 sm:h-10" />
				</a>
				<span className="hidden text-2xl font-semibold lg:block">
					<a href="/">chat</a>
				</span>
			</div>

			<div className="flex">
				<ProfileMenu />
			</div>
		</div>
	);
}
