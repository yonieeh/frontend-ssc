import React from 'react';
import '../style/aboutus.css';
interface Props {
	name:string;
	description:string;
	imageUrl:string;
}

export const MemberCard: React.FC<Props> = ({name, description, imageUrl}) => {

	return(

		<div className = "card">
			<div className="card-inner">
				<div className="card-front">
					<img src={imageUrl} alt ={name} className="profile-pic"></img>
					<h3>{name}</h3>
				</div>
				<div className="card-back">
					<p>{description}</p>
				</div>
			</div>
		</div>
		);
};