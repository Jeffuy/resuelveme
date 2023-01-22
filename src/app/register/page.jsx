import RegisterForm from '@components/register/RegisterForm';
import "@styles/loginRegister.css";
import { AuthContextProvider } from "@context/AuthContext";


const Register = () => {
	return (
		<AuthContextProvider>
			<RegisterForm />
		</AuthContextProvider>
	);
};
export default Register;
