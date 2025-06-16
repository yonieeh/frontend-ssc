import Navbar from '../components/Navbar';
import RegisterForm from '../components/RegisterForm';



function RegisterPage() {
    return(
        <div className="min-h-screen flex flex-col justify-between relative m-0 pb-10 w-full max-w-none" style={{ backgroundImage: "url('/comic.png')"}}>
            <Navbar/>
            <div className="flex-grow flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-lg  w-[60%] md:w-[40%] lg:w-[20%] text-black">
                <h2 className="text-3xl font-bold text-center font-[Comic_Neue] mb-6">Registrarse</h2>
                <RegisterForm />
            </div>
        </div>
        </div>        
    )
}

export default RegisterPage