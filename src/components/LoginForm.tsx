import { useState } from 'react';
import loginButtonImage from '../assets/login_button.png'
import loginButtonHoverImage from '../assets/login_button_hover.png'
import { useNavigate } from 'react-router-dom';


const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username:'',
        password:''
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
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();

            if (response.ok) {
                alert('Iniciaste sesión con éxito!');
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
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-72'>
            <input
            type="username"
            name="username"
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="p-2 border rounded"
            />
            <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="p-2 border rounded"
            />
            <button
    type="submit"
    className="group p-0 bg-transparent border-none w-40"
  >
    <div className="relative w-40 h-fit">
      <img
        src={loginButtonImage}
        alt="Login Button"
        className="group-hover:opacity-0 transition-opacity"
      />
      <img
        src={loginButtonHoverImage}
        alt="Login Button Hover"
        className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  </button>
            
        </form>
    );
};

export default LoginForm