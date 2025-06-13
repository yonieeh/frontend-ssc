import { useState } from 'react';
import registerButtonImage from '../assets/register_button.png'
import registerButtonHoverImage from '../assets/register_button_hover.png'
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username:'',
        email:'',
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
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();

            if (response.ok) {
                alert('Usuario registrado con éxito!');
                navigate('/');
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (err) {
            console.error(err);
            alert('Registro con error');
        }
    };
    return(
        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-72'>
            <input
            type="text"
            name='username'
            placeholder='Username'
            value={formData.username}
            onChange={handleChange}
            required
            className='p-2 border rounded' />
            <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
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
        src={registerButtonImage}
        alt="Register Button"
        className="group-hover:opacity-0 transition-opacity"
      />
      <img
        src={registerButtonHoverImage}
        alt="Register Button Hover"
        className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  </button>
        </form>
    );
};

export default RegisterForm