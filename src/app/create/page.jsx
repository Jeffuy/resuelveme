import { AuthContextProvider } from "@context/AuthContext";
import CreateForm from "@components/create/CreateForm";
import "@styles/create.css";

const Create = () => {
	return (
		<AuthContextProvider>
			<CreateForm />
		</AuthContextProvider>
	);
};

export default Create;
