
import "@styles/create.css";
import { AuthContextProvider } from "@context/AuthContext";
import CreateForm from "@components/create/CreateForm";

const Create = () => {


  return (
    <AuthContextProvider>
      <CreateForm />
    </AuthContextProvider>
  );
};

export default Create;
