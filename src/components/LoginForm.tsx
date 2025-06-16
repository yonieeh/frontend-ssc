import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		correo: '',
		contrasena: ''
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async(e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, formData);
			const result = await response.data;

			if (response.status === 200) {
				alert('Iniciaste sesión con éxito!');
				localStorage.setItem('token', result.access_token);
				localStorage.setItem('username', result.username);
				navigate('/');
			} else {
				alert(`Fallo en el inicio de sesión: ${result.message}`);
			}
		} catch (err) {
			console.error(err);
			alert('Inicio de sesión fallido');
		}

		
	};
	return(
		<form onSubmit={handleSubmit} className='flex flex-col gap-4 justify-center'>
			<input
				type="text"
				name="correo"
				placeholder="Correo"
				value={formData.correo}
				onChange={handleChange}
				required
				className="p-2 border"
			/>
			<input
				type="text"
				name="contrasena"
				placeholder="Contraseña"
				value={formData.contrasena}
				onChange={handleChange}
				required
				className="p-2 border"
			/>
			<button
				type="submit"
				className="group p-2 bg-transparent border border-black hover:bg-black hover:text-white justify-center text-center w-[75%] items-center mx-auto transition-colors duration-200"
			>
				Entrar
			</button>
		</form>
	);
};

export default LoginForm