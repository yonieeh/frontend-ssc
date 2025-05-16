import React, { useState } from 'react';
import '../pages/aboutus.css';
interface Props {
	name:string;
	description:string;
	imageUrl:string;
}

export const MemberCard: React.FC<Props> = ({name, description, imageUrl}) => {
	const [flipped, setFlipped] = useState(false);

	const toggleFlip = () => {
		setFlipped(!flipped);
	}

	return (
		<article 
			className={`card ${flipped ? 'flipped' : ''}`}
			role="listitem"
			tabIndex={0}
			onClick={toggleFlip}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					toggleFlip();
					console.log("flipped");
				}
			}}
		>
			<div className = "card">
				<div className="card-inner" aria-hidden="true">
					<div className="card-front">
						<img src={imageUrl} alt={name} className="profile-pic"></img>
						<h3>{name}</h3>
					</div>
					<div className="card-back">
						<p>{description}</p>
					</div>
				</div>
			</div>
		</article>
		);
};