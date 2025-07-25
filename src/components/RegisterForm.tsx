import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../config/axiosconfig";

const RegisterForm = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		usuario: '',
		correo: '',
		contrasena: ''
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async(e: React.FormEvent) => {
		e.preventDefault();
		try {
			setLoading(true);
			const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/signup`, formData);
			if (response.status === 201) {
				alert('Registro exitoso!');
				navigate('/');
			}
		} catch (err) {
			console.error(err);
			alert('Hubo un error al realizar el registro, inténtalo de nuevo');
		} finally {
			setLoading(false);
		}
	};

	return(
		<form onSubmit={handleSubmit} className='flex flex-col gap-4 justify-center'>
			<input
				type="text"
				name='usuario'
				placeholder='Usuario'
				value={formData.usuario}
				onChange={handleChange}
				required
				className='p-2 border font-[Comic_Sans_MS]'
			/>
			<input
				type="text"
				name="correo"
				placeholder="Correo"
				value={formData.correo}
				onChange={handleChange}
				required
				className="p-2 border font-[Comic_Sans_MS]"
			/>
			<input
				type="password"
				name="contrasena"
				placeholder="Contraseña"
				value={formData.contrasena}
				onChange={handleChange}
				required
				className="p-2 border font-[Comic_Sans_MS]"
			/>

			{!loading && (
				<button
					type="submit"
					className="group p-2 bg-transparent border border-black hover:bg-black hover:text-white justify-center text-center w-[75%] items-center mx-auto transition-colors duration-200 font-[Comic_Sans_MS]"
				>
					Crear cuenta
				</button>
			)}
		</form>
	);
};

export default RegisterForm