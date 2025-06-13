import LoginForm from '../components/LoginForm';
import Navbar from '../components/Navbar';

function LoginPage() {
    return(
        <div className="min-h-screen flex flex-col justify-between relative m-0 pb-10 w-full max-w-none" style={{ backgroundImage: "url('/comic.png')"}}>
            <Navbar/>
            <div className="flex-grow flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-black">
                <h1>Iniciar sesión</h1>
                <LoginForm />
            </div>
        </div>
        </div>

    )
}

export default LoginPage